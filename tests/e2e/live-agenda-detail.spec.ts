import { expect, test } from '@playwright/test';

const invite = 'https://discord.gg/RUFFbEaeDx';
const id = 'agenda_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
const entry = { id, title: 'French Study Club', summary: 'Public beginner French session.', startAt: '2026-08-12T12:00:00.000Z', endAt: '2026-08-12T13:00:00.000Z', timezone: 'Asia/Jakarta', status: 'scheduled', program: 'French Study Club', series: 'Beginner', joinUrl: invite, source: 'discord_scheduled_event' };
const detail = { schemaVersion: 'v1', generatedAt: '2026-08-11T12:00:00.000Z', observedAt: '2026-08-11T12:00:00.000Z', revision: 42, sourceStatus: 'fresh', staleAt: '2099-08-11T12:45:00.000Z', entry };
const list = { schemaVersion: detail.schemaVersion, generatedAt: detail.generatedAt, observedAt: detail.observedAt, revision: detail.revision, sourceStatus: detail.sourceStatus, staleAt: detail.staleAt, entries: [entry] };

async function mockAgenda(page: import('@playwright/test').Page) {
  await page.route('**/api/v1/agenda', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(list) }));
  await page.route(`**/api/v1/agenda/${id}`, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(detail) }));
}

test('live agenda detail is source-backed, mapped, and safe', async ({ page }) => {
  await mockAgenda(page);
  await page.goto(`/events/live/?id=${id}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-agenda-detail-phase="ready"]')).toContainText('French Study Club');
  await expect(page.locator('[data-agenda-detail-phase="ready"] a[href="/programs/live/?program=french-study-club"]')).toBeVisible();
  await expect(page.locator('[data-discord-join-path]')).toHaveAttribute('href', invite);
  await expect(page.locator('time')).toHaveCount(2);
  await expect(page.locator('main')).not.toContainText(/discord_id|snowflake|channel/i);
});

test('withdrawn detail renders a minimal tombstone without forbidden fields', async ({ page }) => {
  await page.route(`**/api/v1/agenda/${id}`, (route) => route.fulfill({ status: 410, headers: { 'cache-control': 'no-store' }, contentType: 'application/json', body: JSON.stringify({ error: { code: 'agenda_withdrawn', detail: 'This agenda record is no longer public.' } }) }));
  await page.goto(`/events/live/?id=${id}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-agenda-detail-phase="withdrawn"]')).toBeVisible();
  const body = await page.locator('main').innerText();
  expect(body).not.toMatch(/French Study Club|Beginner|discord\.gg|program|series|source/i);
});

test('ID, EN, and AR preserve localized agenda and program routes', async ({ page }) => {
  await mockAgenda(page);
  for (const [prefix, detailPath, programPath] of [['', '/events/live/', '/programs/live/'], ['/en', '/en/events/live/', '/en/programs/live/'], ['/ar', '/ar/events/live/', '/ar/programs/live/']] as const) {
    await page.goto(`${detailPath}?id=${id}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-agenda-detail-phase="ready"] a[href*="programs/live"]')).toHaveAttribute('href', `${programPath}?program=french-study-club`);
    await expect(page.locator('[data-agenda-detail-phase="ready"] .kad-button--outline')).toHaveAttribute('href', `${prefix}/events` || '/events');
  }
  await page.goto(`/ja/events/live/?id=${id}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');
  await expect(page.locator('[data-translation-fallback="true"]')).toContainText('available in English');
  await expect(page.locator('[data-agenda-detail-phase="ready"] a[href*="programs/live"]')).toHaveAttribute('href', `/ja/programs/live/?program=french-study-club`);
});

test('live program route maps active/next sessions and fails closed for unknown families', async ({ page }) => {
  await mockAgenda(page);
  await page.goto('/programs/live/?program=french-study-club', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-live-program-detail="french-study-club"]')).toContainText('French Study Club');
  await expect(page.locator('[data-live-program-session]')).toHaveCount(1);
  await expect(page.locator('[data-live-program-detail] time')).toHaveCount(2);
  await page.goto('/ar/programs/live/?program=not-allowed', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-live-program-state="unmapped"]')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('live program and Study Club errors expose a retry action', async ({ page }) => {
  let attempts = 0;
  await page.route('**/api/v1/agenda', async (route) => {
    attempts += 1;
    if (attempts % 2 === 1) return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: { code: 'agenda_unavailable' } }) });
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(list) });
  });
  await page.goto('/en/programs/live/?program=french-study-club', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-live-program-state="error"]')).toBeVisible();
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('[data-live-program-session]')).toHaveCount(1);

  attempts = 0;
  await page.goto('/en/programs/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-live-study-state="error"]')).toBeVisible();
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('[data-live-study-clubs-phase="ready"]')).toBeVisible();

  attempts = 0;
  await page.goto('/en/community/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-community-summary-error]')).toBeVisible();
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('[data-community-live-summary][data-summary-phase="ready"]')).toBeVisible();
});

test('live program keeps a stale warning when no matching session is published', async ({ page }) => {
  await page.route('**/api/v1/agenda', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...list, sourceStatus: 'stale', staleAt: '2026-08-01T12:00:00.000Z', entries: [{ ...entry, program: 'Japanese Study Club' }] }) }));
  await page.goto('/en/programs/live/?program=french-study-club', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-live-program-state="empty"]')).toBeVisible();
  await expect(page.locator('[data-live-program-state="stale"]')).toBeVisible();
  await expect(page.locator('[data-live-program-detail][data-live-program-phase="stale-empty"]')).toBeVisible();
});

test('failed retries clear previously rendered program and Study Club sessions', async ({ page }) => {
  let attempts = 0;
  await page.route('**/api/v1/agenda', async (route) => {
    attempts += 1;
    if (attempts === 1) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(list) });
    return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: { code: 'agenda_unavailable' } }) });
  });
  await page.goto('/en/programs/live/?program=french-study-club', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-live-program-session]')).toHaveCount(1);
  await page.locator('[data-live-program-retry]').click();
  await expect(page.locator('[data-live-program-state="error"]')).toBeVisible();
  await expect(page.locator('[data-live-program-session]')).toHaveCount(0);

  attempts = 0;
  await page.goto('/en/programs/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-live-study-program]')).toHaveCount(1);
  await page.locator('[data-live-study-retry]').click();
  await expect(page.locator('[data-live-study-state="error"]')).toBeVisible();
  await expect(page.locator('[data-live-study-program]')).toHaveCount(0);
});

test('Community exposes live schedule coverage separately from static source records', async ({ page }) => {
  await mockAgenda(page);
  await page.goto('/en/programs/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-live-study-clubs]')).toContainText('Live Study Clubs');
  await expect(page.locator('[data-live-study-program="french-study-club"] a')).toHaveAttribute('href', '/en/programs/live/?program=french-study-club');
  await expect(page.locator('[data-program-record]')).toHaveCount(5);
});
