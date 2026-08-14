# summytext backend infra

`template.yaml` is an AWS SAM template. It provisions, per environment
(`dev`/`stg`/`prd`):
- the ECR repository the built image is pushed to
- a container-image Lambda function running the predict API
- an HTTP API (API Gateway v2) in front of it, stage-named after the environment

Unlike the old plain-CloudFormation version of this template, `sam build` /
`sam deploy` **do** build the Docker image (from `../Dockerfile`) and push it
to ECR as part of the deploy — you don't build or push the image by hand, and
this no longer depends on GitHub Actions or any other CI system. A deploy from
your machine is the whole pipeline.

## Prerequisites

- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
  installed (`sam --version`)
- Docker running locally (SAM shells out to it to build the image)
- Your admin role/profile configured locally and active, e.g. via
  `aws configure` / `AWS_PROFILE` / `aws sso login`

### "Error: Running AWS SAM projects locally requires a container runtime"

SAM connects to Docker directly (via `DOCKER_HOST`/the default socket), not
through the `docker` CLI's config, so `docker` commands working doesn't
guarantee SAM can connect. The fix depends on which Docker you have:

**Docker Desktop (macOS, or Linux with Docker Desktop installed):** Desktop
doesn't expose the standard `/var/run/docker.sock` by default, which is what
SAM looks for. Either:
- Docker Desktop → Settings → Advanced → enable **"Allow the default Docker
  socket to be used"**, restart Desktop, retry — or
- point SAM at Desktop's actual socket:
  ```sh
  docker context inspect desktop-linux -f '{{.Endpoints.docker.Host}}'
  # typically: unix:///home/<you>/.docker/desktop/docker.sock
  export DOCKER_HOST=unix:///home/<you>/.docker/desktop/docker.sock
  ```
  Add the `export` to your shell profile if you want it to persist.

**Docker Engine (`dockerd`, e.g. installed via apt on Ubuntu/Mint):** the
default socket is already at the standard path, so `DOCKER_HOST` usually
doesn't need to be set at all — Desktop-specific fixes above don't apply here.
The far more likely cause is that your user isn't in the `docker` group yet
(the socket is `root:docker`-owned, mode `0660`):
```sh
groups $USER   # look for "docker" in the list
sudo usermod -aG docker $USER
```
Then **fully log out and back in** (a new terminal alone isn't enough — group
membership is read at login) and confirm with `docker run --rm hello-world`
before retrying `sam build`.

## One-time bootstrap: adopting the existing ECR repositories

`summytext-backend-dev`, `summytext-backend-stg`, and `summytext-backend-prd`
already exist today (created by hand, with real image history from the old
GitHub Actions pipeline). CloudFormation can't create a repository that
already exists, so the first deploy per environment needs to import the
existing repo into the stack instead of creating it fresh. `sam deploy`
doesn't expose CloudFormation's `IMPORT` change-set type directly, so this one
step uses `sam package` + the AWS CLI; every deploy after this is plain `sam
deploy`.

```sh
cd backend/infra

sam build

# Builds the image, pushes it to the existing repo, and writes a fully
# resolved template (ImageUri filled in) to packaged.yaml.
sam package \
  --image-repository <account>.dkr.ecr.<region>.amazonaws.com/summytext-backend-dev \
  --output-template-file packaged.yaml

aws cloudformation create-change-set \
  --stack-name summytext-backend-dev \
  --change-set-name import-ecr \
  --change-set-type IMPORT \
  --resources-to-import '[{"ResourceType":"AWS::ECR::Repository","LogicalResourceId":"EcrRepository","ResourceIdentifier":{"RepositoryName":"summytext-backend-dev"}}]' \
  --template-body file://packaged.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters ParameterKey=Environment,ParameterValue=dev

aws cloudformation execute-change-set \
  --stack-name summytext-backend-dev \
  --change-set-name import-ecr
```

Repeat for `stg` and `prd`. After the import, the stack exists and every later
deploy for that environment goes through `sam deploy --guided` (or `sam
deploy` once configured) like normal.

A genuinely new environment (no pre-existing repo) doesn't need this step —
just run the guided deploy below and let SAM create the repo for you.

## Deploy

First deploy for an environment (interactive — walks you through stack name,
region, parameters, and the image repository, then saves your answers):

```sh
cd backend/infra
sam build
sam deploy --guided
```

