# Cold-start / response-time optimization notes

Reference point captured before making any changes. Documents *why* the
deployed API is slow to respond on a cold Lambda, and the options considered
to fix it. See `template.yaml` and `app/models.py` for the current state.

## Symptom observed

Calling the deployed endpoint from the frontend produces **4 retries at
~29.19s each, then a success on the 5th call at ~9.51s**. Total user-facing
wait is close to 2 minutes on a cold start.

CloudWatch for a single cold invocation:

```
INIT_REPORT Init Duration: 9999.79 ms    Phase: init    Status: timeout
[timing] loading summarizer...
[timing] summarizer loaded in 1.9s
[timing] loading sentiment classifier...
[timing] sentiment classifier loaded in 3.7s
[timing] loading topic classifier...
[timing] topic classifier loaded in 31.2s
execution time: 20.339804887771606s
REPORT Duration: 64754.09 ms  Billed Duration: 64755 ms  Memory Size: 10240 MB  Max Memory Used: 9001 MB
```

## Diagnosis

**Cold start is ~64s**, broken down from the logs:

| Phase | Time |
|---|---|
| Model load (`summarizer` 1.9s + `sentiment` 3.7s + `ner-ontonotes-large` **31.2s**) | ~37s |
| Inference / execution | ~20s |
| `torch`/`flair`/`transformers` imports | remainder |

Two root causes:

1. **The 30s API Gateway ceiling.** The stack fronts the Lambda with an
   **HTTP API** (`AWS::Serverless::HttpApi` in `template.yaml`). HTTP APIs (v2)
   have a **hard 30s integration timeout that cannot be raised** — only
   Regional/Private *REST* APIs can be increased (up to 300s) via Service
   Quotas. So every *cold* request 504s at the gateway around 29s. The frontend
   retries; each retry keeps the Lambda alive longer until one request finally
   lands on the now-warm container (the 9.51s success). That is the
   "4 failures then success" pattern.

2. **The models are large and slow.** `ner-ontonotes-large` alone is ~31s of
   load time and the main reason `Max Memory Used` is ~9 GB (function is sized
   at the 10240 MB max). Inference is another ~20s.

**Not the real problem:** `INIT_REPORT ... Status: timeout` is benign. Lambda's
init phase has a hard 10s budget; when imports exceed it, Lambda re-runs init
inside the first invocation. It does not cost anything separately — the 64s is
the real issue. (Note models are lazy-loaded on first request via the `get_*()`
helpers in `app/models.py`, not at import, so init itself isn't loading them.)

## Options considered

### Rejected: Provisioned Concurrency

Keeps instances warm 24/7. At 10240 MB that is roughly
`10 GB x $0.0000041667/GB-s x ~2.6M s/month ~= $108/month per instance`, before
per-request cost. Far over the "a few dollars a month" budget for an endpoint
called a few times a month. **No.**

### Rejected: Lambda SnapStart

Does **not** support container-image Lambdas, and the ~4 GB of baked-in models
cannot fit the 250 MB zip limit. Not applicable to this deployment.

### Chosen direction (cheap, in priority order)

1. **Swap the HTTP API for a Lambda Function URL** — free. Function URLs honor
   the full Lambda timeout (up to 15 min) instead of the 30s cap, so cold
   requests *complete* (~64s) instead of 504-ing and triggering retries. Fixes
   the "fails 4 times" behavior immediately. Requires updating `template.yaml`
   (`FunctionUrlConfig` in place of the `HttpApi` event) and the
   `ENV`/`root_path` proxy handling in `app/main.py`.

2. **Shrink / consolidate the models** — the real win. Dropping
   `ner-ontonotes-large` (smaller NER such as `ner-ontonotes`/`ner`, or the
   planned SmolLM2-360M via llama.cpp consolidation) would:
   - cut ~31s of load and much of the ~20s inference, likely getting cold start
     **under 30s** (so even a plain HTTP API works again), and
   - drop memory from ~9 GB toward ~2-3 GB, which also lowers per-request cost.

   Note: the deployed code on this branch still runs **flair + GPT2-medium**
   (`app/models.py`); the SmolLM2/llama.cpp migration has not landed here yet.

3. **Pre-warm for demos instead of paying to stay warm** — since demos are
   scheduled by hand, hitting the endpoint once (waiting out the cold start)
   before showing people is free. If automated warmth is wanted later, an
   EventBridge scheduled ping every ~5 min is ~$0.15/mo, but only helps if
   model loading moves from lazy (`get_*()`) into module import so models
   persist in the warm container. For a few calls a month, manual pre-warm is
   the better value.

## Recommendation

Do **#1 (Function URL) + #2 (shrink models)**. Together they yield a working,
non-retrying endpoint that is likely under 30s cold and a few seconds warm, at
*lower* monthly cost than today (less memory per invocation) with no always-on
charges. Skip provisioned concurrency; pre-warm manually before demos.

## References

- [API Gateway integration timeout increase (HTTP APIs not eligible)](https://aws.amazon.com/about-aws/whats-new/2024/06/amazon-api-gateway-integration-timeout-limit-29-seconds/)
- [Lambda Function URLs support the full function timeout (up to 15 min)](https://codestax.ai/resources/inside-the-stack/hit-a-30s-timeout-here-s-how-lambda-function-urls-save-the-day)
- [SnapStart does not support container images](https://repost.aws/questions/QUH4_1tULxT6CqSQ7ubuOQPQ/snapstart-for-lambda-container)
