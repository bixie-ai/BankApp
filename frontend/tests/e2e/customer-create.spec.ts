import { test, expect } from '@playwright/test'

test.describe('Create Customer Journey', () => {
  test('should navigate to create form and submit a new customer', async ({ page }) => {
    await page.goto('/customers')

    await page.getByTestId('add-customer-button').click()
    await expect(page).toHaveURL('/customers/new')

    await expect(page.getByTestId('customer-form')).toBeVisible()

    await page.getByTestId('input-first-name').locator('input').fill('Alice')
    await page.getByTestId('input-last-name').locator('input').fill('Johnson')
    await page.getByTestId('input-email').locator('input').fill('alice@example.com')
    await page.getByTestId('input-phone').locator('input').fill('+1-555-0199')
    await page.getByTestId('input-address').locator('input').fill('789 Pine Rd')

    await page.getByTestId('submit-customer').click()

    await expect(page).toHaveURL('/customers')
  })

  test('should show validation errors for empty required fields', async ({ page }) => {
    await page.goto('/customers/new')

    await page.getByTestId('submit-customer').click()

    await expect(page.getByText('First name is required')).toBeVisible()
    await expect(page.getByText('Last name is required')).toBeVisible()
  })

  test('should cancel and navigate back to customer list', async ({ page }) => {
    await page.goto('/customers/new')

    await page.getByTestId('cancel-customer').click()

    await expect(page).toHaveURL('/customers')
  })
})
