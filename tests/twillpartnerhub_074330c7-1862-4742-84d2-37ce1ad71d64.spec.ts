
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('TwillPartnerHub_2025-07-11', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:5173');

    // Click element
    await page.click('button:has-text('PayEngine Sandbox')');

    // Click element
    await page.click('a:has-text('Merchants')');

    // Click element
    await page.click('button:has-text('Mock Data')');

    // Click element
    await page.click('button:has-text('Active')');

    // Click element
    await page.click('button:has-text('In Review')');
});