import { expect, test, type Page } from '@playwright/test';

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}

const liveAgendaPayload = {
  schemaVersion: 'v1',
  generatedAt: '2026-08-11T12:00:00.000Z',
  observedAt: '2026-08-11T12:00:00.000Z',
  revision: 1723377600000,
  sourceStatus: 'fresh',
  staleAt: '2026-08-11T12:45:00.000Z',
  entries: [
    {
      id: `agenda_${'A'.repeat(43)}`,
      title: 'Japanese Study Club — N5',
      summary: 'A welcoming Japanese practice session for N5 learners.',
      startAt: '2026-08-12T12:00:00.000Z',
      endAt: '2026-08-12T13:00:00.000Z',
      timezone: 'Asia/Jakarta',
      status: 'scheduled',
      program: 'Japanese Study Club',
      series: 'N5',
      joinUrl: 'https://discord.gg/RUFFbEaeDx',
      source: 'discord_scheduled_event',
    },
    {
      id: `agenda_${'B'.repeat(43)}`,
      title: 'English Study Club',
      summary: 'A supportive English practice session for learners.',
      startAt: '2026-08-13T12:00:00.000Z',
      endAt: null,
      timezone: 'Asia/Jakarta',
      status: 'scheduled',
      program: 'English Study Club',
      series: null,
      joinUrl: 'https://discord.gg/RUFFbEaeDx',
      source: 'discord_scheduled_event',
    },
  ],
};

async function mockLiveAgenda(page: Page): Promise<void> {
  await page.route('**/api/v1/agenda', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(liveAgendaPayload) }));
}

test('staging is noindex and visibly labels fictional data', async ({ page }) => {
  await page.goto('/events/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('[data-fixture-id="demo-preview-fixture-kad-2026"]')).toBeVisible();
  await expect(page.locator('.kad-demo-banner summary')).toHaveText('Pratinjau · data contoh');
});

test('community staging exposes qualified current metrics, agenda, and consent-safe people', async ({ page }) => {
  await page.goto('/community/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('[data-community-section="current"] [data-community-metric^="demo-metric-"]')).toHaveCount(3);
  await expect(page.locator('[data-community-section="current"] .kad-community-information__metric-value')).toHaveText(['12', '8', '3']);
  await expect(page.locator('[data-community-section="current"] [data-community-metric="demo-metric-contributions-2026-08"]')).toContainText('Kontribusi program tercatat');
  await expect(page.locator('[data-community-section="current"]')).not.toContainText('Kontributor aktif');
  await expect(page.locator('[data-community-section="current"] .kad-community-information__metric-detail')).toHaveCount(3);
  await expect(page.locator('[data-community-section="programs"] [data-program-record]')).toHaveCount(3);
  await expect(page.locator('[data-community-section="agenda"] [data-agenda-kind]')).toHaveCount(1);
  await expect(page.locator('[data-community-section="people"] [data-attribution="opt-in-demo"]')).toHaveCount(1);
  await expect(page.locator('[data-community-section="people"] [data-attribution="anonymous-stub"]')).toHaveCount(2);
  await expect(page.locator('[data-community-section="people"]').getByText('Nara (fiktif)', { exact: true })).toBeVisible();
  await expect(page.getByText('Bima (fiktif)', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Sari (fiktif)', { exact: true })).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  const mobileAgenda = await page.locator('[data-community-section="agenda"] [data-agenda-kind]').evaluate((element) => {
    const content = element.firstElementChild?.getBoundingClientRect();
    const time = element.querySelector('time')?.getBoundingClientRect();
    return { itemWidth: element.getBoundingClientRect().width, contentWidth: content?.width ?? 0, timeWidth: time?.width ?? 0 };
  });
  expect(mobileAgenda.contentWidth).toBeGreaterThan(mobileAgenda.itemWidth * 0.8);
  expect(mobileAgenda.timeWidth).toBeGreaterThan(100);
});

test('staging uses one compact page-level preview notice', async ({ page }) => {
  for (const viewport of [
    { width: 1280, height: 720, maxNoticeHeight: 48 },
    { width: 390, height: 844, maxNoticeHeight: 64 },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const route of ['/community/', '/events/', '/events/demo-session-japanese-n5-01/', '/programs/', '/programs/japanese-study-club/', '/volunteer/', '/stories/', '/stories/catatan-belajar-satu-siklus/', '/about/history/', '/community/impact/', '/community/credits/', '/support/']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const notices = page.locator('.kad-demo-banner:visible, [data-preview-notice="true"]:visible');
      await expect(notices, `${route} should expose one visible preview notice`).toHaveCount(1);
      const box = await notices.boundingBox();
      expect(box, `${route} preview notice should have a measurable box`).not.toBeNull();
      expect(box?.height ?? Number.POSITIVE_INFINITY, `${route} preview notice should stay compact at ${viewport.width}px`).toBeLessThanOrEqual(viewport.maxNoticeHeight);
      if (route === '/community/') {
        await expect(notices).toContainText('Pratinjau · data contoh');
      } else {
        await expect(notices.locator('details')).toHaveCount(1);
      }
    }
  }
});

test('Agenda fixture exercises the signed public shape without static schedule records', async ({ page }) => {
  await mockLiveAgenda(page);
  await page.goto('/events/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-agenda-phase="ready"]')).toBeVisible();
  await expect(page.locator('[data-agenda-entry]')).toHaveCount(2);
  await expect(page.locator('[data-discord-join-path]')).toHaveCount(2);
  await expect(page.locator('[data-agenda-freshness]')).toContainText(/Revisi sumber|Source revision/);
  await expect(page.locator('body')).not.toContainText(/Pulse|Denyut/i);
  const directSession = page.locator('[data-agenda-entry]').filter({ hasText: 'English Study Club' });
  await expect(directSession.locator('dt')).not.toContainText(/series|seri/i);

  await page.goto('/events/not-published/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-state-panel="not-published"]')).toBeVisible();
});

