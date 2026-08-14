# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.0] - 2026-08-??

Backend deployment refactor (`refactor/deployment`). Reworked how the backend is
packaged, deployed, and exposed, targeting a self-contained deploy and a faster,
more reliable path for the infrequent but heavy cold-start workload.

### Added

- **AWS SAM template** (`backend/infra/template.yaml`) as the backend's
  infrastructure-as-code: ECR repository, container-image Lambda, IAM role, log
  group, and public endpoint, all provisioned with `sam build` / `sam deploy`
  from your machine (no CI dependency). Documented in `backend/infra/README.md`.
- **Lambda Function URL** as the public endpoint (`AuthType: NONE`) for direct
  access to the function. Unlike API Gateway's hard 30s integration timeout, a
  Function URL honors the full Lambda timeout, so a cold-start request (~60s
  while models load) completes instead of returning a 504.
- **Models baked into the container image at build time**
  (`scripts/bake_models.py`, with `HF_HUB_OFFLINE` / `TRANSFORMERS_OFFLINE`
  enforced at runtime) so no model files are downloaded on cold start.
- Lazy, timing-instrumented model loading (`app/models.py`) so heavy imports
  don't block Lambda init.
- Backend test scaffolding (`backend/tests/`) and dev requirements.
- Cold-start / cost analysis notes (`backend/infra/cold-start-optimization.md`).

### Changed

- **Fewer frontend API calls** (`frontend/src/services/sumMyTextService.js`):
  request retries reduced from **10 to 2** with exponential backoff, plus an
  explicit 120s timeout. Cold requests now complete on the first call over the
  Function URL, so the client no longer retries into the 30s ceiling and no
  longer risks spawning additional cold containers per retry.
- Rate-limit middleware (`app/main.py`) no longer counts CORS preflight
  (`OPTIONS`) requests against a caller's hourly quota.
- Deployment mechanism is now the in-repo SAM template rather than the
  Terraform-module git submodule (`workflows/`) driven by GitHub Actions.
- Backend dependencies pinned and switched to CPU-only PyTorch wheels; dropped
  the unused `spacy` dependency.

### Removed

- API Gateway from the backend request path, replaced by the Lambda Function URL.
- **PDF-to-text input** from the frontend
  (`frontend-v2/src/components/InputTextbox.tsx`). The extraction path relied on
  `pdfjs-dist`, which carried a high-severity vulnerability (arbitrary
  JavaScript execution when parsing a malicious PDF). The convenience of
  importing text from a PDF isn't worth reintroducing that risk, so the button
  is commented out of the input row. The `PdfToTextButton` component is kept in
  the repo for reference.
- **Speech-to-text input** from the frontend
  (`frontend-v2/src/components/InputTextbox.tsx`). Removed as a low-value,
  rarely used feature. The `SpeechToTextButton` component is kept in the repo
  for reference and can be re-enabled by restoring its import and rendering it
  in the input row.

## [1.0.0] - 2024-06-21

Original production release. Development began November 2022; this snapshot
reflects the last commit before the project went untouched for roughly two
years (`f9c4b50`, 2024-06-21) — tagged `v1.0.0` as the save point immediately
before the v2 rewrite above.

### Overview

| Feature | Description |
| --- | --- |
| Tool Name | Sum My Text |
| Purpose | Summarize text, extract topics, and provide overall sentiment |
| Character Limit | 5000 characters, approximately one page of text |
| Input Options | Typing, copy-pasting, or importing from a PDF file |
| Initial Load Time | Summarizing text for the first time may take a couple of seconds |
| Usage Limit | A set limit on the number of times a user can summarize over a given period |
| Abuse Prevention | Excessive usage may result in an error; users are advised to wait and try again later |
| AI Models Used | GPT2-medium (extractive summarization via `bert-extractive-summarizer`), flair `sentiment` classifier, flair `ner-ontonotes-large` NER/topic classifier |
| Supported Language | English |
| Data Storage | The tool does not store any text data provided for summarization |

### Architecture

Serverless AWS architecture (diagrammed in
`docs/images/SumMyTextArchitectureDiagram.png`):

- **Frontend**: React app hosted as a static site on **S3**, served through
  **CloudFront**.
- **Domain/TLS**: **Route53** for DNS and **Certificate Manager (ACM)** for
  HTTPS certificates, both fronting CloudFront.
- **Backend API**: **API Gateway** routes requests to a **Lambda** function
  running as a container image, with the image stored in and pulled from
  **Elastic Container Registry (ECR)**.
- **Monitoring**: **CloudWatch** for logs and metrics across the Lambda
  function.

### Infrastructure as Code

Deployment infrastructure lived in a separate **Terraform** module
repository, included in this project as a **git submodule** at `workflows/`
(`thomasmendez/workflows` on GitHub), driven by GitHub Actions workflows
(`.github/workflows/backend_*_deployment.yml`,
`.github/workflows/frontend_*.yml`) that build/push Docker images and apply
the Terraform modules.
