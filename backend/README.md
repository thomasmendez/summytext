# summytext backend

FastAPI service that summarizes text and extracts sentiment + topics. Runs as a
containerized AWS Lambda (image on ECR) and locally with uvicorn.

Models (baked into the Docker image, downloaded once at build time):
- **Summary** — GPT2-medium via `bert-extractive-summarizer`
- **Sentiment** — flair `sentiment`
- **Topics** — flair `ner-ontonotes-large` (named-entity spans)

## Run locally

Requires Python 3.12.

```bash
make env-linux        # or env-windows: create venv + install deps
make install-dev      # deps + test packages (pytest, httpx)
make bake-models      # download models into ./model_cache (one-time, needs network)
make serve            # uvicorn on http://127.0.0.1:8000
```

`serve` and `test` need `bake-models` to have run first.

## Test

```bash
make test
```

## API

`POST /api/v1/predict` (no trailing slash — see `app/api/api_v1/endpoints/predict.py`)

```json
// request
{ "text": "..." }

// response
{
  "summary": "...",
  "sentiment": "POSITIVE",
  "topic_labels": { "Apple": "ORG" },
  "topics": ["Apple"],
  "labels": ["ORG"]
}
```

In-process rate limit: 60 requests/hour per IP.

## Environment

- `CORS_ORIGINS` — comma-separated allowed origins (set via the CloudFormation stack param)
- `ENV`, `PROXY` — when `PROXY=true` and `ENV` is not `local`, mounts the app under `/{ENV}` root path

## Build & deploy

Docker image targeting `public.ecr.aws/lambda/python:3.12`:

```bash
docker build -t summytext-backend .
```

The build runs `scripts/bake_models.py` to cache models under `/var/task` (not
`/tmp`, which Lambda wipes on each cold start). See `infra/` for the
CloudFormation template and cold-start notes.
