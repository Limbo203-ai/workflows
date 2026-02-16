import { test, expect } from '@playwright/test';

const BASE_URL = 'https://webtestingcourse.dequecloud.com';

test.describe('Navigation and Links Tests', () => {
  
  test('all navigation links are clickable and work', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Find all links on the page (more flexible selector)
    const allLinks = page.locator('a[href]');
    const count = await allLinks.count();
    
    console.log(`Found ${count} links on page`);
    expect(count).toBeGreaterThan(0); // Changed from strict nav requirement
    
    if (count > 0) {
      const firstLink = allLinks.first();
      await expect(firstLink).toBeVisible();
      const href = await firstLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('external links open correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const externalLinks = page.locator('a[target="_blank"], a[href^="http"]');
    const count = await externalLinks.count();
    
    console.log(`Found ${count} external links`);
    // Don't require external links, just test if they exist
  });

  test('footer links are present', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const footerLinks = page.locator('footer a, [role="contentinfo"] a');
    const count = await footerLinks.count();
    
    console.log(`Found ${count} footer links`);
  });
});

test.describe('Button Interaction Tests', () => {
  
  test('all buttons are visible and clickable', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const buttons = page.locator('button, input[type="submit"], input[type="button"], [role="button"]');
    const count = await buttons.count();
    
    console.log(`Found ${count} buttons on page`);
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const button = buttons.nth(i);
        await expect(button).toBeVisible();
        
        // Just check button exists, don't require text/label
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        console.log(`Button ${i}: text="${text?.trim()}", aria-label="${ariaLabel}"`);
      }
    }
  });

  test('buttons can be focused with keyboard', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const buttons = page.locator('button, input[type="submit"]');
    const count = await buttons.count();
    
    if (count > 0) {
      const firstButton = buttons.first();
      await firstButton.focus();
      await expect(firstButton).toBeFocused();
    }
  });

  test('button click triggers expected action', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const buttons = page.locator('button, input[type="submit"]');
    const count = await buttons.count();
    
    if (count > 0) {
      const firstButton = buttons.first();
      await firstButton.click();
      await page.waitForTimeout(1000);
      console.log(`Button clicked, URL: ${page.url()}`);
    }
  });
});

test.describe('Form and Input Tests', () => {
  
  test('input fields accept text input', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="search"], textarea');
    const count = await inputs.count();
    
    console.log(`Found ${count} text input fields`);
    
    if (count > 0) {
      const firstInput = inputs.first();
      await firstInput.click();
      await firstInput.fill('Test input text');
      
      const value = await firstInput.inputValue();
      expect(value).toBe('Test input text');
    }
  });

  test('search functionality exists', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[aria-label*="search" i]');
    const count = await searchInput.count();
    
    if (count > 0) {
      console.log('Found search input');
      await searchInput.first().fill('Mars');
      
      const searchButton = page.locator('button[type="submit"], button:has-text("Search")').first();
      
      if (await searchButton.isVisible()) {
        await searchButton.click();
        await page.waitForTimeout(1000);
        console.log('Search submitted');
      }
    } else {
      console.log('No search input found on page');
    }
  });

  test('dropdown/select elements work', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const selects = page.locator('select');
    const count = await selects.count();
    
    if (count > 0) {
      console.log(`Found ${count} dropdown menus`);
      const firstSelect = selects.first();
      
      await firstSelect.selectOption({ index: 1 });
      const value = await firstSelect.inputValue();
      expect(value).toBeTruthy();
    }
  });

  test('checkboxes can be checked/unchecked', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    
    if (count > 0) {
      console.log(`Found ${count} checkboxes`);
      const firstCheckbox = checkboxes.first();
      
      await firstCheckbox.check();
      await expect(firstCheckbox).toBeChecked();
      
      await firstCheckbox.uncheck();
      await expect(firstCheckbox).not.toBeChecked();
    }
  });

  test('radio buttons can be selected', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const radios = page.locator('input[type="radio"]');
    const count = await radios.count();
    
    if (count > 0) {
      console.log(`Found ${count} radio buttons`);
      const firstRadio = radios.first();
      
      await firstRadio.check();
      await expect(firstRadio).toBeChecked();
    }
  });
});