You'll be prompted for, among other things:
- **Stack Name**: `summytext-backend-dev` (`-stg` / `-prd` for the others)
- **AWS Region**: your account's deploy region
- **Parameter Environment**: `dev` / `stg` / `prd` — must match the stack name
- **Parameter MemorySize / Timeout / LogRetentionInDays**: accept the defaults
  unless an environment needs different sizing
- **Confirm changes before deploy**: `Y` recommended, at least for the first
  few deploys per environment
- **Allow SAM CLI IAM role creation**: `Y` — note this prompt only ever saves
  `CAPABILITY_IAM` to `samconfig.toml`, but this template names the Lambda
  execution role explicitly (`RoleName` on `LambdaExecutionRole`), which
  requires the stronger `CAPABILITY_NAMED_IAM`. The guided deploy's first
  changeset will fail with `Requires capabilities : [CAPABILITY_NAMED_IAM]`.
  Fix it by hand afterwards: open the generated `samconfig.toml` and change
  `capabilities = "CAPABILITY_IAM"` to `capabilities = "CAPABILITY_NAMED_IAM"`,
  then re-run `sam deploy`.
- **Image Repository for LambdaFunction**: the existing
  `summytext-backend-<env>` ECR repo URI from the bootstrap step above (or let
  SAM create/manage one if this is a brand-new environment)
- **Save arguments to samconfig.toml**: `Y` — this is what lets subsequent
  deploys skip the prompts

Every deploy after that, for that environment:

```sh
sam build
sam deploy
```

Guided deploy writes environment-specific settings into `samconfig.toml`
under a config env (SAM defaults to `default`, but pass `--config-env dev` /
`--config-env stg` / `--config-env prd` on every guided deploy if you're
running more than one environment from the same checkout, then reuse the same
flag on plain `sam deploy` calls to target that environment).

## Validate

```sh
sam validate --template-file template.yaml
# or, for a more thorough lint:
pip install cfn-lint && cfn-lint template.yaml
```

## Troubleshooting: cold start / `Sandbox.Timedout` on first request

The first deploy to a fresh environment can fail its first invocation(s) with
`503 {"message":"Service Unavailable"}` from the API, or a direct
`aws lambda invoke` returning `errorType":"Sandbox.Timedout"`. Root cause and
what's already tuned for it:

- **Lambda's init phase has a fixed, non-configurable 10-second cap** —
  unrelated to the `Timeout` parameter, which only covers the *invoke* phase.
  You'll see `INIT_REPORT ... Phase: init ... Status: timeout` in CloudWatch
  even on a healthy deploy; this is expected. `app/models.py` lazy-loads all
  three models on first request specifically so the heavy work happens during
  *invoke* (governed by `Timeout`), not *init* — don't move model loading to
  module scope, it would hit the 10s cap on every cold start.
- **The real cost is `Classifier.load('ner-ontonotes-large')`** — of the three
  models, it's by far the slowest to load on a genuinely cold Lambda
  environment (tens of seconds, observed up to ~65s even with the fixes
  below), vs. low single digits for the sentiment classifier and summarizer.
  It loads near-instantly (<1s difference from the others) when run locally
  via `docker run` with the same image — the gap is Lambda-specific.
- **Why it's Lambda-specific**: container-image Lambdas load image layers
  **on-demand** the first time an execution environment touches them, rather
  than having the full image already resident on disk like a local `docker
  run`. A genuinely cold environment pays a network-fetch cost proportional to
  how much of the (baked-in, multi-GB) model data that request actually
  touches. This is slow, not hung — given enough `Timeout`, it does complete.
- **What's tuned to work around it**:
  - `MemorySize` defaults to `10240` (the max) — Lambda allocates CPU
    proportional to memory, which speeds up both the torch/transformers/flair
    imports and model deserialization.
  - `Timeout` defaults to `900` (the max) so a slow cold invoke_ never gets
    killed mid-load.
  - `Dockerfile` sets `JOBLIB_MULTIPROCESSING=0` and
    `TOKENIZERS_PARALLELISM=false` — Lambda's `/dev/shm` is heavily
    restricted, which breaks joblib's default multiprocessing backend (you'll
    see a `joblib will operate in serial mode` warning in the logs even with
    this set — that one call site already falls back gracefully; these vars
    just make sure nothing else in the dependency chain tries to use
    multiprocessing at all). Note: this did **not** turn out to be the cause
    of the timeouts (the real cause is the on-demand image loading above) —
    it's left in as cheap insurance against a real known Lambda/joblib
    footgun. We also tried `OMP_NUM_THREADS=1` to rule out CPU
    oversubscription; it made cold loads slower (forces single-threaded
    torch math) with no effect on the hang, so it was reverted.
  - `app/models.py` has temporary `[timing]` print statements around each
    import and each model load — cheap, and useful if cold-start behavior
    needs re-diagnosing later (e.g. after a dependency bump). Safe to remove
    once things feel settled.

