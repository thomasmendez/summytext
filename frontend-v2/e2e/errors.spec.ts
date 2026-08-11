import { test, expect } from '@playwright/test'
import { submitText, useScenario } from './helpers'

// Error edge cases: the predict endpoint fails, is unavailable, drops the
// connection, or is slow. Each should surface the right user-facing message and
// must NOT render an analysis result.

test.describe('analysis error handling', () => {
  test('shows an error when the API call fails (500)', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('home-view')).toBeVisible()
    await useScenario(page, 'serverError')

    await submitText(page)

    const snackbar = page.getByTestId('snackbar-error')
    await expect(snackbar).toBeVisible()
    await expect(snackbar).toContainText('500')
    await expect(snackbar).toContainText('Internal Server Error')
    await expect(page.getByTestId('analysis-view')).not.toBeVisible()
  })

  test('shows an error when the service is unavailable (503)', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByTestId('home-view')).toBeVisible()
    await useScenario(page, 'serviceUnavailable')

    await submitText(page)

    const snackbar = page.getByTestId('snackbar-error')
    await expect(snackbar).toBeVisible()
    await expect(snackbar).toContainText('503')
    await expect(snackbar).toContainText('Service Unavailable')
    await expect(page.getByTestId('analysis-view')).not.toBeVisible()
  })

  test('shows a connection error when the request cannot reach the server', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByTestId('home-view')).toBeVisible()
    await useScenario(page, 'networkError')

    await submitText(page)

    // The service retries network failures a couple of times, then gives up.
    const snackbar = page.getByTestId('snackbar-error')
    await expect(snackbar).toBeVisible()
    await expect(snackbar).toContainText("couldn't connect to the server")
    await expect(page.getByTestId('analysis-view')).not.toBeVisible()
  })

  test('shows the "taking longer" notice while a slow request is pending', async ({
    page,
  }) => {
    // The info banner fires on a 7s timer, so give this test extra headroom.
    test.setTimeout(30000)

    await page.goto('/')
    await expect(page.getByTestId('home-view')).toBeVisible()
    await useScenario(page, 'slow')

    await submitText(page)

    // While pending the submit button shows its loading (disabled) state...
    await expect(page.getByTestId('submit-button')).toBeDisabled()
    // ...and after ~7s the "taking longer than expected" info appears.
    await expect(page.getByTestId('snackbar-info')).toBeVisible({
      timeout: 15000,
    })
    await expect(page.getByTestId('snackbar-info')).toContainText(
      'taking longer than expected',
    )
    // Still no result — the request never resolved.
    await expect(page.getByTestId('analysis-view')).not.toBeVisible()
  })

  test('the error notice can be dismissed', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('home-view')).toBeVisible()
    await useScenario(page, 'serverError')

    await submitText(page)

    await expect(page.getByTestId('snackbar-error')).toBeVisible()
    await page.getByTestId('snackbar-close').click()
    await expect(page.getByTestId('snackbar-error')).not.toBeVisible()
  })
})
