import { test, expect } from '@playwright/test';

test.describe('Twill AI UI Integration - Basic Tests', () => {
  test('should display Twill logo and basic UI elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if Twill logo is present
    const logo = page.locator('svg').first();
    await expect(logo).toBeVisible();

    // Check if navigation items are present
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Merchants')).toBeVisible();
    await expect(page.locator('text=Commission Reports')).toBeVisible();

    // Check if data source toggle is present
    await expect(page.locator('text=Mock')).toBeVisible();
    await expect(page.locator('text=PayEngine')).toBeVisible();
  });

  test('should display dashboard with Twill AI styling', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check dashboard title
    await expect(page.locator('h1:has-text("Partner Dashboard")')).toBeVisible();

    // Check metric cards are present
    await expect(page.locator('text=Total Processing Volume')).toBeVisible();
    await expect(page.locator('text=Total Commission')).toBeVisible();
    await expect(page.locator('text=Active Merchants')).toBeVisible();
    await expect(page.locator('text=Risk Alerts')).toBeVisible();
  });

  test('should navigate to merchants page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click on Merchants navigation
    await page.click('text=Merchants');
    await page.waitForLoadState('networkidle');

    // Check if we're on the merchants page
    await expect(page.locator('h1:has-text("Merchants")')).toBeVisible();
    
    // Check if table elements are present
    await expect(page.locator('text=Merchant Name')).toBeVisible();
    await expect(page.locator('text=Business Type')).toBeVisible();
  });

  test('should toggle between data sources', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click PayEngine toggle
    await page.click('button:has-text("PayEngine")');
    await page.waitForTimeout(1000);

    // Click Mock toggle
    await page.click('button:has-text("Mock")');
    await page.waitForTimeout(1000);

    // Verify we can still see the dashboard
    await expect(page.locator('h1:has-text("Partner Dashboard")')).toBeVisible();
  });
});
