# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
