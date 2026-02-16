import { test, expect } from '@playwright/test';

test('Deque homepage loads', async ({ page }) => {
  await page.goto('https://webtestingcourse.dequecloud.com');
  await expect(page.locator('body')).toBeVisible();
});

test('Page has title', async ({ page }) => {
  await page.goto('https://webtestingcourse.dequecloud.com');
  await expect(page).toHaveTitle(/.+/);
});
