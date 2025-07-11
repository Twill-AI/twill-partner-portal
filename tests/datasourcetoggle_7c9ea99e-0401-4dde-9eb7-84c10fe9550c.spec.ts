
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('DataSourceToggle_2025-07-10', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:5175');

    // Take screenshot
    await page.screenshot({ path: 'dashboard_with_new_toggle.png' });

    // Click element
    await page.click('button:has-text("PayEngine Sandbox")');

    // Click element
    await page.click('text=Mock Data');

    // Click element
    await page.click('text=PayEngine');

    // Take screenshot
    await page.screenshot({ path: 'toggle_to_payengine.png' });

    // Click element
    await page.click('text=Mock Data');

    // Take screenshot
    await page.screenshot({ path: 'toggle_back_to_mock.png' });
});