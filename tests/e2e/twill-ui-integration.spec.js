import { test, expect } from '@playwright/test';

test.describe('Twill AI UI Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5175');
    await page.waitForLoadState('networkidle');
  });

  test('should display authentic Twill logo in sidebar', async ({ page }) => {
    // Check if Twill logo is present
    const logo = page.locator('svg[width="154"][height="55"]').first();
    await expect(logo).toBeVisible();
    
    // Verify logo colors (Twill brand colors)
    const yellowPath = logo.locator('path[fill="#FFDE00"]');
    const darkPath = logo.locator('path[fill="#252546"]');
    await expect(yellowPath).toBeVisible();
    await expect(darkPath).toBeVisible();
  });

  test('should use Twill AI color palette throughout the interface', async ({ page }) => {
    // Check sidebar gradient background
    const sidebar = page.locator('.bg-gradient-to-b.from-gray40\\/0.via-gray40\\/77.to-gray40');
    await expect(sidebar).toBeVisible();

    // Check merchant table header uses gray40 background
    const tableHeader = page.locator('.bg-gray40').first();
    await expect(tableHeader).toBeVisible();

    // Check Action buttons use Twill AI styling
    const actionButtons = page.locator('button').filter({ hasText: 'Refresh' });
    await expect(actionButtons.first()).toBeVisible();
  });

  test('should display authentic Action buttons with Twill AI styling', async ({ page }) => {
    // Navigate to merchants page to see Action buttons
    await page.click('text=Merchants');
    await page.waitForLoadState('networkidle');

    // Check Export button with Twill AI Action styling
    const exportButton = page.locator('button:has-text("Export")');
    await expect(exportButton).toBeVisible();
    
    // Check Filters button
    const filtersButton = page.locator('button:has-text("Filters")');
    await expect(filtersButton).toBeVisible();
    
    // Check Refresh button with primary color
    const refreshButton = page.locator('button:has-text("Refresh")');
    await expect(refreshButton).toBeVisible();
  });

  test('should display merchant table with Twill AI styling', async ({ page }) => {
    await page.click('text=Merchants');
    await page.waitForLoadState('networkidle');

    // Check table container has Twill AI shadow
    const tableContainer = page.locator('.shadow-md.shadow-\\[rgba\\(13\\,10\\,44\\,0\\.08\\)\\]');
    await expect(tableContainer).toBeVisible();

    // Check table header background
    const tableHeader = page.locator('thead.bg-gray40');
    await expect(tableHeader).toBeVisible();

    // Check table headers use black50 text color
    const headerText = page.locator('th.text-black50');
    await expect(headerText.first()).toBeVisible();
  });

  test('should show data source toggle with Twill AI styling', async ({ page }) => {
    // Check toggle switch is present
    const toggleContainer = page.locator('.bg-gray40.rounded-lg.p-1');
    await expect(toggleContainer).toBeVisible();

    // Check Mock and PayEngine buttons
    const mockButton = page.locator('button:has-text("Mock")');
    const payengineButton = page.locator('button:has-text("PayEngine")');
    
    await expect(mockButton).toBeVisible();
    await expect(payengineButton).toBeVisible();
  });

  test('should display dashboard metrics with Twill AI MetricCard styling', async ({ page }) => {
    // Check MetricCard components
    const metricCards = page.locator('.shadow-md.shadow-\\[rgba\\(13\\,10\\,44\\,0\\.08\\)\\]');
    await expect(metricCards.first()).toBeVisible();

    // Check gradient backgrounds on metric cards
    const gradientBg = page.locator('.bg-gradient-to-br.from-azure100\\/10');
    await expect(gradientBg.first()).toBeVisible();

    // Check icon containers with Twill AI gradient
    const iconContainer = page.locator('.bg-gradient-to-br.from-azure100.to-periwinkle50');
    await expect(iconContainer.first()).toBeVisible();
  });

  test('should use authentic Twill AI colors for text elements', async ({ page }) => {
    // Check black50 text color usage
    const black50Text = page.locator('.text-black50');
    await expect(black50Text.first()).toBeVisible();

    // Check gray100 text color usage
    const gray100Text = page.locator('.text-gray100');
    await expect(gray100Text.first()).toBeVisible();

    // Check azure100 color usage
    const azure100Elements = page.locator('.text-azure100, .bg-azure100');
    await expect(azure100Elements.first()).toBeVisible();
  });

  test('should maintain responsive design with Twill AI styling', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    const sidebar = page.locator('.w-64');
    await expect(sidebar).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Verify layout still works
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should show proper empty states without dummy data', async ({ page }) => {
    // Switch to PayEngine mode to test empty states
    await page.click('button:has-text("PayEngine")');
    await page.waitForLoadState('networkidle');

    // Check that charts show empty state instead of dummy data
    const chartContainer = page.locator('[data-testid="processing-volume-chart"]');
    if (await chartContainer.isVisible()) {
      // Verify no dummy/hardcoded data is displayed
      const dummyData = page.locator('text=/4\\.3M|4\\.7M|3\\.85M/');
      await expect(dummyData).not.toBeVisible();
    }

    // Check metrics show $0 instead of dummy values
    const zeroMetrics = page.locator('text="$0"');
    await expect(zeroMetrics.first()).toBeVisible();
  });

  test('should display navigation with conditional access in PayEngine mode', async ({ page }) => {
    // Switch to PayEngine mode
    await page.click('button:has-text("PayEngine")');
    await page.waitForTimeout(1000);

    // Check that Pipeline and Risk Management are disabled
    const pipelineLink = page.locator('text=Pipeline').first();
    const riskLink = page.locator('text=Risk Management').first();
    
    // These should be disabled (have opacity-50 class)
    await expect(pipelineLink.locator('..').locator('..')).toHaveClass(/opacity-50/);
    await expect(riskLink.locator('..').locator('..')).toHaveClass(/opacity-50/);

    // Switch back to Mock mode
    await page.click('button:has-text("Mock")');
    await page.waitForTimeout(1000);

    // Now they should be enabled
    await expect(pipelineLink.locator('..').locator('..')).not.toHaveClass(/opacity-50/);
    await expect(riskLink.locator('..').locator('..')).not.toHaveClass(/opacity-50/);
  });
});

test.describe('Twill AI Visual Consistency', () => {
  test('should maintain consistent color usage across components', async ({ page }) => {
    await page.goto('http://localhost:5175');
    await page.waitForLoadState('networkidle');

    // Take screenshot for visual regression testing
    await expect(page).toHaveScreenshot('twill-ai-dashboard.png', {
      fullPage: true,
      threshold: 0.2
    });

    // Navigate to merchants page
    await page.click('text=Merchants');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('twill-ai-merchants.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('should show consistent branding elements', async ({ page }) => {
    await page.goto('http://localhost:5175');
    
    // Verify Twill logo is consistently placed
    const logo = page.locator('svg[width="154"]');
    await expect(logo).toBeVisible();
    
    // Verify consistent use of Twill AI color palette
    const twillColors = [
      '.text-black50',
      '.text-gray100', 
      '.bg-gray40',
      '.bg-azure100',
      '.text-azure100'
    ];
    
    for (const colorClass of twillColors) {
      const elements = page.locator(colorClass);
      await expect(elements.first()).toBeVisible();
    }
  });
});
