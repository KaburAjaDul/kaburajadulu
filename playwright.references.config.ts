import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/reference',
  timeout: 30_000,
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    locale: 'id-ID',
    trace: 'off',
    screenshot: 'off',
    video: 'off',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'env -u PUBLIC_STAGING_FIXTURES bun run build && bun run preview --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
