import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'https://example.com';

test.describe('Basic Website Tests', () => {
  test('page loads', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('body')).toBeVisible();
  });

  test('has links', async ({ page }) => {
    await page.goto(BASE_URL);
    const links = page.locator('a[href]');
    const count = await links.count();
    console.log(`Found ${count} links`);
    expect(count).toBeGreaterThan(0);
  });

  test('page loads fast', async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE_URL);
    const loadTime = Date.now() - start;
    console.log(`Load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000);
  });
});
