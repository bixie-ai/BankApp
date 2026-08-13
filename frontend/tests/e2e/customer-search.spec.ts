import { test, expect } from '@playwright/test'

test.describe('Search Customers Journey', () => {
  test('should display customer list on page load', async ({ page }) => {
    await page.goto('/customers')

    await expect(page.getByTestId('customer-list')).toBeVisible()
    await expect(page.getByTestId('customer-search-input')).toBeVisible()
  })

  test('should filter customers by search input', async ({ page }) => {
    await page.goto('/customers')

    await expect(page.getByTestId('customer-list')).toBeVisible()

    const searchInput = page.getByTestId('customer-search-input').locator('input')
    await searchInput.fill('John')

    await expect(page.getByText('John Doe')).toBeVisible()
  })

  test('should show empty state when no results match', async ({ page }) => {
    await page.goto('/customers')

    const searchInput = page.getByTestId('customer-search-input').locator('input')
    await searchInput.fill('NonExistentCustomerXYZ')

    await expect(page.getByText('No customers found.')).toBeVisible()
  })

  test('should navigate to customer detail on row click', async ({ page }) => {
    await page.goto('/customers')

    await page.getByTestId('customer-list').waitFor()

    const firstRow = page.locator('[data-testid^="customer-row-"]').first()
    await firstRow.click()

    await expect(page).toHaveURL(/\/customers\/\d+/)
  })
})
