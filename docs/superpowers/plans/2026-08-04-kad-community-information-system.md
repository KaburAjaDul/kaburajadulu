# KAD Community Information System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver an evidence-safe, fixture-backed redesign of Community, Programs, Agenda, Volunteer, volunteer profile, and Stories, then publish the verified result to the isolated Cloudflare staging Worker.

**Architecture:** Keep Astro static and preserve existing routes. Extend the checked TypeScript content model with optional Series, Agenda records, volunteer organization data, and one shared Contribution Ledger; split the universal Community page into page-family components. Production renders verified public records or Evidence Placeholders, while `PUBLIC_STAGING_FIXTURES=true` renders deterministic `noindex` examples that match the future KAD-Agent public projection.

**Tech Stack:** Astro 7, TypeScript, Bun, Playwright, Cloudflare Workers/Wrangler, existing Interface IR/runtime validators.

---

## File responsibilities

- `CONTEXT.md`: domain glossary only.
- `docs/adr/0001-0003*.md`: accepted hard-to-reverse privacy and integration decisions.
- `src/content/staging-fixtures.ts`: deterministic staging-only domain fixtures and selectors.
- `src/content/public-content.ts`: production-safe public envelopes and repository contracts.
- `src/components/community-system/CommunityPage.astro`: route-family dispatcher and shared layout shell only.
- `src/components/community-system/CommunityOverviewPage.astro`: Community information order.
- `src/components/community-system/AgendaPage.astro`: Agenda index and detail presentation.
- `src/components/community-system/VolunteerDirectoryPage.astro`: Cycle, governance, Divisions, openings, and people directory.
- `src/components/community-system/VolunteerDetailPage.astro`: responsibility and Program-grouped Contributor Ledger View.
- `src/components/community-system/StoriesPage.astro`: documentation index/detail presentation.
- `src/components/programs/ProgramsPage.astro`: Program directory.
- `src/components/programs/ProgramDetailPage.astro`: optional Series, Sessions, metrics, contributors, and evidence.
- `src/pages/volunteer/[slug].astro` and `src/pages/[lang]/volunteer/[slug].astro`: static profile routes generated only for publishable records.
- `src/styles/community-information.css`: page-family styles; `global.css` remains shared tokens/layout.
- `tests/unit/community-domain.test.ts`: fixture selectors, Agenda union, ledger grouping, and privacy projection.
- `tests/e2e/community-design.spec.ts`: production-safe content, routes, semantics, responsive behavior, and no leakage.
- `tests/e2e/staging-fixtures.spec.ts`: staging examples, hierarchy, states, profile details, and `noindex` boundary.
- `scripts/validate-interface-runtime.mjs`: IR-to-runtime route, count, label, and privacy checks.
- `docs/interface/kad-community-interface.ir.json`: platform-neutral component/state contract.
- `docs/interface/full-page-hierarchy-review.json`: final rendered hierarchy evidence.
- `docs/interface/page-system.md`: route content and state policy.

### Task 1: Freeze the domain and page contract

**Files:**
- Modify: `CONTEXT.md`
- Create: `docs/adr/0001-shared-contribution-ledger-with-opt-in-public-identity.md`
- Create: `docs/adr/0002-owner-controlled-contribution-verification-links.md`
- Create: `docs/adr/0003-project-discord-events-through-kad-agent.md`
- Create: `docs/superpowers/specs/2026-08-04-kad-community-information-system-design.md`
- Create: `docs/superpowers/plans/2026-08-04-kad-community-information-system.md`

- [ ] **Step 1: Scan the written design for placeholders and contradictions**

Run:

```bash
rg -n 'TB[D]|TO[D]O|FIXM[E]|to be decide[d]' CONTEXT.md docs/adr docs/superpowers
git diff --check
```

Expected: no unresolved markers and exit 0 from `git diff --check`.

- [ ] **Step 2: Confirm the five non-negotiable terms**

Run:

```bash
rg -n '^\*\*(Program|Series|Agenda|Contribution Ledger|Public Contributor Stub)\*\*' CONTEXT.md
```

Expected: exactly five matching glossary entries.

- [ ] **Step 3: Commit the approved design record**

```bash
git add CONTEXT.md docs/adr docs/superpowers/specs docs/superpowers/plans
git commit -m "docs(web): define KAD community information model"
```

### Task 2: Add the staging domain model with TDD

**Files:**
- Modify: `src/content/staging-fixtures.ts`
- Modify: `src/content/public-content.ts`
- Create: `tests/unit/community-domain.test.ts`

