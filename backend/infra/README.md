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
- **Allow SAM CLI IAM role creation**: `Y` (the template names the Lambda
  execution role explicitly, which requires `CAPABILITY_NAMED_IAM`)
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