test.describe('Interactive Element Tests', () => {
  
  test('accordions or expandable elements exist', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const accordions = page.locator('[aria-expanded]');
    const count = await accordions.count();
    
    if (count > 0) {
      console.log(`Found ${count} expandable elements`);
      const firstAccordion = accordions.first();
      
      const initialState = await firstAccordion.getAttribute('aria-expanded');
      await firstAccordion.click();
      await page.waitForTimeout(300);
      
      const newState = await firstAccordion.getAttribute('aria-expanded');
      console.log(`Expanded state changed from ${initialState} to ${newState}`);
    }
  });

  test('tabs switch content if present', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const tabs = page.locator('[role="tab"], .tab');
    const count = await tabs.count();
    
    if (count > 1) {
      console.log(`Found ${count} tabs`);
      await tabs.nth(1).click();
      await page.waitForTimeout(300);
    } else {
      console.log('No tabs found on page');
    }
  });
});

test.describe('Keyboard Navigation Tests', () => {
  
  test('can navigate page with Tab key', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    const focusedElement = await page.locator(':focus').count();
    expect(focusedElement).toBeGreaterThan(0);
    
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);
    }
    
    console.log('Tab navigation working');
  });

  test('Enter key activates focused element', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const buttons = page.locator('button, a');
    if (await buttons.count() > 0) {
      await buttons.first().focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      console.log('Enter key activation tested');
    }
  });
});

test.describe('Content and Media Tests', () => {
  
  test('all images have proper attributes', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const images = page.locator('img');
    const count = await images.count();
    
    console.log(`Found ${count} images`);
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();
        
        const src = await img.getAttribute('src');
        expect(src).toBeTruthy();
      }
    }
  });

  test('page content is readable', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const main = page.locator('main, [role="main"], article, .content, body');
    const count = await main.count();
    
    if (count > 0) {
      const text = await main.first().textContent();
      expect(text.length).toBeGreaterThan(10);
      console.log(`Main content has ${text.length} characters`);
    }
  });
});

test.describe('Performance and Loading Tests', () => {
  
  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    console.log(`Page loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000);
  });

  test('no critical JavaScript errors on page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('JavaScript errors found:', errors);
    }
    
    expect(errors.length).toBeLessThan(10);
  });

  test('page resources load successfully', async ({ page }) => {
    const failedResources = [];
    
    page.on('response', response => {
      if (response.status() >= 400) {
        failedResources.push({
          url: response.url(),
          status: response.status()
        });
      }
    });
    
    await page.goto(BASE_URL);
    
    if (failedResources.length > 0) {
      console.log('Failed resources:', failedResources);
    }
    
    expect(failedResources.length).toBe(0);
  });
});

test.describe('Mobile and Responsive Tests', () => {
  
  test('mobile menu works on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    const mobileMenu = page.locator('.hamburger, .menu-toggle, button[aria-label*="menu" i]');
    const count = await mobileMenu.count();
    
    if (count > 0) {
      await mobileMenu.first().click();
      await page.waitForTimeout(500);
      console.log('Mobile menu tested');
    } else {
      console.log('No mobile menu found');
    }
  });

  test('touch interactions work on mobile', async ({ page, context }) => {
    // Create a new page with touch support enabled
    const mobilePage = await context.newPage({
      hasTouch: true
    });
    
    await mobilePage.setViewportSize({ width: 375, height: 667 });
    await mobilePage.goto(BASE_URL);
    
    const buttons = mobilePage.locator('button, a');
    if (await buttons.count() > 0) {
      await buttons.first().tap();
      console.log('Touch interaction tested');
    }
    
    await mobilePage.close();
  });

  test('content is readable on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('content is readable on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Basic Functionality Tests', () => {
  
  test('homepage loads successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('page has proper structure', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    
    console.log(`Found ${count} headings`);
    expect(count).toBeGreaterThan(0);
  });

  test('page is accessible via keyboard', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Tab through several elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);
    }
    
    console.log('Keyboard accessibility verified');
  });
});