test('legacy Agenda fixture detail remains evidence-safe while live rows hand off directly', async ({ page }) => {
  await page.goto('/events/demo-session-japanese-n5-01/', { waitUntil: 'domcontentloaded' });
  const detail = page.locator('.kad-record-intro, .kad-record-actions');
  await expect(page.locator('.kad-record-intro')).toBeVisible();
  await expect(page.locator('.kad-record-actions')).toBeVisible();
  const detailText = await detail.allInnerTexts().then((parts) => parts.join('\n'));
  expect(detailText).not.toMatch(/demo-(?:event|session)-[a-z0-9-]+|fixture\s*id|deterministic|developer|staging seed|discord_(?:id|message|channel)/i);
  await expect(page.locator('.kad-record-facts dt')).toHaveText(['Status', 'Waktu', 'Durasi', 'Program', 'Seri', 'Revisi sumber']);
  await expect(page.locator('.kad-record-facts')).toContainText(/Akan datang|Upcoming/i);
  await expect(page.locator('.kad-record-facts')).toContainText(/Japanese Study Club/i);
  await expect(page.locator('.kad-record-facts')).toContainText(/N5/i);
  await expect(page.locator('.kad-record-facts a[href*="/programs/"]')).toHaveCount(1);
  await expect(page.locator('.kad-record-actions a[href*="discord"]')).toHaveCount(1);
  await expect(page.locator('.kad-record-actions a[href$="/events"], .kad-record-actions a[href$="/events/"]')).toHaveCount(1);

  await page.goto('/events/demo-event-community-collaboration-01/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-agenda-kind="event"]')).toBeVisible();
  await expect(page.locator('.kad-record-facts')).toContainText(/Standalone event|Acara berdiri sendiri/i);
});

test('programs keep the catalogue focused instead of adding a staging assistant module', async ({ page }) => {
  await page.goto('/programs/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-page-family="programs"]')).toBeVisible();
  await expect(page.locator('.kad-session-preview')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Lihat cara modul jadwal berikutnya bekerja.' })).toHaveCount(0);
});

test('staging Programs expose optional Series, direct Sessions, metrics, responsibilities, and honest Tech/Coding state', async ({ page }) => {
  await page.goto('/programs/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-program-record]')).toHaveCount(5);
  for (const title of ['Korean Study Club', 'CeritaAjaDulu']) {
    await expect(page.locator('[data-program-record]').filter({ hasText: title }).locator('[data-program-availability="needs_confirmation"]')).toHaveCount(1);
  }

  await page.goto('/programs/japanese-study-club/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-program-series]')).toHaveCount(3);
  await expect(page.locator('[data-program-series][data-series-id="japanese-n5"]')).toBeVisible();
  await expect(page.locator('[data-program-series][data-series-id="japanese-n4-n3"]')).toBeVisible();
  await expect(page.locator('[data-program-series][data-series-id="japanese-n2-n1"]')).toBeVisible();
  await expect(page.locator('[data-program-metric]')).toHaveCount(4);
  await expect(page.locator('[data-contributor-responsibility]')).toHaveCount(2);

  await page.goto('/programs/english-study-club/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-program-series]')).toHaveCount(0);
  await expect(page.locator('[data-program-session][data-series-id]')).toHaveCount(0);

  await page.goto('/programs/tech-coding-club/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-program-repository]')).toContainText('Belum ada repositori proyek.');
});