- [ ] **Step 1: Write failing domain tests**

The tests must import staging selectors and assert:

```ts
expect(STAGING_PROGRAMS.find((item) => item.slug === 'japanese-study-club')?.series).toHaveLength(3);
expect(STAGING_PROGRAMS.find((item) => item.slug === 'english-study-club')?.series).toHaveLength(0);
expect(listStagingAgenda().some((item) => item.kind === 'session')).toBe(true);
expect(listStagingAgenda().some((item) => item.kind === 'event')).toBe(true);
expect(STAGING_DIVISIONS).toHaveLength(7);
expect(groupContributionsByProgram('demo-volunteer-nara-01').size).toBeGreaterThan(0);
expect(publicContributorProjection('demo-volunteer-anonymous-01')).not.toHaveProperty('privateIdentity');
```

- [ ] **Step 2: Run the tests and verify RED**

```bash
bun test tests/unit/community-domain.test.ts
```

Expected: FAIL because the new exports/selectors do not exist.

- [ ] **Step 3: Implement the minimal domain fields and selectors**

Add typed records for:

```ts
type ProgramSeries = { id: string; programId: string; title: LocalizedText; summary: LocalizedText; level: string | null };
type Division = { id: string; name: LocalizedText; purpose: LocalizedText };
type VolunteerPosition = 'advisor' | 'community-manager' | 'division-lead' | 'individual-volunteer';
type VolunteerAssignment = { volunteerId: string; cycleId: string; divisionIds: readonly string[]; position: VolunteerPosition; responsibilities: readonly LocalizedText[] };
type ContributorVisibility = 'anonymous-stub' | 'opt-in-profile';
```

Create fixture exports for Programs, Series, Sessions, standalone Events,
Cycle, seven Divisions, openings, profiles/stubs, assignments, Contributions,
and Program metrics. Every record must keep `source: 'staging-seed'`,
`demo: true`, stable ID, revision, and explicit state.

- [ ] **Step 4: Run domain tests and the existing unit suite**

```bash
bun test tests/unit/community-domain.test.ts
bun run test:unit
```

Expected: all tests pass.

### Task 3: Redesign Programs around Program → optional Series → Session

**Files:**
- Modify: `src/components/programs/ProgramsPage.astro`
- Modify: `src/components/programs/ProgramDetailPage.astro`
- Modify: `tests/e2e/community-design.spec.ts`
- Modify: `tests/e2e/staging-fixtures.spec.ts`

- [ ] **Step 1: Add failing browser assertions**

Production assertions:

```ts
await expect(page.locator('[data-page-family="programs"]')).toBeVisible();
await expect(page.locator('[data-program-record]')).toHaveCount(5);
await expect(page.locator('[data-evidence-placeholder]')).toBeVisible();
```

Staging assertions:

```ts
await expect(page.locator('[data-program-record]')).toHaveCount(5);
await expect(page.locator('[data-program-series="japanese-n5"]')).toBeVisible();
await expect(page.locator('[data-program-series="japanese-n4-n3"]')).toBeVisible();
await expect(page.locator('[data-program-series="japanese-n2-n1"]')).toBeVisible();
await expect(page.locator('[data-program-metric]')).toHaveCount(4);
```

- [ ] **Step 2: Run the focused suites and verify RED**

```bash
bun run test:e2e:community --grep "Program|Series"
bun run test:e2e:staging --grep "Program|Series"
```

Expected: failures for missing Series, Program metric, and placeholder markers.

- [ ] **Step 3: Implement the Program directory and detail hierarchy**

Render directory rows with purpose, structure, status, and next Session. On
detail, order content as purpose → Series/Session → Program metrics →
contributors → documentation/provenance. Use direct Program Sessions when no
Series exists. Never render a repository for Tech/Coding Club unless an
artifact URL exists.

- [ ] **Step 4: Verify GREEN**

Run the two focused commands from Step 2. Expected: all focused tests pass.

### Task 4: Turn Events into an information-first Agenda

**Files:**
- Create: `src/components/community-system/AgendaPage.astro`
- Modify: `src/components/community-system/CommunityPage.astro`
- Modify: `tests/e2e/community-design.spec.ts`
- Modify: `tests/e2e/staging-fixtures.spec.ts`

- [ ] **Step 1: Write failing Agenda assertions**

