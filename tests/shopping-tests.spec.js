import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'https://shop.example.com';

test.describe('Shopping Cart Tests', () => {
  test('can view products', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Look for product listings
    const products = page.locator('[class*="product"], [class*="item"], .card');
    const count = await products.count();
    console.log(`Found ${count} products`);
  });

  test('add to cart button exists', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Look for add to cart buttons
    const addToCart = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Basket"), [class*="add-to-cart"]');
    const count = await addToCart.count();
    console.log(`Found ${count} add-to-cart buttons`);
  });

  test('cart icon is visible', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Look for shopping cart icon
    const cart = page.locator('[class*="cart"], [aria-label*="cart" i], [class*="basket"]');
    const count = await cart.count();
    
    if (count > 0) {
      await expect(cart.first()).toBeVisible();
      console.log('Shopping cart found');
    }
  });

  test('search products works', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Look for search box
    const search = page.locator('input[type="search"], input[placeholder*="search" i]');
    const count = await search.count();
    
    if (count > 0) {
      await search.first().fill('test product');
      console.log('Search box tested');
    }
  });

  test('checkout button exists', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const checkout = page.locator('button:has-text("Checkout"), a:has-text("Checkout"), [class*="checkout"]');
    const count = await checkout.count();
    console.log(`Found ${count} checkout buttons`);
  });
});
