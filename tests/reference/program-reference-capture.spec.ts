import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

const captureDirectory = resolve('docs/public-content-system/captures');

const references = [
  {
    id: 'programs-desktop-populated',
    route: '/programs/',
    viewport: { width: 1440, height: 1000 },
    heading: 'Program komunitas',
  },
  {
    id: 'programs-mobile-populated',
    route: '/programs/',
    viewport: { width: 390, height: 844 },
    heading: 'Program komunitas',
  },
  {
    id: 'program-detail-desktop-populated',
    route: '/programs/french-club-trial/',
    viewport: { width: 1440, height: 1000 },
    heading: 'French Club trial',
  },
  {
    id: 'program-detail-mobile-populated',
    route: '/programs/french-club-trial/',
    viewport: { width: 390, height: 844 },
    heading: 'French Club trial',
  },
  {
    id: 'programs-desktop-filter-applied',
    route: '/programs/category/language/',
    viewport: { width: 1440, height: 1000 },
    heading: 'Program komunitas',
  },
  {
    id: 'programs-desktop-loading',
    route: '/design-preview/programs/loading/',
    viewport: { width: 1440, height: 1000 },
    heading: 'Program komunitas',
  },
  {
    id: 'programs-desktop-empty',
    route: '/design-preview/programs/empty/',
    viewport: { width: 1440, height: 1000 },
    heading: 'Program komunitas',
  },
  {
    id: 'programs-desktop-stale',
    route: '/design-preview/programs/stale/',
    viewport: { width: 1440, height: 1000 },
    heading: 'Program komunitas',
  },
  {
    id: 'programs-desktop-error',
    route: '/design-preview/programs/error/',
    viewport: { width: 1440, height: 1000 },
    heading: 'Program komunitas',
  },
] as const;

test.beforeAll(async () => {
  await mkdir(captureDirectory, { recursive: true });
});

for (const reference of references) {
  test(`capture ${reference.id}`, async ({ page }) => {
    await page.setViewportSize(reference.viewport);
    await page.goto(reference.route);
    await expect(page.getByRole('heading', { level: 1, name: reference.heading })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: resolve(captureDirectory, `${reference.id}.png`),
      fullPage: false,
      animations: 'disabled',
    });
  });
}
