import { http, HttpResponse, delay } from 'msw'
import { predictUrl } from './handlers'
import AnalysisMock from './__fixtures__/analysis'

// Runtime handler overrides that imitate how the real predict endpoint misbehaves.
// Applied per Playwright test through window.__mswUse('<name>') so the default
// handlers stay the happy path.
export const scenarioHandlers = {
  // Service is down / cannot handle the request (503).
  serviceUnavailable: http.post(predictUrl, () =>
    HttpResponse.json({ message: 'Service Unavailable' }, { status: 503 }),
  ),

  // The API call itself errors out (500 with a body message).
  serverError: http.post(predictUrl, () =>
    HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 }),
  ),

  // Connection failure — the service layer retries these, then gives up.
  networkError: http.post(predictUrl, () => HttpResponse.error()),

  // Never resolves, so the request stays pending and the UI's "taking longer
  // than expected" info banner is exercised.
  slow: http.post(predictUrl, async () => {
    await delay('infinite')
    return HttpResponse.json(AnalysisMock)
  }),
} as const

export type ScenarioName = keyof typeof scenarioHandlers
