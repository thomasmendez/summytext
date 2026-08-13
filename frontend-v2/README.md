# Sum My Text — Frontend (v2)

The v2 web client for **Sum My Text**, a tool that summarizes text and reports
its topics and emotional sentiment. This is a ground-up rewrite of the original
`frontend/` with a lighter stack:

## Setup

```bash
cd frontend-v2
npm install
cp .env.example .env
```

### Environment variables

| Variable                   | Purpose                                                        | Example                     |
| -------------------------- | ------------------------------------------------------------- | --------------------------- |
| `VITE_SUM_MY_TEXT_SERVICE` | Base URL of the summarizer backend                            | `http://localhost:8000`     |
| `VITE_MOCKS_ENABLED`       | When `"true"`, starts MSW and serves mocked API responses     | `"true"`                      |

The app calls `POST ${VITE_SUM_MY_TEXT_SERVICE}/api/v1/predict/`.

## Running the app

### Against a real backend

Start the FastAPI backend (see `../backend/README.md` — `make serve`, defaults to
`http://localhost:8000`), then:

```bash
npm run dev
```

Open the URL Vite prints (defaults to http://localhost:5173).

### Running with mocks

No backend needed — MSW intercepts the predict call and returns a fixture:

```bash
VITE_MOCKS_ENABLED="true"
```

Mock request handlers and response fixtures live in `src/mocks/`. The happy-path
response is in `src/mocks/__fixtures__/analysis.ts`; alternate scenarios
(server error, service unavailable, network failure, slow) are in
`src/mocks/scenarios.ts`.

## Building

```bash
npm run build     # tsc -b (type-check) then vite build -> dist/
npm run preview   # serve the production build locally
```

Lint with:

```bash
npm run lint
```

## Testing (end-to-end)

Playwright drives the app in a real browser. The test config
(`playwright.config.ts`) starts its own dev server with **mocks enabled**, so you
do **not** need a backend running to test.

First-time setup — install the browser binaries:

```bash
npx playwright install
```

Run the tests:

```bash
npm run test:e2e        # headless, all browsers (chromium, firefox, webkit)
npm run test:e2e:ui     # interactive UI mode for debugging
```

Target a single browser while iterating:

```bash
npx playwright test --project=chromium
```

### What's covered

- **`e2e/navigation.spec.ts`** — footer navigation between Home / About /
  Privacy, correct content per page (asserted by `data-testid`), client-side
  navigation (no full reload), and the 404 view.
- **`e2e/analysis.spec.ts`** — submitting text returns and renders the mocked
  summary, topics, and sentiment (assertions driven from the fixture); submit
  stays disabled until text is entered.
- **`e2e/errors.spec.ts`** — error edge cases: API error (500), service
  unavailable (503), network/connection failure (with the service's retries),
  the "taking longer than expected" notice on a slow request, and dismissing the
  error banner.

Tests select elements by `data-testid` (see the `playwright-e2e` skill), and
error/slow behavior is simulated by swapping the active MSW handler at runtime
via `window.__mswUse('<scenario>')` (wired up in `src/main.tsx`).

> **Not yet covered:** the request-timeout error path. The service aborts after
> `REQUEST_TIMEOUT_MS` (120s), which is impractical to wait on in a test. A
> commented stub in `e2e/errors.spec.ts` documents how to enable it once
> `REQUEST_TIMEOUT_MS` is made configurable via an env var.

## Regenerating the MSW worker

`public/mockServiceWorker.js` is generated and committed. Only regenerate it when
upgrading MSW:

```bash
npx msw init public/ --save
```