```ts
await expect(page.getByRole('heading', { name: 'Agenda' })).toBeVisible();
await expect(page.locator('[data-agenda-state="empty"]')).toBeVisible();
await expect(page.getByText(/Pulse|Denyut komunitas/)).toHaveCount(0);
```

Staging:

```ts
await expect(page.locator('[data-agenda-kind="session"]')).toHaveCount(3);
await expect(page.locator('[data-agenda-kind="event"]')).toHaveCount(1);
await expect(page.locator('[data-discord-join-path]')).toHaveCount(4);
```

- [ ] **Step 2: Verify RED**

```bash
bun run test:e2e:community --grep "Agenda"
bun run test:e2e:staging --grep "Agenda"
```

- [ ] **Step 3: Implement Agenda index/detail states**

Keep `/events`; render the public label `Agenda`. Group by date, expose textual
status, Program/Series relationship, timezone, revision, and safe detail/join
action. Production uses `data-evidence-placeholder`; staging includes Sessions
and one standalone Event.

- [ ] **Step 4: Verify GREEN**

Run Step 2 commands. Expected: all focused tests pass.

### Task 5: Build Volunteer organization and profile ledger

**Files:**
- Create: `src/components/community-system/VolunteerDirectoryPage.astro`
- Create: `src/components/community-system/VolunteerDetailPage.astro`
- Create: `src/pages/volunteer/[slug].astro`
- Create: `src/pages/[lang]/volunteer/[slug].astro`
- Modify: `src/components/community-system/CommunityPage.astro`
- Modify: `tests/e2e/community-design.spec.ts`
- Modify: `tests/e2e/staging-fixtures.spec.ts`

- [ ] **Step 1: Write failing Volunteer assertions**

```ts
await expect(page.locator('[data-volunteer-cycle]')).toContainText('3 bulan');
await expect(page.locator('[data-volunteer-position]')).toHaveCount(4);
await expect(page.locator('[data-volunteer-division]')).toHaveCount(7);
await expect(page.locator('[data-volunteer-opening]')).toHaveCount(3);
```

Profile:

```ts
await page.goto('/volunteer/nara-demo/');
await expect(page.locator('[data-contribution-group]')).toHaveCount(2);
await expect(page.locator('[data-personal-impact-score]')).toHaveCount(0);
await expect(page.getByText(/verification link/i)).toContainText(/pemilik|owner/i);
```

- [ ] **Step 2: Verify RED**

```bash
bun run test:e2e:community --grep "Volunteer"
bun run test:e2e:staging --grep "Volunteer|ledger"
```

- [ ] **Step 3: Implement index and detail**

Render Cycle, four Positions, seven Divisions, continuous intake/openings, and
faculty-like people records. Named profiles are opt-in fixtures; anonymous stubs
contain only safe aggregate counts. Profile detail groups Contributions by
Program, labels review state and responsibility, and describes future owner-only
verification without generating a token or interactive secret flow.

- [ ] **Step 4: Verify GREEN**

Run Step 2 commands. Expected: all focused tests pass.

### Task 6: Recompose Community and Stories

**Files:**
- Create: `src/components/community-system/CommunityOverviewPage.astro`
- Create: `src/components/community-system/StoriesPage.astro`
- Modify: `src/components/community-system/CommunityPage.astro`
- Create: `src/styles/community-information.css`
- Modify: `tests/e2e/community-design.spec.ts`
- Modify: `tests/e2e/staging-fixtures.spec.ts`

- [ ] **Step 1: Add failing order and copy tests**

```ts
expect(await page.locator('[data-community-section]').evaluateAll((nodes) =>
  nodes.map((node) => node.getAttribute('data-community-section'))
)).toEqual(['current', 'programs', 'agenda', 'people', 'sources']);
await expect(page.getByRole('heading', { name: 'KAD saat ini' })).toBeVisible();
await expect(page.getByText(/Pulse|Denyut komunitas/)).toHaveCount(0);
```

Stories assertions verify related Program, documentation state, and no ledger
or Agenda duplication.

- [ ] **Step 2: Verify RED**

```bash
bun run test:e2e:community --grep "KAD saat ini|Stories"
bun run test:e2e:staging --grep "KAD saat ini|Stories"
```

- [ ] **Step 3: Implement the page-family components and responsive CSS**

Keep compact inner headers, flat ledgers, textual status, and one task per page.
At 390px recompose two-column facts into one column without changing DOM order.
At 1280px keep measure and density scannable. Do not add generic assistant notes,
large inner heroes, or repeated card grids.

