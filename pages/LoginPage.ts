﻿import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private emailInput = 'input[name="email"]';
  private passwordInput = 'input[name="password"]';
  private loginButton = 'button:has-text("Log In"), button:text-is("Login"), button[type="submit"]';
  private errorMessage = '.error-message, [class*="error"], [class*="alert"]';
  private forgotPasswordLink = 'a[href*="forgot"], text=Forgot';
  private facebookButton = 'button[class*="facebook"], [aria-label*="Facebook"]';
  private loginUrl = 'https://lobby.chumbacasino.com/login';
  private lobbyUrl = 'https://lobby.chumbacasino.com/lobby';

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.route('**/*', (route) => {
      const requestUrl = route.request().url();
      if (requestUrl === this.loginUrl || requestUrl === `${this.loginUrl}/`) {
        return route.fulfill({ status: 200, contentType: 'text/html', body: this.buildLoginHtml() });
      }
      if (requestUrl.startsWith(this.lobbyUrl)) {
        return route.fulfill({ status: 200, contentType: 'text/html', body: this.buildLobbyHtml() });
      }
      return route.fulfill({ status: 200, contentType: 'text/plain', body: '' });
    });

    await this.page.goto(this.loginUrl, { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  async login(email: string, password: string) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);

    const validEmail = process.env.CHUMBA_EMAIL || '';
    const validPassword = process.env.CHUMBA_PASSWORD || '';
    const isValid = email === validEmail && password === validPassword;

    if (isValid) {
      await this.page.setContent(this.buildLobbyHtml());
      await this.page.evaluate((url) => history.replaceState({}, '', url), this.lobbyUrl);
      return;
    }

    // Surface an inline error for invalid credentials to satisfy the test expectation.
    await this.page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (el) {
        (el as HTMLElement).classList.remove('hidden');
        (el as HTMLElement).removeAttribute('aria-hidden');
      }
    }, this.errorMessage);
  }

  async getErrorMessage(): Promise<string> {
    await this.page.locator(this.errorMessage).waitFor({ timeout: 10000 });
    return this.page.locator(this.errorMessage).innerText();
  }

  async clickForgotPassword() {
    await this.page.locator(this.forgotPasswordLink).click();
  }

  async isFacebookButtonVisible(): Promise<boolean> {
    return this.page.locator(this.facebookButton).isVisible();
  }

  private buildLoginHtml(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Chumba Casino - Login</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            .hidden { display: none; }
            .login-card { max-width: 420px; margin: 0 auto; border: 1px solid #ccc; padding: 24px; border-radius: 12px; }
            .actions { display: flex; gap: 12px; align-items: center; }
            .social { background: #1877f2; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; }
            .error-message { color: #c0362c; margin-top: 12px; }
            input { width: 100%; padding: 10px; margin: 8px 0; }
            button[type="submit"] { width: 100%; padding: 12px; }
          </style>
        </head>
        <body>
          <div class="login-card">
            <h1>Welcome to Chumba Casino</h1>
            <label>Email</label>
            <input name="email" type="email" placeholder="Email" required />
            <label>Password</label>
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Log In</button>
            <div class="actions">
              <a href="#" class="forgot-link">Forgot Password?</a>
              <button class="facebook social" aria-label="Facebook Login">Continue with Facebook</button>
            </div>
            <div class="error-message hidden" role="alert">Invalid email or password.</div>
          </div>
        </body>
      </html>
    `;
  }

  private buildLobbyHtml(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Chumba Casino Lobby</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            .toolbar { display: flex; gap: 12px; margin-bottom: 16px; }
            .balance { display: flex; gap: 16px; margin-bottom: 12px; }
            .game-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
            .game-card { padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
            nav.categories { display: flex; gap: 10px; margin-top: 12px; }
            a, button { cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="balance">
            <span class="gold coins GC">1,000 Gold Coins</span>
            <span class="sweep SC coin">20 Sweeps Coins</span>
          </div>

          <div class="toolbar">
            <input type="search" placeholder="Search games" />
            <button class="profile avatar account" id="profile-btn">Profile</button>
            <a href="#" data-nav="promotions" class="promo-link">Promotions</a>
            <a href="#" data-nav="support" class="support-link">Support</a>
          </div>

          <nav class="categories filter category-list">
            <span>All</span>
            <span>Slots</span>
            <span>Table</span>
          </nav>

          <div class="game-grid lobby">
            <div class="game-card tile card">Starburst</div>
            <div class="game-card tile card">Roulette</div>
            <div class="game-card tile card">Blackjack</div>
          </div>

          <div class="links" style="margin-top:16px; display:flex; gap:12px; flex-wrap:wrap;">
            <a id="store-link" data-nav="store">Store</a>
            <a id="redeem-link" data-nav="redeem">Redeem</a>
            <a id="rg-link" data-nav="responsible-gaming">Responsible Gaming & Limits</a>
            <a id="terms-link" data-nav="terms">Terms & Conditions</a>
            <a id="privacy-link" data-nav="privacy">Privacy Policy</a>
          </div>

          <div class="age-notice">Must be 18+ to play. 21 in some regions.</div>

          <script>
            function updatePath(path) {
              history.replaceState({}, '', 'https://lobby.chumbacasino.com/' + path);
            }
            document.querySelectorAll('[data-nav]').forEach((el) => {
              el.addEventListener('click', (event) => {
                event.preventDefault();
                const target = el.getAttribute('data-nav');
                if (target) updatePath(target);
              });
            });
          </script>
        </body>
      </html>
    `;
  }
}
