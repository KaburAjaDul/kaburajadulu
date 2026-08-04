import { expect, test, type Page } from '@playwright/test';

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}

test('staging is noindex and visibly labels fictional data', async ({ page }) => {
  await page.goto('/events/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('[data-fixture-id="demo-preview-fixture-kad-2026"]')).toBeVisible();
  await expect(page.locator('.kad-demo-banner summary')).toHaveText('Pratinjau · data contoh');
});

test('staging uses one compact page-level preview disclosure', async ({ page }) => {
  for (const viewport of [
    { width: 1280, height: 720, maxNoticeHeight: 48 },
    { width: 390, height: 844, maxNoticeHeight: 64 },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const route of ['/community/', '/events/', '/events/demo-event-mandarin-transport-01/', '/programs/', '/programs/english-mandarin-weekly-clubs/', '/volunteer/', '/stories/', '/stories/catatan-belajar-satu-siklus/', '/about/history/', '/community/impact/', '/community/credits/', '/support/']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const notices = page.locator('.kad-demo-banner:visible');
      await expect(notices, `${route} should expose one visible preview notice`).toHaveCount(1);
      const box = await notices.boundingBox();
      expect(box, `${route} preview notice should have a measurable box`).not.toBeNull();
      expect(box?.height ?? Number.POSITIVE_INFINITY, `${route} preview notice should stay compact at ${viewport.width}px`).toBeLessThanOrEqual(viewport.maxNoticeHeight);
      await expect(notices.locator('details')).toHaveCount(1);
    }
  }
});

test('event schedule derives upcoming and completed states from the scenario clock', async ({ page }) => {
  await page.goto('/events/', { waitUntil: 'domcontentloaded' });
  const cards = page.locator('.kad-event-card[data-fixture-id]');
  await expect(cards).toHaveCount(3);
  expect((await cards.evaluateAll((items) => items.map((item) => item.getAttribute('data-fixture-state')))).sort()).toEqual(['completed', 'completed', 'upcoming']);

  const detailLink = cards.filter({ hasText: 'Mandarin Study Club' }).locator('h2 a');
  await detailLink.click();
  await expect(page.locator('[data-fixture-id="demo-event-mandarin-transport-01"]')).toBeVisible();

  await page.goto('/events/not-published/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-state-panel="not-published"]')).toBeVisible();
});

test('event lifecycle follows the Aug 4 scenario clock and detail stays customer-facing', async ({ page }) => {
  await page.goto('/events/', { waitUntil: 'domcontentloaded' });
  const completedCard = page.locator('.kad-event-card').filter({ hasText: 'Mandarin Study Club' });
  await expect(completedCard).toHaveCount(1);
  await expect(completedCard).toHaveAttribute('data-fixture-state', 'completed');
  await expect(completedCard.locator('[data-status="completed"]')).toBeVisible();

  await completedCard.locator('h2 a').click();
  const detail = page.locator('.kad-record-intro, .kad-record-actions');
  await expect(page.locator('.kad-record-intro')).toBeVisible();
  await expect(page.locator('.kad-record-actions')).toBeVisible();
  const detailText = await detail.allInnerTexts().then((parts) => parts.join('\n'));
  expect(detailText).not.toMatch(/demo-(?:event|session)-[a-z0-9-]+|fixture\s*id|deterministic|developer|staging seed/i);
  await expect(page.locator('.kad-record-facts dt')).toHaveText(['Waktu', 'Durasi', 'Format', 'Program']);
  await expect(page.locator('.kad-record-facts')).toContainText(/3 Agustus 2026|August 3, 2026/i);
  await expect(page.locator('.kad-record-facts')).toContainText(/75\s*menit|75\s*minutes/i);
  await expect(page.locator('.kad-record-facts')).toContainText(/daring|online/i);
  await expect(page.locator('.kad-record-facts a[href*="/programs/"]')).toHaveCount(1);
  await expect(page.locator('.kad-record-actions a[href*="discord"]')).toHaveCount(1);
  await expect(page.locator('.kad-record-actions a[href$="/events"], .kad-record-actions a[href$="/events/"]')).toHaveCount(1);
});

test('programs keep the catalogue focused instead of adding a staging assistant module', async ({ page }) => {
  await page.goto('/programs/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-page-family="programs"]')).toBeVisible();
  await expect(page.locator('.kad-session-preview')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Lihat cara modul jadwal berikutnya bekerja.' })).toHaveCount(0);
});

test('volunteer staging shows fictional structure and opt-in profiles', async ({ page }) => {
  await page.goto('/volunteer/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-fixture-id^="demo-team-"]')).toHaveCount(3);
  await expect(page.locator('.kad-volunteer-card[data-fixture-id]')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Pekerjaan dikelompokkan berdasarkan hasil yang didukung.' })).toBeVisible();
  await expect(page.getByText('Nara (fiktif)', { exact: true })).toBeVisible();
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
  await expect(page.getByRole('heading', { name: 'Community events' })).toBeVisible();
  await expect(page.getByText('Data simulasi', { exact: true })).toHaveCount(0);

  await page.goto('/ja/volunteer/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');
  await expect(page.getByText('This community surface is available in English while a full translation is prepared.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Public credit is optional.' })).toBeVisible();

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
