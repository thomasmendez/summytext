import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// Verifies the footer nav moves between Privacy / Home / About and that each
// route renders its own content. Content is asserted by test id only — no
// styling or positioning checks.

// Marks the window so we can prove navigation stayed client-side (a full page
// reload would wipe it).
async function markSpa(page: Page) {
  await page.evaluate(() => {
    ;(window as Window & { __spaMarker?: boolean }).__spaMarker = true
  })
}

async function readSpaMarker(page: Page) {
  return page.evaluate(
    () => (window as Window & { __spaMarker?: boolean }).__spaMarker,
  )
}

test.describe('navigation', () => {
  test('home is the default route', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('home-view')).toBeVisible()
    await expect(page.getByTestId('home-title')).toContainText('Sum My Text')
    // Home shows the summarizer input by default (no analysis yet).
    await expect(page.getByTestId('input-textarea')).toBeVisible()
    await expect(page.getByTestId('submit-button')).toBeVisible()
    await expect(page.getByTestId('analysis-view')).not.toBeVisible()
  })

  test('navigates to About and renders its content', async ({ page }) => {
    await page.goto('/')
    await markSpa(page)

    await page.getByTestId('nav-link-about').click()

    await expect(page.getByTestId('about-view')).toBeVisible()
    await expect(page.getByTestId('about-title')).toContainText('About')
    await expect(page.getByTestId('about-intro')).toContainText(
      'Need to summarize',
    )
    await expect(page.getByTestId('about-description')).toContainText(
      'free online tool',
    )
    await expect(page.getByTestId('about-capabilities-table')).toBeVisible()

    // Navigation stayed client-side.
    expect(await readSpaMarker(page)).toBe(true)
  })

  test('navigates to Privacy and renders its content', async ({ page }) => {
    await page.goto('/')
    await markSpa(page)

    await page.getByTestId('nav-link-privacy').click()

    await expect(page.getByTestId('privacy-view')).toBeVisible()
    await expect(page.getByTestId('privacy-title')).toContainText('Privacy')
    await expect(page.getByTestId('privacy-intro')).toContainText(
      'does not store any personal data',
    )
    await expect(page.getByTestId('privacy-no-storage')).toContainText(
      'No data that is typed is stored.',
    )
    await expect(page.getByTestId('privacy-tracking')).toContainText(
      'Tracking services',
    )

    expect(await readSpaMarker(page)).toBe(true)
  })

  test('navigates back Home from another page', async ({ page }) => {
    await page.goto('/about')
    await expect(page.getByTestId('about-view')).toBeVisible()
    await markSpa(page)

    await page.getByTestId('nav-link-home').click()

    await expect(page.getByTestId('home-view')).toBeVisible()
    await expect(page.getByTestId('input-textarea')).toBeVisible()
    expect(await readSpaMarker(page)).toBe(true)
  })

  test('unknown route renders the 404 error view', async ({ page }) => {
    await page.goto('/does-not-exist')
    await expect(page.getByTestId('error-view')).toBeVisible()
    await expect(page.getByTestId('error-title')).toContainText('404')
    await expect(page.getByTestId('error-title')).toContainText('Not Found')
  })
})
