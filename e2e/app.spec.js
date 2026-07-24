import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173')
})

test('page loads with a search input and button', async ({ page }) => {
  await expect(page.getByPlaceholder(/octocat/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /search/i })).toBeVisible()
})

test('shows error when searching with empty input', async ({ page }) => {
  await page.getByRole('button', { name: /search/i }).click()
  await expect(page.getByText(/enter a username first/i)).toBeVisible()
})

test('shows github profile after searching for octocat', async ({ page }) => {
  await page.getByPlaceholder(/octocat/i).fill('octocat')
  await page.getByRole('button', { name: /search/i }).click()
  await expect(page.getByText('@octocat')).toBeVisible({ timeout: 10000 })
})