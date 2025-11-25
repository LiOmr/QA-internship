import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://avito-tech-internship-psi.vercel.app',
    navigationTimeout: 60_000,
    actionTimeout: 20_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  timeout: 60_000,
  testDir: './tests',
});
