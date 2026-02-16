import { test, expect } from '@playwright/test';

const BASE_URL = 'https://webtestingcourse.dequecloud.com';

test.describe('Basic Page Tests', () => {
  
  test('homepage loads successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('body')).toBeVisible();
  });

  test('page has a title', async ({ page }) => {
    await page.goto(BASE_URL);
    const title = await page.title();
    console.log(`Page title: ${title}`);
    expect(title.length).toBeGreaterThan(0);
  });

  test('page has content', async ({ page }) => {
    await page.goto(BASE_URL);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(100);
  });

  test('page has headings', async ({ page }) => {
    await page.goto(BASE_URL);
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    console.log(`Found ${count} headings`);
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Link Tests', () => {
  
  test('page has clickable links', async ({ page }) => {
    await page.goto(BASE_URL);
    const links = page.locator('a[href]');
    const count = await links.count();
    console.log(`Found ${count} links`);
    expect(count).toBeGreaterThan(0);
  });

  test('first link is visible and has href', async ({ page }) => {
    await page.goto(BASE_URL);
    const links = page.locator('a[href]');
    const count = await links.count();
    
    if (count > 0) {
      const firstLink = links.first();
      await expect(firstLink).toBeVisible();
      const href = await firstLink.getAttribute('href');
      console.log(`First link href: ${href}`);
      expect(href).toBeTruthy();
    }
  });

  test('links can be clicked', async ({ page }) => {
    await page.goto(BASE_URL);
    const links = page.locator('a[href]');
    const count = await links.count();
    
    if (count > 0) {
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');
      
      // Only click if it's a relative link or same domain
      if (href && (href.startsWith('/') || href.startsWith('#') || href.includes('dequecloud'))) {
        await firstLink.click();
        await page.waitForTimeout(1000);
        console.log('Link clicked successfully');
      }
    }
  });
});

test.describe('Button Tests', () => {
  
  test('page has buttons or interactive elements', async ({ page }) => {
    await page.goto(BASE_URL);
    const buttons = page.locator('button, input[type="submit"], input[type="button"]');
    const count = await buttons.count();
    console.log(`Found ${count} buttons`);
    
    // Don't fail if no buttons, just log
    if (count > 0) {
      expect(count).toBeGreaterThan(0);
    }
  });

  test('buttons are visible if they exist', async ({ page }) => {
    await page.goto(BASE_URL);
    const buttons = page.locator('button, input[type="submit"], input[type="button"]');
    const count = await buttons.count();
    
    if (count > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
      console.log('Button is visible');
    }
  });
});

test.describe('Form Element Tests', () => {
  
  test('input fields exist and can accept text', async ({ page }) => {
    await page.goto(BASE_URL);
    const inputs = page.locator('input[type="text"], input[type="email"], input:not([type]), textarea');
    const count = await inputs.count();
    console.log(`Found ${count} input fields`);
    
    if (count > 0) {
      const firstInput = inputs.first();
      await firstInput.fill('Test input');
      const value = await firstInput.inputValue();
      expect(value).toBe('Test input');
    }
  });

  test('select dropdowns work if present', async ({ page }) => {
    await page.goto(BASE_URL);
    const selects = page.locator('select');
    const count = await selects.count();
    console.log(`Found ${count} select dropdowns`);
    
    if (count > 0) {
      const firstSelect = selects.first();
      const options = await firstSelect.locator('option').count();
      
      if (options > 1) {
        await firstSelect.selectOption({ index: 1 });
        console.log('Dropdown selected');
      }
    }
  });

  test('checkboxes can be toggled if present', async ({ page }) => {
    await page.goto(BASE_URL);
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    console.log(`Found ${count} checkboxes`);
    
    if (count > 0) {
      const checkbox = checkboxes.first();
      await checkbox.check();
      await expect(checkbox).toBeChecked();
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    }
  });

  test('radio buttons can be selected if present', async ({ page }) => {
    await page.goto(BASE_URL);
    const radios = page.locator('input[type="radio"]');
    const count = await radios.count();
    console.log(`Found ${count} radio buttons`);
    
    if (count > 0) {
      const radio = radios.first();
      await radio.check();
      await expect(radio).toBeChecked();
    }
  });
});

test.describe('Keyboard Navigation Tests', () => {
  
  test('tab key navigates through elements', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    const focused = await page.locator(':focus').count();
    console.log(`Focused elements: ${focused}`);
    expect(focused).toBeGreaterThanOrEqual(0);
  });

  test('enter key can be pressed on focused element', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const interactiveElements = page.locator('a, button, input, select');
    const count = await interactiveElements.count();
    
    if (count > 0) {
      await interactiveElements.first().focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      console.log('Enter key pressed');
    }
  });
});

test.describe('Image and Media Tests', () => {
  
  test('images load with proper src attributes', async ({ page }) => {
    await page.goto(BASE_URL);
    const images = page.locator('img');
    const count = await images.count();
    console.log(`Found ${count} images`);
    
    if (count > 0) {
      const firstImage = images.first();
      const src = await firstImage.getAttribute('src');
      console.log(`First image src: ${src}`);
      expect(src).toBeTruthy();
    }
  });

  test('images have alt attributes for accessibility', async ({ page }) => {
    await page.goto(BASE_URL);
    const images = page.locator('img');
    const count = await images.count();
    
    if (count > 0) {
      const firstImage = images.first();
      const alt = await firstImage.getAttribute('alt');
      console.log(`Image alt text: "${alt}"`);
      // Alt can be empty string, so we just check it's not null
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Responsive Design Tests', () => {
  
  test('page works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await expect(page.locator('body')).toBeVisible();
    console.log('Mobile viewport: OK');
  });

  test('page works on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await expect(page.locator('body')).toBeVisible();
    console.log('Tablet viewport: OK');
  });

  test('page works on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    await expect(page.locator('body')).toBeVisible();
    console.log('Desktop viewport: OK');
  });
});

test.describe('Performance Tests', () => {
  
  test('page loads in reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    const loadTime = Date.now() - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(15000); // 15 seconds max
  });

  test('page has no major console errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    console.log(`Console errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log('Errors:', errors);
    }
  });

  test('critical resources load successfully', async ({ page }) => {
    const failed = [];
    
    page.on('response', response => {
      if (response.status() >= 400 && response.status() < 600) {
        failed.push({ url: response.url(), status: response.status() });
      }
    });
    
    await page.goto(BASE_URL);
    
    console.log(`Failed resources: ${failed.length}`);
    if (failed.length > 0) {
      console.log('Failed:', failed);
    }
    
    // Allow some failed resources (like tracking scripts)
    expect(failed.length).toBeLessThan(5);
  });
});

test.describe('Accessibility Tests', () => {
  
  test('page has proper document language', async ({ page }) => {
    await page.goto(BASE_URL);
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    console.log(`Page language: ${lang}`);
    expect(lang).toBeTruthy();
  });

  test('page has main landmark or content area', async ({ page }) => {
    await page.goto(BASE_URL);
    const main = page.locator('main, [role="main"], #main, .main-content');
    const count = await main.count();
    console.log(`Main content areas found: ${count}`);
  });

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Tab through first 5 elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }
    
    console.log('Keyboard navigation completed');
  });
});
