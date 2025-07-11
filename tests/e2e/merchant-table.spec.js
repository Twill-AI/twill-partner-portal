// @ts-check
import { test, expect } from '@playwright/test';

// Sample merchant data for testing
const sampleMerchant = {
  id: 'merch_test123',
  business_name: 'Test Merchant',
  email: 'test@merchant.com',
  status: 'active',
  risk_level: 'medium',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  metrics: {
    monthly_volume: 15000,
    transaction_count: 125,
    average_transaction: 120,
    approval_rate: 92.5,
    chargeback_rate: 0.8,
    volume_change_30d: 5.2,
  }
};

test.describe('MerchantTable Component', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API response for merchants
    await page.route('**/api/merchants**', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [sampleMerchant],
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        }),
      });
    });

    // Navigate to the merchants page
    await page.goto('/merchants');
    
    // Wait for the table to be visible
    await page.waitForSelector('[data-testid="merchant-table"]', { state: 'visible' });
  });

  test('should display merchant data correctly', async ({ page }) => {
    // Check if merchant data is displayed
    await expect(page.getByText(sampleMerchant.business_name)).toBeVisible();
    await expect(page.getByText(sampleMerchant.email)).toBeVisible();
    
    // Check if metrics are formatted correctly
    await expect(page.getByText('$15,000.00')).toBeVisible();
    await expect(page.getByText('125')).toBeVisible();
    await expect(page.getByText('92.5%')).toBeVisible();
    await expect(page.getByText('0.8%')).toBeVisible();
  });

  test('should filter merchants by status', async ({ page }) => {
    // Click on the 'Active' tab
    const activeTab = page.getByRole('tab', { name: 'Active' });
    await activeTab.click();
    
    // Verify the API was called with the correct status filter
    await page.waitForRequest(request => 
      request.url().includes('status=active')
    );
  });

  test('should search for merchants', async ({ page }) => {
    // Type in the search input
    const searchInput = page.getByPlaceholder('Search merchants...');
    await searchInput.fill('Test');
    await searchInput.press('Enter');
    
    // Verify the API was called with the search term
    await page.waitForRequest(request => 
      request.url().includes('search=Test')
    );
  });

  test('should sort merchants by column', async ({ page }) => {
    // Click on the 'Monthly Volume' column header to sort
    const volumeHeader = page.getByRole('columnheader', { name: 'Monthly Volume' });
    await volumeHeader.click();
    
    // Verify the API was called with the sort parameters
    await page.waitForRequest(request => 
      request.url().includes('sortBy=monthly_volume') && 
      request.url().includes('sortDirection=asc')
    );
    
    // Click again to sort in descending order
    await volumeHeader.click();
    
    await page.waitForRequest(request => 
      request.url().includes('sortBy=monthly_volume') && 
      request.url().includes('sortDirection=desc')
    );
  });

  test('should navigate to merchant detail on row click', async ({ page }) => {
    // Mock the merchant detail API response
    await page.route(`**/api/merchants/${sampleMerchant.id}`, route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleMerchant),
      });
    });
    
    // Click on the merchant row
    const merchantRow = page.getByRole('row', { name: sampleMerchant.business_name });
    await merchantRow.click();
    
    // Verify navigation to merchant detail page
    await expect(page).toHaveURL(new RegExp(`/merchants/${sampleMerchant.id}`));
  });

  test('should handle empty state', async ({ page }) => {
    // Override the default mock to return no merchants
    await page.route('**/api/merchants**', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0,
        }),
      });
    });
    
    // Reload the page to get the empty state
    await page.reload();
    
    // Verify the empty state is displayed
    await expect(page.getByText('No merchants found')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Override the default mock to return an error
    await page.route('**/api/merchants**', route => {
      return route.fulfill({
        status: 500,
        body: 'Internal Server Error',
      });
    });
    
    // Reload the page to trigger the error
    await page.reload();
    
    // Verify the error state is displayed
    await expect(page.getByText('Failed to load merchants')).toBeVisible();
    
    // Test the retry button
    await page.route('**/api/merchants**', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [sampleMerchant],
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        }),
      });
    });
    
    // Click the retry button
    await page.getByRole('button', { name: 'Retry' }).click();
    
    // Verify the data is loaded after retry
    await expect(page.getByText(sampleMerchant.business_name)).toBeVisible();
  });
});
