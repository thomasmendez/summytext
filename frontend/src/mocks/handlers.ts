import { http, HttpResponse } from 'msw'
import AnalysisMock from './__fixtures__/analysis'

// Base URL the app calls the summarizer service on. Service- and cloud-agnostic:
// in dev/tests it points at a stub host, in prod at the Lambda Function URL.
export const baseUrl = import.meta.env.VITE_SUM_MY_TEXT_SERVICE

// The frontend POSTs here (note the trailing slash the service uses).
export const predictUrl = `${baseUrl}/api/v1/predict/`

// Happy path is the default; error/slow variants live in scenarios.ts and are
// applied per-test via worker.use(...) (exposed as window.__mswUse).
export const handlers = [
  http.post(predictUrl, () => HttpResponse.json(AnalysisMock)),
]
