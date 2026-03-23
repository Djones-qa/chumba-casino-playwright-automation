﻿import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const EMAIL = process.env.CHUMBA_EMAIL || '';
const PASSWORD = process.env.CHUMBA_PASSWORD || '';

test.describe('Authentication @auth', () => {
  test.slow();
  test.use({ actionTimeout: 30000 });

  test('should load login page successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL(/chumbacasino/);
    await expect(page).toHaveTitle(/Chumba/i);
  });

  test('should show email and password fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[name="password"], input[type="password"]').first()).toBeVisible();
  });

  test('should show error for invalid email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('invalidemail@fake.com', 'wrongpassword');
    const error = page.locator('[class*="error"], [class*="alert"], [class*="invalid"]').first();
    await expect(error).toBeVisible({ timeout: 10000 });
  });

  test('should show forgot password link', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const forgotLink = page.locator('a, button').filter({ hasText: /forgot/i }).first();
    await expect(forgotLink).toBeVisible();
  });

  test('should show social login options', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const socialBtn = page.locator('[class*="facebook"], [class*="google"], [class*="social"]').first();
    await expect(socialBtn).toBeVisible();
  });

  test('should login successfully with valid credentials @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(EMAIL, PASSWORD);
    await page.waitForURL(/lobby|dashboard|home/, { timeout: 40000, waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/lobby|dashboard|home/);
  });

});
