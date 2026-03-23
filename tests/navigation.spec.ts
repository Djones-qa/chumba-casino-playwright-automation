﻿import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const EMAIL = process.env.CHUMBA_EMAIL || '';
const PASSWORD = process.env.CHUMBA_PASSWORD || '';

test.describe('Navigation @navigation', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(EMAIL, PASSWORD);
    await page.waitForURL(/lobby|dashboard|home/, { timeout: 40000, waitUntil: 'domcontentloaded' });
  });

  test('should navigate to store page', async ({ page }) => {
    const storeLink = page.locator('a, button').filter({ hasText: /store|buy|purchase/i }).first();
    await expect(storeLink).toBeVisible({ timeout: 10000 });
    await storeLink.click();
    await page.waitForTimeout(2000);
    await expect(page.url()).toMatch(/store|shop|purchase/);
  });

  test('should navigate to redeem page', async ({ page }) => {
    const redeemLink = page.locator('a, button').filter({ hasText: /redeem/i }).first();
    await expect(redeemLink).toBeVisible({ timeout: 10000 });
    await redeemLink.click();
    await page.waitForTimeout(2000);
    await expect(page.url()).toMatch(/redeem/);
  });

  test('should open profile menu', async ({ page }) => {
    const profileBtn = page.locator('[class*="profile"], [class*="avatar"], [class*="account"]').first();
    await expect(profileBtn).toBeVisible({ timeout: 10000 });
    await profileBtn.click();
    await page.waitForTimeout(1000);
  });

  test('should have promotions section', async ({ page }) => {
    const promoLink = page.locator('a, button').filter({ hasText: /promo|bonus|offer/i }).first();
    await expect(promoLink).toBeVisible({ timeout: 10000 });
  });

  test('should have support access', async ({ page }) => {
    const supportLink = page.locator('a, button').filter({ hasText: /support|help|contact/i }).first();
    await expect(supportLink).toBeVisible({ timeout: 10000 });
  });

});
