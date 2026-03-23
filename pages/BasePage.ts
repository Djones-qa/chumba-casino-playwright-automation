﻿import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async navigateTo(path: string) {
    await this.page.goto(path);
  }
}
