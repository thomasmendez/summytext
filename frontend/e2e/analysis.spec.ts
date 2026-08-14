import { test, expect } from '@playwright/test'
import { submitText } from './helpers'
import AnalysisMock from '../src/mocks/__fixtures__/analysis'

// Happy path: submit text, the mocked predict endpoint returns the fixture, and
// the analysis panel shows the summary, topics and sentiment from it.
// Assertions are driven off the fixture so mock and test never drift.

test.describe('analysis results', () => {
  test('renders the summarizer result from a mocked predict call', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByTestId('home-view')).toBeVisible()

    await submitText(page, 'Please summarize this passage of text.')

    // Result panel appears once the (mocked) call resolves.
    await expect(page.getByTestId('analysis-view')).toBeVisible()

    await expect(page.getByTestId('analysis-summary')).toContainText(
      AnalysisMock.summary,
    )
    await expect(page.getByTestId('analysis-topics')).toContainText(
      AnalysisMock.topics.join(', '),
    )
    await expect(page.getByTestId('analysis-sentiment')).toContainText(
      AnalysisMock.sentiment,
    )

    // The original input is still shown alongside the analysis.
    await expect(page.getByTestId('input-textarea')).toBeVisible()
    // No error surfaced on the happy path.
    await expect(page.getByTestId('snackbar-error')).not.toBeVisible()
  })

  test('submit is disabled until text is entered', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('submit-button')).toBeDisabled()

    await page.getByTestId('input-textarea').fill('Now there is text.')
    await expect(page.getByTestId('submit-button')).toBeEnabled()
  })
})
