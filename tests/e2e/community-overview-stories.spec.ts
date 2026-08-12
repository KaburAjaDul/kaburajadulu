import { expect, test } from '@playwright/test';

const stagingRun = process.env.KAD_E2E_STAGING === 'true';

test.describe('community information architecture', () => {
  test('community uses the five information-first sections in order', async ({ page }) => {
    await page.goto('/community/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-page-header="orientation"]')).toHaveCount(1);
    await expect(page.locator('[data-community-section]').first()).toHaveAttribute('data-community-section', 'current');
    await expect(page.locator('[data-community-section] h2').first()).toHaveText('Berikutnya di KAD');
    await expect(page.locator('[data-community-section]')).toHaveCount(5);
    const sections = await page.locator('[data-community-section]').evaluateAll((items) => items.map((section) => section.getAttribute('data-community-section')));
    expect(sections).toEqual(['current', 'programs', 'agenda', 'people', 'sources']);
    await expect(page.locator('body')).not.toContainText(/Pulse|Denyut/);
  });

  test('English community headings stay in English', async ({ page }) => {
    await page.goto('/en/community/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-community-section="current"] h2').first()).toHaveText('What happens next');
    await expect(page.locator('[data-community-section="current"]')).not.toContainText('saat ini');
  });

  test('production uses evidence placeholders for unpublished community facts', async ({ page }) => {
    test.skip(stagingRun, 'production-only assertion');
    await page.goto('/community/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-community-section="current"] [data-community-metric]')).toHaveCount(3);
    await expect(page.locator('[data-community-section="current"] .kad-community-information__metric-value')).toHaveText(['—', '—', '—']);
    await expect(page.locator('[data-community-section="people"] [data-attribution]')).toHaveCount(0);
    await expect(page.locator('[data-community-section="agenda"] [data-agenda-state="empty"]')).toHaveCount(1);
  });

  test('stories explain their role as documentation', async ({ page }) => {
    await page.goto('/stories/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-page-header="story-index"]')).toHaveCount(1);
    await expect(page.locator('body')).toContainText(/documentation|dokumentasi/i);
    await expect(page.locator('body')).not.toContainText(/Pulse|Denyut/);
  });
});

test.describe('staging community information', () => {
  test.skip(!stagingRun, 'run with KAD_E2E_STAGING=true against the staging preview');

  test('staging exposes qualified metrics and compact program, agenda, and people previews', async ({ page }) => {
    await page.goto('/community/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-community-section="current"] [data-community-metric]')).toHaveCount(3);
    await expect(page.locator('[data-community-section="current"] .kad-community-information__metric-detail')).toHaveCount(3);
    await expect(page.locator('[data-community-section="current"] .kad-community-information__metric-detail')).toContainText(['Metode', 'Ditinjau']);
    await expect(page.locator('[data-community-section="programs"] [data-program-record]')).toHaveCount(3);
    await expect(page.locator('[data-community-section="agenda"] [data-agenda-kind]')).toHaveCount(1);
    await expect(page.locator('[data-community-section="agenda"] [data-discord-join-path]')).toHaveCount(0);
    await expect(page.locator('[data-community-section="people"] [data-attribution="opt-in-demo"]')).toHaveCount(1);
    await expect(page.locator('[data-community-section="people"] [data-attribution="anonymous-stub"]')).toHaveCount(2);
    await expect(page.locator('[data-community-section="people"] [data-attribution="opt-in-demo"] h3')).toHaveText('Nara (fiktif)');
    await expect(page.locator('body')).toContainText(/fiktif|fictional/i);
  });

  test('staging story links documentation to available records', async ({ page }) => {
    await page.goto('/stories/', { waitUntil: 'domcontentloaded' });
    const story = page.locator('[data-story-surface="index"] [data-fixture-id]').first();
    await expect(story).toBeVisible();
    await expect(story.locator('.kad-story-information__reference')).toHaveCount(3);
    await story.locator('h3 a').click();
    await expect(page.locator('[data-story-surface="detail"]')).toBeVisible();
    await expect(page.locator('.kad-story-information__detail .kad-story-information__reference')).toHaveCount(3);
  });
});
