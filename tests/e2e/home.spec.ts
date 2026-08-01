import { expect, test, type Page } from '@playwright/test';

const DISCORD_URL = 'https://discord.gg/RUFFbEaeDx';
const OLD_DISCORD_URL = 'https://discord.com/invite/KaburAjaDulu';

const routes = [
  { path: '/', lang: 'id', dir: 'ltr' },
  { path: '/id/', lang: 'id', dir: 'ltr' },
  { path: '/en/', lang: 'en', dir: 'ltr' },
  { path: '/ja/', lang: 'ja', dir: 'ltr' },
  { path: '/zh-cn/', lang: 'zh-cn', dir: 'ltr' },
  { path: '/zh-tw/', lang: 'zh-tw', dir: 'ltr' },
  { path: '/ko/', lang: 'ko', dir: 'ltr' },
  { path: '/es/', lang: 'es', dir: 'ltr' },
  { path: '/ar/', lang: 'ar', dir: 'rtl' },
  { path: '/nl/', lang: 'nl', dir: 'ltr' },
  { path: '/it/', lang: 'it', dir: 'ltr' },
  { path: '/de/', lang: 'de', dir: 'ltr' },
  { path: '/fr/', lang: 'fr', dir: 'ltr' },
  { path: '/sv/', lang: 'sv', dir: 'ltr' },
] as const;

async function expectNoBrowserErrors(page: Page, errors: string[], expectedPath: string) {
  expect(errors, 'console.error and pageerror output').toEqual([]);
  expect(new URL(page.url()).pathname).toBe(expectedPath);
}

test.describe('localized home routes', () => {
  for (const route of routes) {
    test(`${route.path} renders the localized landing page`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(`console: ${message.text()}`);
      });
      page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

      await page.goto(route.path, { waitUntil: 'domcontentloaded' });

      await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
      await expect(page.locator('html')).toHaveAttribute('dir', route.dir);
      await expect(page.locator('main h1')).toBeVisible();

      const discordLinks = page.locator(`a[href="${DISCORD_URL}"]`);
      await expect(discordLinks).toHaveCount(3);
      for (let index = 0; index < 3; index += 1) {
        await expect(discordLinks.nth(index)).toHaveAttribute('target', '_blank');
        await expect(discordLinks.nth(index)).toHaveAttribute('rel', 'noopener noreferrer');
      }
      await expect(page.locator(`a[href="${OLD_DISCORD_URL}"]`)).toHaveCount(0);
      await expect(page).not.toHaveTitle('');
      expect(await page.content()).not.toContain(OLD_DISCORD_URL);
      await expectNoBrowserErrors(page, errors, route.path);
    });
  }
});

test.describe('root locale redirects', () => {
  test.use({ locale: 'ja-JP' });

  test('redirects a Japanese browser from / to /ja/', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`);
    });
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForURL('http://127.0.0.1:4321/ja/');
    await expect(page.locator('main h1')).toBeVisible();
    await expectNoBrowserErrors(page, errors, '/ja/');
  });
});

test('redirects a stored preferred locale from / to /fr', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

  await page.goto('/id/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.setItem('preferredLocale', 'fr'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForURL('http://127.0.0.1:4321/fr');
  await expect(page.locator('main h1')).toBeVisible();
  await expectNoBrowserErrors(page, errors, '/fr');
});

test('root metadata contains the Discord invite and a real GitHub contributor anchor', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const jsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent ?? '{}')),
  );
  expect(jsonLd).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        sameAs: expect.arrayContaining([DISCORD_URL]),
      }),
    ]),
  );

  const github = page.locator('a[href="https://github.com/KaburAjaDul/kaburajadulu"]');
  await expect(github).toHaveCount(1);
  await expect(github).toBeVisible();
  await expect(github).toHaveAttribute('target', '_blank');
  await expect(github).toHaveAttribute('rel', 'noopener noreferrer');
  expect(await github.evaluate((element) => element.tagName)).toBe('A');
  expect(await github.evaluate((element) => element.closest('button'))).toBeNull();
  await expect(page.locator('button a')).toHaveCount(0);
});

test('mobile viewport smoke keeps the primary content usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator(`a[href="${DISCORD_URL}"]`)).toHaveCount(3);
  await expect(page.locator('body')).toBeVisible();
});
