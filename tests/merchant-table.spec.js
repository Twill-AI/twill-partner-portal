import { test, expect } from '@playwright/test';

test.describe('MerchantTable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('renders with correct title and controls', async ({ page }) => {
    // Check title
    await expect(page.getByRole('heading', { name: 'Merchants' })).toBeVisible();
    
    // Check refresh button
    await expect(page.getByRole('button', { name: /refresh/i })).toBeVisible();
  });

  test('displays all tabs with correct counts', async ({ page }) => {
    const tabs = ['All', 'Active', 'Editing', 'In Review', 'To Do'];
    
    for (const tabName of tabs) {
      const tab = page.getByRole('button', { name: new RegExp(tabName, 'i') });
      await expect(tab).toBeVisible();
      
      // Check if tab has a count (except possibly 'All' which might be 0)
      if (tabName !== 'All') {
        const count = await tab.textContent();
        expect(count).toMatch(/\d+/); // Should contain at least one digit
      }
    }
  });

  test('filters merchants by search term', async ({ page }) => {
    const searchTerm = 'test';
    await page.getByPlaceholder('Search name, email, ID…').fill(searchTerm);
    
    // Wait for any filtering to complete
    await page.waitForTimeout(500);
    
    // Verify at least one row matches the search term
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    
    if (count > 0) {
      // Check that at least one cell in each visible row contains the search term
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        const text = await row.textContent();
        expect(text.toLowerCase()).toContain(searchTerm.toLowerCase());
      }
    } else {
      console.log('No rows match the search term, which might be expected');
    }
  });

  test('filters merchants by status', async ({ page }) => {
    // Change status filter
    await page.locator('select').selectOption('active');
    
    // Wait for any filtering to complete
    await page.waitForTimeout(500);
    
    // Verify all visible rows have the active status
    const statusCells = page.locator('tbody tr td:nth-child(5)');
    const count = await statusCells.count();
    
    for (let i = 0; i < count; i++) {
      const status = await statusCells.nth(i).textContent();
      expect(status.trim().toLowerCase()).toBe('active');
    }
  });

  test('sorts by updated date', async ({ page }) => {
    // Click the Updated column header to sort
    await page.getByRole('columnheader', { name: /updated/i }).click();
    
    // Wait for sorting to complete
    await page.waitForTimeout(500);
    
    // Get all date values from the Updated column (skipping header)
    const dateCells = page.locator('tbody tr td:first-child');
    const dates = [];
    const count = await dateCells.count();
    
    for (let i = 0; i < count; i++) {
      const dateText = await dateCells.nth(i).textContent();
      dates.push(new Date(dateText));
    }
    
    // Verify dates are in descending order (most recent first)
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i] <= dates[i - 1]).toBeTruthy();
    }
  });

  test('has sticky header when scrolling', async ({ page }) => {
    // Scroll the table body
    await page.locator('.overflow-x-auto').evaluate(el => {
      el.scrollTop = 100;
    });
    
    // Verify header is still visible
    const header = page.locator('thead');
    await expect(header).toBeInViewport();
  });

  test('displays merchant details correctly', async ({ page }) => {
    // Get first row data
    const firstRow = page.locator('tbody tr').first();
    
    // Check that essential columns have content
    const columns = await firstRow.locator('td').all();
    expect(columns.length).toBeGreaterThan(3); // At least 4 columns expected
    
    // Check that status has a valid color class
    const statusCell = columns[4]; // 5th column is status
    const statusClass = await statusCell.getAttribute('class');
    expect(statusClass).toMatch(/bg-\w+\/10/); // Should have a background color class
  });
});