test('volunteer staging shows the current cycle, privacy-safe structure, and contribution path', async ({ page }) => {
  await page.goto('/volunteer/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-fixtures="enabled"]')).toBeVisible();
  await expect(page.locator('[data-volunteer-cycle]')).toContainText('siklus 3 bulan');
  await expect(page.locator('[data-volunteer-position]')).toHaveCount(4);
  await expect(page.locator('[data-volunteer-division]')).toHaveCount(7);
  await expect(page.locator('[data-volunteer-opening]')).toHaveCount(3);
  await expect(page.locator('[data-opening-application]')).toHaveCount(3);
  await expect(page.locator('[data-opening-apply]')).toHaveCount(3);
  await expect(page.locator('[data-volunteer-person]')).toHaveCount(4);
  await expect(page.locator('[data-volunteer-person][data-visibility="opt-in-profile"]')).toHaveCount(1);
  await expect(page.locator('[data-volunteer-person][data-visibility="anonymous-stub"]')).toHaveCount(3);
  await expect(page.getByText('Nara (fiktif)', { exact: true })).toBeVisible();

  await page.goto('/volunteer/nara/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-volunteer-profile][data-visibility="opt-in-profile"]')).toBeVisible();
  await expect(page.locator('[data-contribution-group][data-contribution-program]')).toHaveCount(1);
  await expect(page.locator('[data-contribution-group] [data-contribution-entry]')).toHaveCount(1);
  await expect(page.locator('[data-volunteer-assignment][data-assignment-state="current"]')).toHaveCount(1);
  await expect(page.locator('[data-volunteer-assignment][data-assignment-state="historical"]')).toHaveCount(1);
  await expect(page.locator('[data-volunteer-assignment][data-assignment-source="simulated-fixture"]')).toContainText(/simulasi/i);
});

test('impact and credits show qualified demo records', async ({ page }) => {
  await page.goto('/community/impact/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.kad-metric-card[data-fixture-id]')).toHaveCount(3);
  await expect(page.locator('.kad-demo-banner summary')).toHaveText('Pratinjau · data contoh');

  await page.goto('/community/credits/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-fixture-id^="demo-contribution-"]')).toHaveCount(3);
  await expect(page.locator('[data-fixture-id^="demo-consent-"]')).toHaveCount(3);
  await expect(page.locator('[data-consent-status="granted-for-demo"]')).toHaveCount(1);
  await expect(page.locator('[data-consent-status="anonymous-by-choice"]')).toHaveCount(1);
  await expect(page.locator('[data-consent-status="revoked-demo"]')).toHaveCount(1);
  await expect(page.locator('[data-fixture-id="demo-consent-anonymous-01"]').getByRole('heading', { name: 'Relawan Anonim 1' })).toBeVisible();
});

test('story cards expose evidence metadata and a real next action', async ({ page }) => {
  await page.goto('/stories/', { waitUntil: 'domcontentloaded' });
  const story = page.locator('[data-fixture-id^="demo-record-story-"]').first();
  await expect(story).toBeVisible();
  await expect(story.locator('p')).toHaveCount(1);
  await expect(story.locator('time, [data-story-date], [data-record-date], [data-published-at]')).toHaveCount(1);
  const action = story.locator('a[href], button');
  expect(await action.count(), 'story should expose a source, read link, or honest next action').toBeGreaterThanOrEqual(1);
  const actionHrefs = await action.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')));
  expect(actionHrefs.every((href) => href === null || !/^#?$/.test(href))).toBe(true);
  expect(await story.innerText()).not.toMatch(/^Data simulasi$|^Demo data$/im);
});

test('impact metrics expose method, source, and update metadata', async ({ page }) => {
  await page.goto('/community/impact/', { waitUntil: 'domcontentloaded' });
  const metric = page.locator('.kad-metric-card').first();
  await expect(metric).toBeVisible();
  const metadata = metric.locator('[data-metric-method], [data-method], [data-metric-source], [data-source], [data-metric-updated], [data-updated-at], dt');
  expect(await metadata.count(), 'metric should expose method, source, and update metadata').toBeGreaterThanOrEqual(3);
  const metricText = await metric.innerText();
  expect(metricText).toMatch(/metode|method/i);
  expect(metricText).toMatch(/sumber|source/i);
  expect(metricText).toMatch(/diperbarui|updated|update/i);
});

test('revoked attribution exposes neither the withdrawn subject nor scope', async ({ page }) => {
  await page.goto('/community/credits/', { waitUntil: 'domcontentloaded' });
  const revoked = page.locator('[data-consent-status="revoked-demo"]');
  await expect(revoked).toHaveCount(1);
  await expect(revoked.locator('h3, p')).toHaveCount(0);
  const revokedText = await revoked.innerText();
  expect(revokedText).not.toMatch(/identitas demo ditarik|withdrawn demo identity|tidak boleh ditampilkan|must not be displayed/i);
});

test('English and fallback locale surfaces do not mix Indonesian fixture copy', async ({ page }) => {
  await page.goto('/en/events/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.kad-demo-banner summary')).toHaveText('Preview · sample data');
  await expect(page.getByRole('heading', { name: 'Agenda', exact: true, level: 1 })).toBeVisible();
  await expect(page.getByText('Data simulasi', { exact: true })).toHaveCount(0);

  await page.goto('/ja/volunteer/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');
  await expect(page.getByText('This community surface is available in English while a full translation is prepared.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How the work is organized.' })).toBeVisible();

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
