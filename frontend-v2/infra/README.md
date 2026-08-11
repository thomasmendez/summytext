# summytext frontend infra

`template.yaml` is an AWS SAM template (plain CloudFormation resources — SAM
deploys it the same as the backend). It provisions, per environment
(`dev`/`stg`/`prd`):

- a **private S3 bucket** (`summytext-frontend-<env>`) holding the Vite build
- a **CloudFront distribution** in front of it, reaching the bucket through
  **Origin Access Control (OAC)** — the bucket blocks all public access; only
  this distribution can read it
- SPA fallback: `403`/`404` from the bucket are rewritten to `/index.html` with
  a `200`, so client-side deep links (`/about`, `/privacy`) survive a refresh

No custom domain — the site serves on the CloudFront default domain
(`https://<id>.cloudfront.net`). Route 53 + ACM can be added later if a real
domain is needed (v1 had this; not carried over yet).

Unlike the backend template, **the deploy does not upload the app**. SAM only
creates the bucket + distribution; you build the frontend and `aws s3 sync` the
output into the bucket as a separate step (below). Splitting them keeps
infra changes and content pushes independent — you redeploy the stack rarely,
but ship new assets often.

## Environments (local / dev / stg / prd)

The backend URL is baked into the bundle at **build time** via Vite's mode
system. One env file per mode drives which backend a build points at:

| Mode / env | Vite env file      | Build command       | Backend            |
| ---------- | ------------------ | ------------------- | ------------------ |
| local      | `.env` (gitignored, from `.env.example`) | `npm run dev` | localhost or MSW mocks |
| dev        | `.env.dev`         | `npm run build:dev` | dev Lambda URL     |
| stg        | `.env.stg`         | `npm run build:stg` | stg Lambda URL     |
| prd        | `.env.prd`         | `npm run build:prd` | prd Lambda URL     |

`.env.dev`/`.env.stg`/`.env.prd` are committed but ship with placeholder URLs —
fill each `VITE_SUM_MY_TEXT_SERVICE` with that environment's backend Function
URL (the `FunctionUrl` output from `backend/infra`'s `sam deploy`, **without**
the trailing slash). Local dev stays personal in the gitignored `.env`.

## Prerequisites

- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
  (`sam --version`) — or the plain `aws cloudformation` CLI; this template has no
  SAM-only resources, so either deploys it
- Your admin role/profile configured and active (`aws configure` / `AWS_PROFILE`
  / `aws sso login`)
- Node 20.19+/22.12+ and npm (to build the app)

No Docker needed here (unlike the backend).

## Deploy the infrastructure

First deploy for an environment (interactive — saves your answers to
`samconfig.toml`):

```sh
cd frontend-v2/infra
sam deploy --guided
```

You'll be prompted for:
- **Stack Name**: `summytext-frontend-dev` (`-stg` / `-prd` for the others)
- **AWS Region**: your account's deploy region
- **Parameter Environment**: `dev` / `stg` / `prd` — match the stack name
- **Confirm changes before deploy**: `Y` recommended
- **Allow SAM CLI IAM role creation**: `Y`
- **Save arguments to samconfig.toml**: `Y`

Every deploy after that, for that environment:

```sh
sam deploy
```

Running more than one environment from the same checkout? Pass
`--config-env dev|stg|prd` on the guided deploy and reuse it on later
`sam deploy` calls to target that environment.

Note the stack outputs — `BucketName`, `DistributionId`, and `SiteUrl`:

```sh
sam list stack-outputs --stack-name summytext-frontend-dev
```

## Ship the app

Build for the target environment, sync to its bucket, then invalidate the
CloudFront cache so viewers get the new assets immediately:

```sh
cd frontend-v2
npm ci
npm run build:dev          # or build:stg / build:prd

aws s3 sync dist/ s3://summytext-frontend-dev --delete
aws cloudfront create-invalidation \
  --distribution-id <DistributionId-from-outputs> \
  --paths '/*'
```

`--delete` removes stale files (old hashed JS/CSS) from the bucket. The
`/*` invalidation is the simple, correct choice; CloudFront gives 1000 free
invalidation paths/month, so `/*` per deploy is effectively free at this
traffic.

## Validate

```sh
sam validate --template-file template.yaml
# or a stricter lint:
pip install cfn-lint && cfn-lint template.yaml
```

## Notes / known gaps

- **CORS**: the browser calls the backend Function URL cross-origin. The backend
  drives its allowed origins from its `ENV` var (see `backend/app/main.py`) — the
  CloudFront domain for each environment must be in that allow-list, or the
  predict call is blocked. Add the `SiteUrl` output to the backend's CORS
  origins for that environment.
- **No custom domain / TLS cert**: serves on the CloudFront default domain only.
  Add `AWS::CertificateManager::Certificate` (in us-east-1) + an `Aliases` entry
  and a Route 53 record when a real domain is wanted.
- **First deploy is slow**: a new CloudFront distribution takes ~5–15 min to
  finish deploying before `SiteUrl` responds.
