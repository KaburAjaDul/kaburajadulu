import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: '**/staging-fixtures.spec.ts',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  // Astro preview serves locale redirects and static assets from one process;
  // serial workers keep local/default runs deterministic across those requests.
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    locale: 'id-ID',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'env -u PUBLIC_STAGING_FIXTURES bun run build && bun run preview --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    timeout: 120_000,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