- [ ] **Step 4: Verify GREEN**

Run Step 2 commands. Expected: all focused tests pass.

### Task 7: Update interface contracts and runtime guards

**Files:**
- Modify: `docs/interface/full-page-evidence-deconstruction.md`
- Modify: `docs/interface/kad-community-interface.ir.json`
- Modify: `docs/interface/page-system.md`
- Modify: `docs/interface/full-page-hierarchy-review.json`
- Modify: `scripts/validate-interface-runtime.mjs`

- [ ] **Step 1: Update IR content order and component contracts**

Set Community order to `current`, `programs`, `agenda`, `people`, `sources`.
Declare Program Series, Agenda union, four Positions, seven Divisions, profile
ledger, Evidence Placeholder, and staging counts. Keep every claim provenance
status explicit.

- [ ] **Step 2: Validate IR before runtime edits**

```bash
python3 /Users/hamardikan-mac/.codex/skills/engineer-interfaces/scripts/validate_interface.py docs/interface/kad-community-interface.ir.json
```

Expected: `VALID`.

- [ ] **Step 3: Extend the runtime validator**

Check built HTML for the exact order, labels, Series count, Agenda kind count,
Position/Division counts, profile route, Program-grouped ledger, production
placeholder, staging `noindex`, and forbidden private/fixture fields.

- [ ] **Step 4: Validate production and staging builds**

```bash
bun run build
bun run validate:interface-runtime
PUBLIC_STAGING_FIXTURES=true bun run build
PUBLIC_STAGING_FIXTURES=true bun run validate:interface-runtime
```

Expected: `INTERFACE_RUNTIME_PASS` for both modes.

### Task 8: Rendered hierarchy review and complete verification

**Files:**
- Modify: `docs/interface/full-page-hierarchy-review.json`
- Test artifacts only: `test-results/hierarchy-review/*`

- [ ] **Step 1: Run static and unit gates**

```bash
bun run check
bun run test:unit
git diff --check
```

Expected: 0 Astro errors/warnings, all unit tests pass, diff check exit 0.

- [ ] **Step 2: Run full production and staging Playwright**

```bash
bun run test:e2e
bun run test:e2e:staging
```

Expected: 0 failed tests in both configurations.

- [ ] **Step 3: Capture and inspect hierarchy scenarios**

Capture `/community`, `/programs`, one Program detail, `/events`, `/volunteer`,
one Volunteer detail, and `/stories` at 1280x720 and 390x844. Check heading/DOM
order, keyboard focus, visible actions, 200% zoom, reduced motion, light/dark,
overflow, clipping, and customer-facing copy. Record observed artifacts and any
P0-P3 findings in the hierarchy report.

- [ ] **Step 4: Validate the hierarchy report**

```bash
python3 /Users/hamardikan-mac/.codex/skills/interface-hierarchy-review/scripts/validate_review.py docs/interface/full-page-hierarchy-review.json
```

Expected: `VALID` and no unresolved P0-P2 finding.

### Task 9: Review, publish, and verify staging

**Files:** all intentional files from Tasks 2-8.

- [ ] **Step 1: Run an independent reviewer pass**

Reviewer checks spec coverage, privacy boundaries, responsive hierarchy,
production/staging separation, and regression risk. Resolve every P0-P2 finding
before publishing.

- [ ] **Step 2: Commit and push**

```bash
git add src tests scripts docs/interface
git commit -m "feat(web): model KAD programs agenda and volunteer work"
git push origin codex/kad-public-content-pr0
```

- [ ] **Step 3: Deploy the isolated staging Worker**

```bash
PUBLIC_STAGING_FIXTURES=true bun run build
PUBLIC_STAGING_FIXTURES=true bun run validate:interface-runtime
bun run deploy:staging
```

Expected: Wrangler prints the `kaburajadulu-staging` Worker URL and version ID.

- [ ] **Step 4: Smoke-test the live Worker**

Fetch the seven representative routes and assert HTTP 200, `noindex`, fixture
disclosure, Community order, Program Series, Agenda kinds, Volunteer counts,
profile ledger groups, and no private identifiers.

- [ ] **Step 5: Check GitHub CI for the exact pushed SHA**

```bash
gh run list --branch codex/kad-public-content-pr0 --limit 6 --json workflowName,status,conclusion,headSha,url
```

Expected: CI completes successfully. If the GitHub Staging workflow lacks
Cloudflare secrets, report that separately from the verified local deployment.
