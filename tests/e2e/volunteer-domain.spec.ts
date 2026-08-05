import { expect, test } from '@playwright/test';

const stagingRun = process.env.PUBLIC_STAGING_FIXTURES === 'true';
const stagingBase = process.env.KAD_STAGING_URL ?? '';

test.describe('volunteer directory contract', () => {
  test('production keeps the roster private until evidence and consent exist', async ({ page }) => {
    await page.goto('/volunteer/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-page-family="volunteer"]')).toBeVisible();
    await expect(page.locator('[data-volunteer-state="evidence-placeholder"]')).toBeVisible();
    await expect(page.locator('[data-volunteer-person]')).toHaveCount(0);
    await expect(page.getByText(/opt-in|izin/i).first()).toBeVisible();
    await expect(page.locator('main')).not.toContainText(/Nara|Bima|Sari|demo-volunteer|fiktif|fictional/i);
  });

  test('production does not expose a fixture profile route', async ({ page }) => {
    const response = await page.goto('/volunteer/nara-fiktif/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(404);
  });

  test('staging exposes the cycle structure, four positions, seven divisions, and three openings', async ({ page }) => {
    test.skip(!stagingRun, 'staging contract runs against the fixture build');
    await page.goto(`${stagingBase}/volunteer/`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-fixtures="enabled"]')).toBeVisible();
    await expect(page.locator('[data-volunteer-cycle]')).toContainText(/Siklus relawan 03|Volunteer Cycle 03/i);
    await expect(page.locator('[data-volunteer-position]')).toHaveCount(4);
    await expect(page.locator('[data-volunteer-position="advisor"]')).toContainText(/non.?executive|non.?eksekutif/i);
    await expect(page.locator('[data-volunteer-position="community-manager"]')).toContainText(/executive head|kepala eksekutif/i);
    await expect(page.locator('[data-volunteer-position="division-lead"]')).toBeVisible();
    await expect(page.locator('[data-volunteer-position="individual-volunteer"]')).toBeVisible();
    await expect(page.locator('[data-volunteer-division]')).toHaveCount(7);
    await expect(page.locator('[data-volunteer-opening]')).toHaveCount(3);
    await expect(page.locator('[data-opening-application]')).toHaveCount(3);
    await expect(page.locator('[data-opening-apply]')).toHaveCount(3);
    await expect(page.locator('[data-volunteer-person]')).toHaveCount(4);
    await expect(page.locator('[data-volunteer-person][data-visibility="opt-in-profile"]')).toHaveCount(1);
    await expect(page.locator('[data-volunteer-person][data-visibility="anonymous-stub"]')).toHaveCount(3);
    const anonymousSlugs = await page.locator('[data-volunteer-person][data-visibility="anonymous-stub"]').evaluateAll((links) => links.map((link) => new URL((link as HTMLAnchorElement).href).pathname));
    expect(new Set(anonymousSlugs).size).toBe(anonymousSlugs.length);
  });

  test('staging profile groups contribution ledger by program without personal impact scoring', async ({ page }) => {
    test.skip(!stagingRun, 'staging contract runs against the fixture build');
    await page.goto(`${stagingBase}/volunteer/nara/`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-volunteer-profile]')).toBeVisible();
    await expect(page.locator('[data-contribution-group][data-contribution-program]')).toHaveCount(1);
    await expect(page.locator('[data-contribution-group] [data-contribution-entry]')).toHaveCount(1);
    await expect(page.locator('[data-contribution-responsibility]')).toBeVisible();
    await expect(page.locator('[data-contribution-evidence]')).toBeVisible();
    await expect(page.locator('[data-contribution-review]')).toContainText(/verified|terverifikasi/i);
    await expect(page.locator('[data-impact-score]')).toHaveCount(0);
    await expect(page.locator('[data-verification-future]')).toContainText(/future|nanti|mendatang/i);
    await expect(page.locator('[data-volunteer-assignment][data-assignment-state="current"]')).toHaveCount(1);
    await expect(page.locator('[data-volunteer-assignment][data-assignment-state="historical"]')).toHaveCount(1);
    await expect(page.locator('[data-volunteer-assignment][data-assignment-source="simulated-fixture"]')).toContainText(/simulated|simulasi/i);
  });

  test('staging anonymous contributor profile preserves the identity boundary', async ({ page }) => {
    test.skip(!stagingRun, 'staging contract runs against the fixture build');
    await page.goto(`${stagingBase}/volunteer/`, { waitUntil: 'domcontentloaded' });
    const anonymousProfilePath = await page.locator('[data-volunteer-person][data-visibility="anonymous-stub"]').first().getAttribute('href');
    expect(anonymousProfilePath).toBeTruthy();
    await page.goto(`${stagingBase}${anonymousProfilePath}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-volunteer-profile][data-visibility="anonymous-stub"]')).toBeVisible();
    await expect(page.locator('[data-public-display-name]')).toContainText(/anonymous contributor|kontributor anonim/i);
    await expect(page.locator('[data-public-identity]')).toContainText(/not shared|tidak ditampilkan/i);
    expect(await page.locator('[data-contribution-group][data-contribution-program]').count()).toBeGreaterThan(0);
    await expect(page.locator('main')).not.toContainText(/Nara|Bima|Sari|demo-volunteer/i);
  });
});
