import type { Page } from '@playwright/test'

// The predict scenarios main.tsx exposes on window when mocks are on. Kept in
// sync with src/mocks/scenarios.ts (declared here so this file has no runtime
// dependency on the app bundle / import.meta.env).
export type ScenarioName =
  | 'serviceUnavailable'
  | 'serverError'
  | 'networkError'
  | 'slow'

type MswWindow = Window & {
  __mswUse?: (name: ScenarioName) => void
  __mswReset?: () => void
}

// Switch the active predict handler for the current page. Call after the app has
// loaded (worker.start has run) and before the request is triggered.
export async function useScenario(page: Page, name: ScenarioName) {
  await page.evaluate((n) => {
    ;(window as MswWindow).__mswUse?.(n)
  }, name)
}

// Type some text and press Submit — the common lead-in to any analysis flow.
export async function submitText(page: Page, text = 'Some text to summarize.') {
  await page.getByTestId('input-textarea').fill(text)
  await page.getByTestId('submit-button').click()
}
