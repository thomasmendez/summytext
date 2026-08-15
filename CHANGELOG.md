# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.1] - 2026-08-14

Bump torch to 2.12.1+cpu

## [2.0.0] - 2026-08-14

Full-stack rewrite and deployment refactor: the backend is now a self-contained,
faster cold-start deploy, and the frontend was rebuilt from scratch on a modern
stack.

### Backend

- **Self-contained SAM deploy** (`backend/infra/`): ECR repo, container-image
  Lambda, IAM role, log group, and public endpoint provisioned via
  `sam build` / `sam deploy` — no CI or Terraform submodule dependency.
- **Lambda Function URL** replaces API Gateway. It honors the full Lambda
  timeout, so a ~60s cold-start request completes instead of hitting API
  Gateway's 30s ceiling and returning a 504.
- **Models baked into the image at build time** (`scripts/bake_models.py`, with
  offline mode enforced at runtime) so nothing is downloaded on cold start.
- Lazy, timing-instrumented model loading so heavy imports don't block Lambda
  init.
- Rate-limit middleware no longer counts CORS preflight (`OPTIONS`) requests
  against a caller's hourly quota.
- Dependencies pinned and switched to CPU-only PyTorch wheels; dropped unused
  `spacy`. Added test scaffolding and cold-start/cost analysis notes.

### Infrastructure

- **Migrated to AWS SAM / CloudFormation stacks**, replacing the old GitHub
  Actions + Terraform-module git submodule (`workflows/`) deployment. Both
  backend and frontend now ship from in-repo SAM templates (`backend/infra/`,
  `frontend/infra/`) via `sam build` / `sam deploy` — no CI pipeline or external
  Terraform repo required.

### Frontend

- **Rewritten from scratch**: React 17 → 19, JS → TypeScript, CRA/Webpack →
  **Vite**, MUI/Emotion → **Tailwind CSS**, Redux Toolkit 1 → 2, and
  `axios`/`axios-retry` → native `fetch`. Testing moved to Playwright e2e +
  `msw` mocks; `react-router-dom` replaced by a small in-house router (only two
  routes). Legacy app (incl. ~58k-line `yarn.lock`) deleted outright.
- **Fewer API calls**: request retries cut from 10 → 2 with a 120s timeout.
  Cold requests now succeed on the first call over the Function URL instead of
  retrying into the old 30s ceiling and spawning extra cold containers.
- **Deployment infra** (`frontend/infra/`): SAM template for a private S3 bucket
  + CloudFront (Origin Access Control) per environment, with SPA fallback
  routing. No custom domain/Route 53/ACM yet.
- **Removed**: Google Analytics pageview tracking; PDF-to-text input (dropped
  the `pdfjs-dist` arbitrary-JS-execution vulnerability); speech-to-text input
  (low-value). PDF/speech components kept in-repo for reference.

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
