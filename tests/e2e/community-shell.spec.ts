import { expect, test } from '@playwright/test';

const locales = ['id', 'en', 'ja', 'zh-cn', 'zh-tw', 'ko', 'es', 'ar', 'nl', 'it', 'de', 'fr', 'sv'] as const;
const sections = ['community', 'programs', 'events'] as const;
const routeCases = locales.flatMap((locale) => [
  { locale, pathPrefix: locale === 'id' ? '' : `${locale}/` },
  ...(locale === 'id' ? [{ locale, pathPrefix: 'id/' }] : []),
]);

test.describe('community rewrite shell', () => {
  for (const { locale, pathPrefix } of routeCases) {
    for (const section of sections) {
      test(`/${pathPrefix}${section} renders`, async ({ page }) => {
        await page.goto(`/${pathPrefix}${section}`, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('html')).toHaveAttribute('lang', locale);
        await expect(page.locator('main h1')).toBeVisible();
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`/${section}/?$`));
        await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', new RegExp(`/en/${section}/?$`));
      });
    }
  }

  test('events show an honest empty state and documented failure states', async ({ page }) => {
    await page.goto('/events');
    await expect(page.locator('[data-event-state="empty"]')).toContainText('Belum ada acara publik');
    await expect(page.locator('[data-event-state="stale"]')).toBeAttached();
    await expect(page.locator('[data-event-state="error"]')).toBeAttached();
  });

  test('desktop navigation marks the current page', async ({ page }) => {
    await page.goto('/id/programs');
    await expect(page.locator('nav[aria-label] a[aria-current="page"]')).toHaveCount(1);
    await expect(page.locator('.site-header nav a[href="/events"]')).toBeVisible();
    await expect(page.locator('.site-header nav a[href="https://discord.gg/RUFFbEaeDx"]')).toBeVisible();
  });

  test('skip link targets the page main landmark', async ({ page }) => {
    await page.goto('/community');
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
    await expect(page.locator('main#main-content')).toHaveCount(1);
  });

  test('mobile navigation is keyboard reachable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/community');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.focus();
    await expect(toggle).toBeFocused();
    await toggle.press('Enter');
    const closeToggle = page.getByRole('button', { name: 'Close menu' });
    await expect(closeToggle).toBeVisible();
    await expect(page.locator('#primary-navigation')).toHaveClass(/is-open/);
    await closeToggle.press('Escape');
    await expect(toggle).toBeVisible();
    await expect(toggle).toBeFocused();
    await expect(page.locator('#primary-navigation')).not.toHaveClass(/is-open/);
  });

  test('Arabic is RTL and reduced motion is respected', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/ar/events');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('a.button-primary')).toHaveCSS('transition-duration', '1e-05s');
    await page.getByRole('button', { name: 'فتح القائمة' }).click();
    await expect(page.locator('.nav-links')).toHaveCSS('flex-direction', 'column');
    await expect(page.locator('.nav-actions')).toHaveCSS('flex-direction', 'column');
  });

  test('fallback locales disclose that body copy is English', async ({ page }) => {
    await page.goto('/ja/community');
    await expect(page.locator('.community-shell')).toHaveAttribute('data-copy-locale', 'en');
    await expect(page.locator('.translation-notice')).toBeVisible();
  });

  test('legacy Arabic homepage keeps its RTL flex treatment', async ({ page }) => {
    await page.goto('/ar/');
    await expect(page.locator('.flex.items-center').first()).toHaveCSS('flex-direction', 'row-reverse');
  });

  test('sitemap contains all shell routes and no private identifiers', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBeTruthy();
    const sitemap = await response.text();
    for (const locale of locales) for (const section of sections) expect(sitemap).toContain(`/${locale === 'id' ? '' : `${locale}/`}${section}`);
    for (const section of sections) expect(sitemap).not.toContain(`/id/${section}`);
    expect(sitemap).not.toContain('discord.com/invite');
    expect(sitemap).not.toContain('channel');
  });
});
