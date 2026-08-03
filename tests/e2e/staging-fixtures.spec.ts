import { expect, test, type Page } from '@playwright/test';

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}

test('staging is noindex and visibly labels fictional data', async ({ page }) => {
  await page.goto('/events/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('[data-fixture-id="demo-preview-fixture-kad-2026"]')).toBeVisible();
  await expect(page.getByText('Data simulasi', { exact: true }).first()).toBeVisible();
});

test('event schedule exposes simulated live, upcoming, completed, and detail states', async ({ page }) => {
  await page.goto('/events/', { waitUntil: 'domcontentloaded' });
  const cards = page.locator('.kad-event-card[data-fixture-id]');
  await expect(cards).toHaveCount(3);
  expect((await cards.evaluateAll((items) => items.map((item) => item.getAttribute('data-fixture-state')))).sort()).toEqual(['completed', 'live', 'upcoming']);

  const detailLink = cards.filter({ has: page.locator('[data-status="live"]') }).locator('h2 a');
  await detailLink.click();
  await expect(page.locator('[data-fixture-id="demo-event-mandarin-transport-01"]')).toBeVisible();
  await expect(page.getByText('Rekaman deterministik ini hanya dipakai untuk menguji pengalaman staging.')).toBeVisible();

  await page.goto('/events/not-published/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-state-panel="not-published"]')).toBeVisible();
});

test('programs expose deterministic next-session modules', async ({ page }) => {
  await page.goto('/programs/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.kad-session-preview[data-fixture-id]')).toHaveCount(2);
  await expect(page.getByRole('heading', { name: 'Lihat cara modul jadwal berikutnya bekerja.' })).toBeVisible();
});

test('volunteer staging shows fictional structure and opt-in profiles', async ({ page }) => {
  await page.goto('/volunteer/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-fixture-id^="demo-team-"]')).toHaveCount(3);
  await expect(page.locator('.kad-volunteer-card[data-fixture-id]')).toHaveCount(3);
  await expect(page.getByText('Semua tim ini fiktif, bukan bagan organisasi KAD saat ini.')).toBeVisible();
  await expect(page.getByText('Nara (fiktif)', { exact: true })).toBeVisible();
});

test('impact and credits show qualified demo records', async ({ page }) => {
  await page.goto('/community/impact/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.kad-metric-card[data-fixture-id]')).toHaveCount(3);
  await expect(page.getByText('Data simulasi', { exact: true }).first()).toBeVisible();

  await page.goto('/community/credits/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-fixture-id^="demo-contribution-"]')).toHaveCount(3);
  await expect(page.locator('[data-fixture-id^="demo-consent-"]')).toHaveCount(3);
  await expect(page.locator('[data-consent-status="granted-for-demo"]')).toHaveCount(1);
  await expect(page.locator('[data-consent-status="anonymous-by-choice"]')).toHaveCount(1);
  await expect(page.locator('[data-consent-status="revoked-demo"]')).toHaveCount(1);
  await expect(page.locator('[data-fixture-id="demo-consent-anonymous-01"]').getByRole('heading', { name: 'Relawan Anonim 1' })).toBeVisible();
});

test('English and fallback locale surfaces do not mix Indonesian fixture copy', async ({ page }) => {
  await page.goto('/en/events/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.kad-demo-banner')).toContainText('Demo data');
  await expect(page.getByRole('heading', { name: 'Community events' })).toBeVisible();
  await expect(page.getByText('Data simulasi', { exact: true })).toHaveCount(0);

  await page.goto('/ja/volunteer/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');
  await expect(page.getByText('This community surface is available in English while a full translation is prepared.')).toBeVisible();
  await expect(page.getByText('Sample volunteer profiles with explicit attribution.')).toBeVisible();

  await page.goto('/ar/events/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');
});

test('fixtures contain no contact or private-platform fields and layouts do not overflow', async ({ page }) => {
  for (const route of ['/events/', '/volunteer/', '/community/impact/']) {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expectNoHorizontalOverflow(page);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\b[^\s@]+@[^\s@]+\.[^\s@]+\b/);
    expect(body).not.toMatch(/discord_(?:id|message|channel)|channel id|message id/i);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expectNoHorizontalOverflow(page);
  }
});
