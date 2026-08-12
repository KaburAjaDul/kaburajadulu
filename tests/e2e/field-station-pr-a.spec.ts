import { expect, test, type Page } from '@playwright/test';

const DISCORD_URL = 'https://discord.gg/RUFFbEaeDx';

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
}

test.describe('KAD Field Station PR A', () => {
  test('Home establishes the new visual system and a single primary funnel', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const surface = page.locator('[data-field-station="home"]');
    await expect(surface).toBeVisible();
    await expect(surface.locator('h1')).toHaveText('Mulai dari pertanyaan yang nyata.');
    await expect(page.locator('[data-home-primary-action]')).toHaveCount(1);
    await expect(page.locator(`a[href="${DISCORD_URL}"]`)).toHaveCount(3);
    await expect(page.locator('.kad-nav-discord.kad-button--primary')).toHaveCount(0);
    await expect(page.locator('.kad-footer__discord.kad-button--primary')).toHaveCount(0);
    await expect(page.locator('.kad-city-atlas')).toBeVisible();

    const tokens = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const body = getComputedStyle(document.body);
      const primary = getComputedStyle(document.querySelector('[data-home-primary-action]')!);
      return {
        paper: root.getPropertyValue('--kad-paper').trim(),
        cobalt: root.getPropertyValue('--kad-cobalt').trim(),
        bodyBackground: body.backgroundColor,
        primaryRadius: primary.borderRadius,
      };
    });
    expect(tokens.paper).toBe('#f5f1e9');
    expect(tokens.cobalt).toBe('#155bff');
    expect(tokens.bodyBackground).toBe('rgb(245, 241, 233)');
    expect(Number.parseFloat(tokens.primaryRadius)).toBeLessThanOrEqual(8);
    await expectNoHorizontalOverflow(page);
  });

  test('Home keeps locale-specific primary copy inside the new composition', async ({ page }) => {
    await page.goto('/ja/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-field-station="home"]')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('[data-field-station="home"] h1')).toHaveText('本当の疑問から始めよう。');
    await expect(page.locator('[data-home-primary-action]')).toContainText('DiscordでKADに参加');
  });

  test('Community opens with activity, people, and qualified community metrics', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/community/', { waitUntil: 'domcontentloaded' });

    const surface = page.locator('[data-field-station="community"]');
    await expect(surface).toBeVisible();
    await expect(surface.locator('#community-title')).toHaveText('Lihat apa yang sedang dijalankan bersama.');
    await expect(surface.locator('.kad-community-information__current-record')).toBeVisible();
    await expect(surface.locator('.kad-community-information__current-people')).toBeVisible();
    await expect(surface.locator('[data-community-metric]')).toHaveCount(3);
    await expect(surface.locator('[data-community-section]')).toHaveCount(5);
    await expect(page.locator('main > .kad-demo-banner')).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  });

  test('Home and Community remain contained on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ['/', '/community/']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('main h1')).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const selectorGrid = await page.locator('.kad-city-atlas__selectors').evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      columns: getComputedStyle(element).gridTemplateColumns.split(' ').length,
    }));
    expect(selectorGrid.scrollWidth).toBeLessThanOrEqual(selectorGrid.clientWidth);
    expect(selectorGrid.columns).toBe(2);
  });

  test('reduced motion disables automatic city rotation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-testid="destination-autoplay-toggle"]')).toBeDisabled();
    await expect(page.locator('[data-testid="featured-destination"]')).toHaveAttribute('data-destination', 'seoul');
  });
});
