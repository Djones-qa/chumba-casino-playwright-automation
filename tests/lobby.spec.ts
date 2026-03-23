﻿import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LobbyPage } from '../pages/LobbyPage';

const EMAIL = process.env.CHUMBA_EMAIL || '';
const PASSWORD = process.env.CHUMBA_PASSWORD || '';

test.describe('Game Lobby @lobby', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(EMAIL, PASSWORD);
    await page.waitForURL(/lobby|dashboard|home/, { timeout: 40000, waitUntil: 'domcontentloaded' });
  });

  test('should show game grid after login', async ({ page }) => {
    const lobbyPage = new LobbyPage(page);
    const gameGrid = page.locator('[class*="game"], [class*="tile"], [class*="card"]').first();
    await expect(gameGrid).toBeVisible({ timeout: 15000 });
  });

  test('should show gold coins balance', async ({ page }) => {
    const balance = page.locator('[class*="gold"], [class*="GC"], [class*="coin"]').first();
    await expect(balance).toBeVisible({ timeout: 10000 });
  });

  test('should show sweeps coins balance', async ({ page }) => {
    const balance = page.locator('[class*="sweep"], [class*="SC"]').first();
    await expect(balance).toBeVisible({ timeout: 10000 });
  });

  test('should have search functionality', async ({ page }) => {
    const searchBox = page.locator('input[placeholder*="earch"], input[type="search"]').first();
    await expect(searchBox).toBeVisible({ timeout: 10000 });
    await searchBox.fill('Slots');
    await page.waitForTimeout(2000);
  });

  test('should have game categories', async ({ page }) => {
    const categories = page.locator('[class*="categor"], [class*="filter"], nav').first();
    await expect(categories).toBeVisible({ timeout: 10000 });
  });

});
