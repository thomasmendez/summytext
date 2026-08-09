export type AnalysisData = {
  sentiment: string
  grammaticalCorrectness: string
  topics: string[]
  summary: string
}

export type PredictError = {
  status?: number
  message: string
  isNetwork: boolean
}

const baseUrl = import.meta.env.VITE_SUM_MY_TEXT_SERVICE

// 120s covers a Lambda cold start (~60s while the models load) with headroom.
// The backend is behind a Lambda Function URL, not API Gateway, so the request
// is no longer cut off at the gateway's 30s ceiling -- we just wait.
const REQUEST_TIMEOUT_MS = 120000

// Only retry genuine transient network errors, and only a couple of times with
// backoff. A cold start now completes on the first request, so we must NOT
// hammer it: each retry against a still-cold backend can spawn another cold
// container and make the wait worse.
const MAX_RETRIES = 2

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const requestOnce = async (text: string): Promise<AnalysisData> => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(`${baseUrl}/api/v1/predict/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    })
  } catch (err) {
    // A timeout surfaces as an AbortError; treat it like an axios timeout and do
    // not retry it. Everything else here is a genuine network failure.
    const isAbort = err instanceof DOMException && err.name === 'AbortError'
    const predictError: PredictError = {
      message: isAbort
        ? 'The request timed out. Please try again later.'
        : "Sorry, we couldn't connect to the server. Please try again later.",
      isNetwork: !isAbort,
    }
    throw predictError
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    let message = response.statusText
    try {
      const body = (await response.json()) as { message?: string }
      if (body && body.message) {
        message = body.message
      }
    } catch {
      // response had no JSON body -- fall back to the status text
    }
    const predictError: PredictError = {
      status: response.status,
      message: `${response.status} Error: ${message}`,
      isNetwork: false,
    }
    throw predictError
  }

  return (await response.json()) as AnalysisData
}

export const performAnalysis = async (text: string): Promise<AnalysisData> => {
  let attempt = 0
  for (;;) {
    try {
      return await requestOnce(text)
    } catch (err) {
      const predictError = err as PredictError
      if (predictError.isNetwork && attempt < MAX_RETRIES) {
        attempt += 1
        // exponential backoff, matching axios-retry's exponentialDelay
        await delay(2 ** attempt * 100)
        continue
      }
      throw predictError
    }
  }
}
