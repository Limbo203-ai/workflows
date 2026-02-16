import { test, expect } from '@playwright/test';

test.describe('Website Tests', () => {
  
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('has content', async ({ page }) => {
    await page.goto('/');
    const text = await page.locator('body').textContent();
    expect(text.length).toBeGreaterThan(100);
  });

  test('has links', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a[href]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
