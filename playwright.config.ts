import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 1,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'https://lobby.chumbacasino.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
  },
});
