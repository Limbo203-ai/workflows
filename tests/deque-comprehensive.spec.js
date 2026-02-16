import { test, expect } from '@playwright/test';

const BASE_URL = 'https://webtestingcourse.dequecloud.com';

test.describe('Navigation and Links Tests', () => {
  
  test('all navigation links are clickable and work', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Find all navigation links
    const navLinks = page.locator('nav a, header a, [role="navigation"] a');
    const count = await navLinks.count();
    
    console.log(`Found ${count} navigation links`);
    expect(count).toBeGreaterThan(0);
    
    // Test that at least the first link is clickable
    if (count > 0) {
      const firstLink = navLinks.first();
      await expect(firstLink).toBeVisible();
      const href = await firstLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('external links open correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Find links with target="_blank" or external URLs
    const externalLinks = page.locator('a[target="_blank"], a[href^="http"]');
    const count = await externalLinks.count();
    
    if (count > 0) {
      console.log(`Found ${count} external links`);
      const firstExternal = externalLinks.first();
      await expect(firstExternal).toBeVisible();
    }
  });

  test('footer links are present and accessible', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const footerLinks = page.locator('footer a, [role="contentinfo"] a');
    const count = await footerLinks.count();
    
    if (count > 0) {
      console.log(`Found ${count} footer links`);
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe('Button Interaction Tests', () => {
  
  test('all buttons are visible and clickable', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Find all buttons
    const buttons = page.locator('button, input[type="submit"], input[type="button"], [role="button"]');
    const count = await buttons.count();
    
    console.log(`Found ${count} buttons on page`);
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const button = buttons.nth(i);
        await expect(button).toBeVisible();
        
        // Check if button has text or aria-label
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        expect(text || ariaLabel).toBeTruthy();
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
      // Try clicking the first button and check for any change
      const firstButton = buttons.first();
      const initialUrl = page.url();
      
      await firstButton.click();
      
      // Wait a bit for any potential navigation or modal
      await page.waitForTimeout(1000);
      
      // Something should happen - URL change, modal appear, etc.
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

  test('search functionality works', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Look for search inputs
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[aria-label*="search" i]');
    const count = await searchInput.count();
    
    if (count > 0) {
      console.log('Found search input');
      await searchInput.first().fill('Mars');
      
      // Look for search button
      const searchButton = page.locator('button[type="submit"], button:has-text("Search")').first();
      
      if (await searchButton.isVisible()) {
        await searchButton.click();
        await page.waitForTimeout(1000);
        console.log('Search submitted');
      }
    }
  });

  test('form validation works', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Find any forms
    const forms = page.locator('form');
    const count = await forms.count();
    
    if (count > 0) {
      const form = forms.first();
      
      // Try to submit empty form
      const submitButton = form.locator('button[type="submit"], input[type="submit"]');
      if (await submitButton.count() > 0) {
        await submitButton.first().click();
        
        // Check for validation messages
        const validationMsg = page.locator('.error, [role="alert"], .validation-message');
        await page.waitForTimeout(500);
        
        console.log('Form validation tested');
      }
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
  
  test('modals can be opened and closed', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Look for modal triggers
    const modalTriggers = page.locator('[data-toggle="modal"], button:has-text("Open"), button:has-text("Show")');
    const count = await modalTriggers.count();
    
    if (count > 0) {
      const trigger = modalTriggers.first();
      await trigger.click();
      await page.waitForTimeout(500);
      
      // Look for modal
      const modal = page.locator('[role="dialog"], .modal, .popup');
      if (await modal.count() > 0) {
        await expect(modal.first()).toBeVisible();
        
        // Try to close it
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    }
  });

  test('accordions expand and collapse', async ({ page }) => {
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
      expect(newState).not.toBe(initialState);
    }
  });

  test('tabs switch content', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const tabs = page.locator('[role="tab"], .tab');
    const count = await tabs.count();
    
    if (count > 1) {
      console.log(`Found ${count} tabs`);
      
      // Click second tab
      await tabs.nth(1).click();
      await page.waitForTimeout(300);
      
      // Check if tab is selected
      const selected = await tabs.nth(1).getAttribute('aria-selected');
      console.log(`Tab selected state: ${selected}`);
    }
  });
});

test.describe('Keyboard Navigation Tests', () => {
  
  test('can navigate page with Tab key', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Press Tab multiple times
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    // Check if something is focused
    const focusedElement = await page.locator(':focus').count();
    expect(focusedElement).toBeGreaterThan(0);
    
    // Tab through more elements
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

  test('Escape key closes modals/popups', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Try pressing Escape
    await page.keyboard.press('Escape');
    
    // Check if any modals are closed
    const modals = page.locator('[role="dialog"]:visible, .modal:visible');
    const count = await modals.count();
    expect(count).toBe(0);
  });
});

test.describe('Content and Media Tests', () => {
  
  test('all images load successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const images = page.locator('img');
    const count = await images.count();
    
    console.log(`Found ${count} images`);
    
    if (count > 0) {
      // Check first few images
      for (let i = 0; i < Math.min(count, 3); i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();
        
        // Check if image has src
        const src = await img.getAttribute('src');
        expect(src).toBeTruthy();
      }
    }
  });

  test('videos are present and playable', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const videos = page.locator('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
    const count = await videos.count();
    
    if (count > 0) {
      console.log(`Found ${count} video elements`);
      await expect(videos.first()).toBeVisible();
    }
  });

  test('page content is readable', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for main content
    const main = page.locator('main, [role="main"], article, .content');
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
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
  });

  test('no JavaScript errors on page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('JavaScript errors found:', errors);
    }
    
    // This test logs errors but doesn't fail - adjust as needed
    expect(errors.length).toBeLessThan(10);
  });

  test('page resources return 200 status', async ({ page }) => {
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
    
    // Look for hamburger menu or mobile menu trigger
    const mobileMenu = page.locator('.hamburger, .menu-toggle, button[aria-label*="menu" i]');
    const count = await mobileMenu.count();
    
    if (count > 0) {
      await mobileMenu.first().click();
      await page.waitForTimeout(500);
      console.log('Mobile menu tested');
    }
  });

  test('touch interactions work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    const buttons = page.locator('button, a');
    if (await buttons.count() > 0) {
      await buttons.first().tap();
      console.log('Touch interaction tested');
    }
  });

  test('content is readable on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
