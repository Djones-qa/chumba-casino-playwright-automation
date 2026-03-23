import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LobbyPage extends BasePage {
  private gameGrid = '[class*="game"], [class*="lobby"], [class*="tile"]';
  private searchBox = 'input[placeholder*="Search"], input[type="search"]';
  private goldCoinsBalance = '[class*="gold"], [class*="GC"]';
  private sweepsCoinsBalance = '[class*="sweep"], [class*="SC"]';
  private dailyBonus = '[class*="bonus"], [class*="daily"]';
  private profileMenu = '[class*="profile"], [class*="avatar"], [class*="user"]';

  constructor(page: Page) {
    super(page);
  }

  async assertOnLobbyPage() {
    await expect(this.page).toHaveURL(/lobby/);
  }

  async isGameGridVisible(): Promise<boolean> {
    return this.page.locator(this.gameGrid).first().isVisible();
  }

  async searchForGame(gameName: string) {
    await this.page.locator(this.searchBox).fill(gameName);
    await this.page.waitForTimeout(2000);
  }

  async getGoldCoinsBalance(): Promise<string> {
    return this.page.locator(this.goldCoinsBalance).first().innerText();
  }

  async getSweepsCoinsBalance(): Promise<string> {
    return this.page.locator(this.sweepsCoinsBalance).first().innerText();
  }

  async isDailyBonusVisible(): Promise<boolean> {
    return this.page.locator(this.dailyBonus).first().isVisible();
  }

  async openProfileMenu() {
    await this.page.locator(this.profileMenu).first().click();
  }

  async navigateToStore() {
    await this.page.goto('/store');
    await this.waitForPageLoad();
  }

  async navigateToRedeem() {
    await this.page.goto('/redeem');
    await this.waitForPageLoad();
  }

  async navigateToPromotions() {
    await this.page.goto('/promotions');
    await this.waitForPageLoad();
  }
}