- **This is still not solved for real user traffic.** `HttpApi` (API Gateway
  v2) has a **hard 30-second integration timeout that cannot be raised**, no
  matter what `Timeout` is set to. A real cold request through the API will
  still fail even though the same request via direct `aws lambda invoke`
  (which isn't subject to that cap) now succeeds. The two realistic fixes,
  neither applied yet:
  - **Provisioned Concurrency** — keeps N pre-initialized environments always
    warm so real requests never hit a true cold start. Ongoing cost for the
    idle capacity.
  - **Move baked model weights to EFS** instead of the container image — AWS's
    documented pattern for large-model Lambdas, avoids on-demand image-layer
    loading entirely. No idle-capacity cost, but a bigger re-architecture.

- **Diagnosing directly against Lambda, bypassing the API's 30s cap**:
  ```sh
  aws lambda invoke --function-name <function-name> \
    --payload file://payload.json \
    --cli-read-timeout 0 \
    --cli-binary-format raw-in-base64-out response.json
  cat response.json
  aws logs tail /aws/lambda/<function-name> --since 10m
  ```
  `payload.json` needs to be a full API Gateway **v2** (HTTP API) proxy event
  — `Mangum` infers the handler type from the event shape and a v1/REST-API
  shaped payload fails with `RuntimeError: The adapter was unable to infer a
  handler`:
  ```json
  {
    "version": "2.0",
    "routeKey": "$default",
    "rawPath": "/api/v1/predict/",
    "rawQueryString": "",
    "headers": { "content-type": "application/json" },
    "requestContext": {
      "http": { "method": "POST", "path": "/api/v1/predict/", "protocol": "HTTP/1.1", "sourceIp": "127.0.0.1", "userAgent": "curl/8.0" },
      "requestId": "test-request-id",
      "routeKey": "$default",
      "stage": "test"
    },
    "body": "{\"text\":\"Apple announced record iPhone sales this quarter.\"}",
    "isBase64Encoded": false
  }
  ```

## Known gap: stage-prefix routing (`ENV`/`PROXY` not set)

`app/main.py` only strips the API Gateway stage prefix (e.g. `/test`) from
incoming request paths when both `ENV` and `PROXY` environment variables are
set (`env != 'local'` and `proxy == 'true'`) — this was previously baked in by
the old GitHub Actions pipeline writing `app/.env` at Docker build time. The
new SAM-based `Dockerfile`/`template.yaml` set neither, so `LambdaFunction`
currently has no `Environment: Variables:` block. Requests through the real
`ApiEndpoint` (which includes the stage prefix) may 404 as a result — not yet
confirmed against a working deploy end-to-end. If so, the fix is adding
`Environment: Variables: { ENV: !Ref Environment, PROXY: 'true' }` to
`LambdaFunction` in `template.yaml`.

## Verify the fix (no more downloads at cold start)

Before deploying to AWS at all, confirm the image itself doesn't need the
network by running it locally:

```sh
cd backend
docker build -t summytext-backend:local .
docker run -p 9000:8080 summytext-backend:local
# in another terminal, twice in a row:
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d '{"resource":"/api/v1/predict/","path":"/api/v1/predict/","httpMethod":"POST","headers":{"Content-Type":"application/json"},"body":"{\"text\":\"Apple announced record iPhone sales this quarter.\"}","isBase64Encoded":false}'
```

Watch the `docker run` logs — there should be **no** `Downloading ...` lines on
either call. The first call will still be slower (lazy-loading the models into
memory for the first time in this container); the second call should be fast.

After deploying to AWS, tail CloudWatch Logs for the function and confirm the
same: no download lines, and (if present) `INIT_REPORT` well under the 10s
Lambda init cap.
