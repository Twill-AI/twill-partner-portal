// @ts-check
import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';

// Mock data for the API responses
const mockMerchants = [
  {
    id: 'merch_1',
    business_name: 'Test Business 1',
    email: 'business1@example.com',
    status: 'active',
    risk_level: 'low',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metrics: {
      monthly_volume: 10000,
      transaction_count: 100,
      average_transaction: 100,
      approval_rate: 95,
      chargeback_rate: 0.5,
      volume_change_30d: 5,
    },
  },
  {
    id: 'merch_2',
    business_name: 'Test Business 2',
    email: 'business2@example.com',
    status: 'in_review',
    risk_level: 'medium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metrics: {
      monthly_volume: 20000,
      transaction_count: 200,
      average_transaction: 100,
      approval_rate: 90,
      chargeback_rate: 1.0,
      volume_change_30d: 0,
    },
  },
  {
    id: 'merch_3',
    business_name: 'Another Business',
    email: 'another@example.com',
    status: 'suspended',
    risk_level: 'high',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metrics: {
      monthly_volume: 30000,
      transaction_count: 300,
      average_transaction: 100,
      approval_rate: 85,
      chargeback_rate: 1.5,
      volume_change_30d: -5,
    },
  },
];

test.describe('Merchants Page', () => {
  let browser, context, page;
  
  test.beforeAll(async () => {
    // Launch browser
    browser = await chromium.launch();
    
    // Create a new context with mock API responses
    context = await browser.newContext();
    
    // Enable request interception
    await context.route('**/api/merchants**', route => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get('search') || '';
      const status = url.searchParams.get('status');
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
      
      // Filter merchants based on search and status
      let filteredMerchants = [...mockMerchants];
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredMerchants = filteredMerchants.filter(
          m => m.business_name.toLowerCase().includes(searchLower) || 
               m.email.toLowerCase().includes(searchLower)
        );
      }
      
      if (status && status !== 'all') {
        filteredMerchants = filteredMerchants.filter(m => m.status === status);
      }
      
      // Apply pagination
      const start = (page - 1) * pageSize;
      const paginatedMerchants = filteredMerchants.slice(start, start + pageSize);
      
      // Return the response
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: paginatedMerchants,
          total: filteredMerchants.length,
          page,
          pageSize,
          totalPages: Math.ceil(filteredMerchants.length / pageSize),
        }),
      });
    });
    
    // Create a new page
    page = await context.newPage();
  });
  
  test.afterAll(async () => {
    await browser.close();
  });
  
  test.beforeEach(async () => {
    // Navigate to the merchants page before each test
    await page.goto('http://localhost:3000/merchants');
    
    // Wait for the table to be visible
    await page.waitForSelector('table');
  });
  
  test('should display the merchants table', async () => {
    // Check if the table is visible
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Check if the table headers are present
    await expect(page.getByRole('columnheader', { name: 'Merchant' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Risk' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Monthly Volume' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Transactions' })).toBeVisible();
    
    // Check if the merchants are displayed
    for (const merchant of mockMerchants) {
      await expect(page.getByText(merchant.business_name)).toBeVisible();
    }
  });
  
  test('should filter merchants by search term', async () => {
    // Type in the search input
    const searchInput = page.getByPlaceholder('Search merchants...');
    await searchInput.fill('Test Business');
    
    // Wait for the table to update
    await page.waitForTimeout(500);
    
    // Check if only matching merchants are displayed
    await expect(page.getByText('Test Business 1')).toBeVisible();
    await expect(page.getByText('Test Business 2')).toBeVisible();
    await expect(page.getByText('Another Business')).not.toBeVisible();
    
    // Clear the search
    await searchInput.fill('');
    await searchInput.press('Enter');
    
    // Check if all merchants are displayed again
    for (const merchant of mockMerchants) {
      await expect(page.getByText(merchant.business_name)).toBeVisible();
    }
  });
  
  test('should filter merchants by status', async () => {
    // Click on the 'Active' tab
    const activeTab = page.getByRole('tab', { name: 'Active' });
    await activeTab.click();
    
    // Wait for the table to update
    await page.waitForTimeout(500);
    
    // Check if only active merchants are displayed
    await expect(page.getByText('Test Business 1')).toBeVisible();
    await expect(page.getByText('Test Business 2')).not.toBeVisible();
    await expect(page.getByText('Another Business')).not.toBeVisible();
    
    // Click on the 'In Review' tab
    const inReviewTab = page.getByRole('tab', { name: 'In Review' });
    await inReviewTab.click();
    
    // Wait for the table to update
    await page.waitForTimeout(500);
    
    // Check if only in-review merchants are displayed
    await expect(page.getByText('Test Business 1')).not.toBeVisible();
    await expect(page.getByText('Test Business 2')).toBeVisible();
    await expect(page.getByText('Another Business')).not.toBeVisible();
    
    // Click on the 'All' tab
    const allTab = page.getByRole('tab', { name: 'All' });
    await allTab.click();
    
    // Wait for the table to update
    await page.waitForTimeout(500);
    
    // Check if all merchants are displayed again
    for (const merchant of mockMerchants) {
      await expect(page.getByText(merchant.business_name)).toBeVisible();
    }
  });
  
  test('should sort merchants by column', async () => {
    // Click on the 'Merchant' column header to sort
    const merchantHeader = page.getByRole('columnheader', { name: 'Merchant' });
    await merchantHeader.click();
    
    // Wait for the table to update
    await page.waitForTimeout(500);
    
    // Get all merchant names in the table
    const merchantNames = await page.locator('tbody tr td:first-child').allTextContents();
    
    // Check if the merchants are sorted in ascending order
    const sortedNames = [...merchantNames].sort((a, b) => a.localeCompare(b));
    expect(merchantNames).toEqual(sortedNames);
    
    // Click again to sort in descending order
    await merchantHeader.click();
    
    // Wait for the table to update
    await page.waitForTimeout(500);
    
    // Get all merchant names again
    const merchantNamesDesc = await page.locator('tbody tr td:first-child').allTextContents();
    
    // Check if the merchants are sorted in descending order
    const sortedNamesDesc = [...merchantNames].sort((a, b) => b.localeCompare(a));
    expect(merchantNamesDesc).toEqual(sortedNamesDesc);
  });
  
  test('should navigate through pagination', async () => {
    // Mock more merchants for pagination testing
    const manyMerchants = Array.from({ length: 15 }, (_, i) => ({
      id: `merch_${i + 1}`,
      business_name: `Business ${i + 1}`,
      email: `business${i + 1}@example.com`,
      status: ['active', 'in_review', 'suspended'][i % 3],
      risk_level: ['low', 'medium', 'high'][i % 3],
      metrics: {
        monthly_volume: 10000 * (i + 1),
        transaction_count: 100 * (i + 1),
        average_transaction: 100,
        approval_rate: 95 - (i % 5),
        chargeback_rate: 0.5 + (i % 3) * 0.5,
        volume_change_30d: 5 - (i % 11),
      },
    }));
    
    // Update the mock response
    await context.route('**/api/merchants**', route => {
      const url = new URL(route.request().url());
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
      
      // Apply pagination
      const start = (page - 1) * pageSize;
      const paginatedMerchants = manyMerchants.slice(start, start + pageSize);
      
      // Return the response
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: paginatedMerchants,
          total: manyMerchants.length,
          page,
          pageSize,
          totalPages: Math.ceil(manyMerchants.length / pageSize),
        }),
      });
    });
    
    // Refresh the page to get the new mock data
    await page.reload();
    
    // Check if pagination controls are visible
    const pagination = page.locator('[aria-label="Pagination"]');
    await expect(pagination).toBeVisible();
    
    // Check if page 1 is active
    await expect(page.getByRole('button', { name: '1', current: 'page' })).toBeVisible();
    
    // Click on page 2
    await page.getByRole('button', { name: '2' }).click();
    
    // Wait for the table to update
    await page.waitForTimeout(500);
    
    // Check if page 2 is active
    await expect(page.getByRole('button', { name: '2', current: 'page' })).toBeVisible();
    
    // Check if the correct merchants are displayed (11-15)
    await expect(page.getByText('Business 11')).toBeVisible();
    await expect(page.getByText('Business 15')).toBeVisible();
    await expect(page.getByText('Business 1')).not.toBeVisible();
    
    // Change items per page
    const itemsPerPage = page.getByLabel('Rows per page');
    await itemsPerPage.selectOption('25');
    
    // Wait for the table to update
    await page.waitForTimeout(500);
    
    // Check if all merchants are displayed on one page
    for (let i = 1; i <= 15; i++) {
      await expect(page.getByText(`Business ${i}`)).toBeVisible();
    }
  });
  
  test('should display merchant details on row click', async () => {
    // Click on the first merchant row
    const firstMerchantRow = page.locator('tbody tr').first();
    await firstMerchantRow.click();
    
    // Check if the merchant details are displayed in a modal or new page
    // This assumes that clicking a row navigates to a details page or opens a modal
    // Adjust the selector based on your actual implementation
    const merchantDetail = page.locator('[data-testid="merchant-detail"]');
    await expect(merchantDetail).toBeVisible();
    
    // Check if the merchant name is displayed in the details
    await expect(merchantDetail.getByText('Test Business 1')).toBeVisible();
  });
  
  test('should refresh the merchant data', async () => {
    // Click the refresh button
    const refreshButton = page.getByRole('button', { name: /refresh/i });
    await refreshButton.click();
    
    // Check if the loading state is displayed
    const loadingIndicator = page.locator('[aria-label="Loading"]');
    await expect(loadingIndicator).toBeVisible();
    
    // Wait for the data to reload
    await page.waitForTimeout(1000);
    
    // Check if the table is still visible with data
    await expect(page.locator('table')).toBeVisible();
    await expect(page.getByText('Test Business 1')).toBeVisible();
  });
});
