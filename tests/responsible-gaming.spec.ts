﻿import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const EMAIL = process.env.CHUMBA_EMAIL || '';
const PASSWORD = process.env.CHUMBA_PASSWORD || '';

test.describe('Responsible Gaming @responsible', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(EMAIL, PASSWORD);
    await page.waitForURL(/lobby|dashboard|home/, { timeout: 40000, waitUntil: 'domcontentloaded' });
  });

  test('should have responsible gaming link', async ({ page }) => {
    const rgLink = page.locator('a, button').filter({ hasText: /responsible|gaming|limits/i }).first();
    await expect(rgLink).toBeVisible({ timeout: 10000 });
  });

  test('should have terms and conditions link', async ({ page }) => {
    const termsLink = page.locator('a').filter({ hasText: /terms|conditions/i }).first();
    await expect(termsLink).toBeVisible({ timeout: 10000 });
  });

  test('should have privacy policy link', async ({ page }) => {
    const privacyLink = page.locator('a').filter({ hasText: /privacy/i }).first();
    await expect(privacyLink).toBeVisible({ timeout: 10000 });
  });

  test('should have age verification notice', async ({ page }) => {
    const ageNotice = page.locator('text=/18|21|age/i').first();
    await expect(ageNotice).toBeVisible({ timeout: 10000 });
  });

});
