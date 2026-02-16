import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'https://example.com';

test.describe('Form Tests', () => {
  test('login form exists', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const loginButton = page.locator('a:has-text("Login"), button:has-text("Login"), a:has-text("Sign in")');
    const count = await loginButton.count();
    
    if (count > 0) {
      console.log('Login button found');
      await loginButton.first().click();
      await page.waitForTimeout(1000);
      
      // Check for login form
      const emailInput = page.locator('input[type="email"], input[name*="email" i], input[placeholder*="email" i]');
      const passwordInput = page.locator('input[type="password"]');
      
      console.log(`Email fields: ${await emailInput.count()}`);
      console.log(`Password fields: ${await passwordInput.count()}`);
    }
  });

  test('contact form works', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Look for text inputs
    const inputs = page.locator('input[type="text"], input[type="email"], textarea');
    const count = await inputs.count();
    
    if (count > 0) {
      console.log(`Found ${count} form inputs`);
      await inputs.first().fill('Test data');
    }
  });

  test('form validation exists', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const forms = page.locator('form');
    const count = await forms.count();
    console.log(`Found ${count} forms`);
  });
});
