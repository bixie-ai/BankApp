import { test, expect } from '@playwright/test'

test.describe('Fund Transfer / Account Management Journey', () => {
  test('should navigate to accounts page and display create form', async ({ page }) => {
    await page.goto('/accounts')

    await expect(page.getByTestId('create-account-form')).toBeVisible()
    await expect(page.getByTestId('input-customer-number')).toBeVisible()
    await expect(page.getByTestId('select-account-type')).toBeVisible()
    await expect(page.getByTestId('select-currency')).toBeVisible()
  })

  test('should create a new account successfully', async ({ page }) => {
    await page.goto('/accounts')

    await page.getByTestId('input-customer-number').locator('input').fill('1001')

    await page.getByTestId('select-account-type').locator('select').selectOption('SAVINGS')
    await page.getByTestId('select-currency').locator('select').selectOption('USD')

    await page.getByTestId('submit-create-account').click()

    await expect(page.getByText('Account created successfully')).toBeVisible()
  })

  test('should show validation error for missing customer number', async ({ page }) => {
    await page.goto('/accounts')

    await page.getByTestId('submit-create-account').click()

    await expect(page.getByText('Customer number is required')).toBeVisible()
  })

  test('should display account details when navigating with account ID', async ({ page }) => {
    await page.goto('/accounts/acc-001')

    await expect(page.getByText('Account Details')).toBeVisible()
    await expect(page.getByText('Transaction History')).toBeVisible()
  })
})
