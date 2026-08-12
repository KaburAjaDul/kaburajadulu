import { expect, test, type Page } from '@playwright/test';

const invite = 'https://discord.gg/RUFFbEaeDx';

const readyPayload = {
  schemaVersion: 'v1',
  generatedAt: '2026-08-11T12:00:00.000Z',
  observedAt: '2026-08-11T12:00:00.000Z',
  revision: 42,
  sourceStatus: 'fresh',
  staleAt: '2026-08-11T12:45:00.000Z',
  entries: [
    {
      id: 'agenda_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      title: 'Japanese Intermediate',
      summary: 'Latihan percakapan untuk level berikutnya.',
      startAt: '2026-08-12T12:00:00.000Z',
      endAt: '2026-08-12T13:00:00.000Z',
      timezone: 'Asia/Jakarta',
      status: 'scheduled',
      program: 'Language Study Club',
      series: 'Japanese N3',
      joinUrl: invite,
      source: 'discord_scheduled_event',
    },
    {
      id: 'agenda_BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      title: 'Japanese for Beginner',
      summary: 'Sesi terbuka untuk mulai belajar bersama.',
      startAt: '2026-08-11T12:00:00.000Z',
      endAt: null,
      timezone: 'Asia/Jakarta',
      status: 'active',
      program: 'Language Study Club',
      series: 'Japanese N4',
      joinUrl: invite,
      source: 'discord_scheduled_event',
    },
  ],
};

async function mockAgenda(page: Page, payload: unknown) {
  await page.route('**/api/v1/agenda', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });
  });
}

test.describe('live public agenda', () => {
  test('renders active first, keeps the action open, and excludes sensitive fields', async ({ page }) => {
    await mockAgenda(page, readyPayload);
    await page.goto('/events/', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('[data-agenda-phase="ready"]')).toBeVisible();
    await expect(page.locator('[data-agenda-entry]').first()).toHaveAttribute('data-agenda-status', 'active');
    await expect(page.locator('[data-agenda-entry]')).toHaveCount(2);
    await expect(page.locator('[data-discord-join-path]')).toHaveCount(2);
    await expect(page.locator('[data-discord-join-path]').first()).toHaveAttribute('href', invite);
    await expect(page.locator('main')).toContainText('Tidak perlu mendaftar atau mengonfirmasi lewat web.');
    await expect(page.locator('[data-agenda-entry]').first()).toContainText('Waktu selesai belum dipublikasikan.');
    await expect(page.locator('[data-agenda-entry]').first()).toContainText('Acara terjadwal di Discord');
    await expect(page.locator('[data-agenda-freshness]')).toHaveText('Revisi sumber 42');
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/<@!?\d+>|@everyone|@here|\b\d{17,20}\b|discord\.com\/channels/i);
  });

  test('renders an honest empty state with a Discord fallback', async ({ page }) => {
    await mockAgenda(page, { ...readyPayload, entries: [] });
    await page.goto('/events/', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('[data-agenda-state="empty"]')).toContainText('Belum ada agenda publik terjadwal.');
    await expect(page.locator('[data-agenda-state="empty"] a[href]')).toHaveAttribute('href', invite);
  });

  test('labels stale source data without hiding the schedule', async ({ page }) => {
    await mockAgenda(page, { ...readyPayload, sourceStatus: 'stale', staleAt: '2026-08-10T12:00:00.000Z' });
    await page.goto('/events/', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('[data-agenda-state="stale"]')).toBeVisible();
    await expect(page.locator('[data-agenda-entry]')).toHaveCount(2);
    await expect(page.locator('[data-agenda-freshness]')).toHaveText('Revisi sumber 42');
  });

  test('discloses staleness even when the last snapshot is empty', async ({ page }) => {
    await mockAgenda(page, { ...readyPayload, sourceStatus: 'stale', staleAt: '2026-08-10T12:00:00.000Z', entries: [] });
    await page.goto('/events/', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('[data-agenda-state="stale"]')).toContainText('Agenda mungkin belum mutakhir.');
    await expect(page.locator('[data-agenda-state="empty"]')).toContainText('Belum ada agenda publik terjadwal.');
  });

  test('offers retry and Discord fallback when the API fails', async ({ page }) => {
    let attempts = 0;
    await page.route('**/api/v1/agenda', async (route) => {
      attempts += 1;
      if (attempts === 1) await route.fulfill({ status: 503, body: 'unavailable' });
      else await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(readyPayload) });
    });
    await page.goto('/events/', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('[data-agenda-state="error"]')).toBeVisible();
    await expect(page.locator('[data-agenda-state="error"] a[href]')).toHaveAttribute('href', invite);
    await page.getByRole('button', { name: 'Coba lagi' }).click();
    await expect(page.locator('[data-agenda-phase="ready"]')).toBeVisible();
    expect(attempts).toBe(2);
  });

  test('rejects the whole payload when one entry violates the public contract', async ({ page }) => {
    await mockAgenda(page, {
      ...readyPayload,
      entries: [
        ...readyPayload.entries,
        { ...readyPayload.entries[0], id: 'agenda_CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC', discord_id: '123456789012345678' },
      ],
    });
    await page.goto('/events/', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('[data-agenda-state="error"]')).toBeVisible();
    await expect(page.locator('[data-agenda-entry]')).toHaveCount(0);
  });

  test('keeps desktop and mobile agenda content contained and localizes English copy', async ({ page }) => {
    await mockAgenda(page, readyPayload);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/en/events/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-agenda-entry]').first()).toContainText('Jakarta time (WIB)');
    await expect(page.locator('[data-agenda-entry]').first()).toContainText('End time not published.');
    const headingBox = await page.locator('.kad-live-agenda__header h1').boundingBox();
    expect(headingBox?.height ?? Number.POSITIVE_INFINITY).toBeLessThan(80);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await expect(page.locator('[data-discord-join-path]').first()).toBeVisible();
  });
});
