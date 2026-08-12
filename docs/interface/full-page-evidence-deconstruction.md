# KAD full-page evidence deconstruction

This is the evidence ledger for the current information-system slice. It keeps
observations, inferences, and unknowns separate so a future Discord/KAD-Agent
projection can replace fixtures without changing the page jobs.

## Evidence table

| Evidence | Status | Observation | Transferable rule | Implementation boundary |
| --- | --- | --- | --- | --- |
| `docs/superpowers/specs/2026-08-04-kad-community-information-system-design.md` | observed | The approved model is Program → optional Series → Session; Agenda combines Sessions and standalone Events; volunteer work is represented by a consent-led Contribution Ledger. | Name the domain relationship before choosing a card or route. | The Astro content adapter must expose these relationships directly. |
| `src/components/community-system/CommunityOverviewPage.astro` | observed | Community renders five ordered regions: current, programs, agenda, people, sources. | Orientation is useful when it is ordered around decisions, not a second catalogue. | Runtime checks must compare `data-community-section` sequence, not just heading copy. |
| `src/components/programs/ProgramsPage.astro` and `ProgramDetailPage.astro` | observed | Program directory and detail surfaces expose structure, status, Series/Sessions, metrics, contributors, and evidence. | Catalogue rows answer “what is this?”; detail answers “how does it work?” | Do not fabricate a repository or replace optional Series with a forced card. |
| `src/components/community-system/AgendaPage.astro` | observed | Agenda rows expose kind, lifecycle, date/time, timezone, revision/freshness, detail link, and safe Discord action. | Scheduled information needs an explicit time/status/join path trio. | `/events` remains the compatibility route while the public label is Agenda. |
| `src/components/community-system/VolunteerDirectoryPage.astro` | observed | The index exposes Cycle, four Positions, seven Divisions, openings, people, and consent boundary. | Organization structure precedes people names and avoids a leaderboard. | Staging selectors prove counts; production may render a policy placeholder. |
| `src/components/community-system/VolunteerDetailPage.astro` | observed | A profile shows visibility, assignments, Program-grouped contributions, responsibility, evidence, review state, and future verification copy. | Individual pages show attributed work, not Program-wide success. | No identity claim or secret verification token enters public output without opt-in/owner action. |
| `src/components/community-system/StoriesPage.astro` | observed | Stories carry a body, date, publication state, and related record links. | Documentation adds context but does not replace live Agenda or the ledger. | Story links must remain ordinary anchors and production-safe. |
| `src/content/staging-fixtures.ts` | observed | Staging is deterministic, marked `demo: true`, and selected only when `PUBLIC_STAGING_FIXTURES=true`. | Fictional records can exercise hierarchy when their boundary is obvious. | Every generated staging page is noindex; selectors must never be emitted in production. |
| `src/content/public-content.ts` | observed | Production DTOs retain source, revision, freshness, review, and media safety fields. | Unknown publication state is data, not a missing UI detail. | Render Evidence Placeholder/pending/empty states instead of invented facts. |
| `docs/adr/0003-project-discord-events-through-kad-agent.md` | observed | The live Agenda slice follows private authority → allow-listed signed projection → D1 public read model; the website does not scrape Discord. | Integrations preserve a public contract and an explicit authority boundary. | This release projects only approved schedule fields; identity, contributions, private media, and R2 remain out of scope. |
| `tests/e2e/community-design.spec.ts` and `tests/e2e/staging-fixtures.spec.ts` | observed | Browser gates exercise route semantics, responsive states, localization, and fixture leakage. | Static output checks must be paired with real browser interaction. | Runtime guard reports build-level mismatches; Playwright remains the behavior gate. |
| Prior Field Notes visual reference | inferred | The landing page can use a stronger visual treatment, but inner routes need density and information first. | Reserve visual drama for orientation; use compact task headers for records. | Inner-page contracts cap heading size and forbid universal hero fragments. |
| Private Discord channels and screenshots | unknown | Private operations may contain useful event/role context, but they are not public evidence. | Treat private material as context only and replace it with safe public labels. | No private channel URL, message ID, media CDN URL, or consent authority field may enter the build. |

## Capability traceability

| Capability | Runtime primitive | Executable check |
| --- | --- | --- |
| Route navigation | Native `<a>` links and Astro routes | Playwright route smoke; runtime route inventory |
| Community order | `data-community-section` sequence | Runtime exact-order assertion and staging/production e2e |
| Optional Series | `data-program-series` plus direct-session markers | Program staging e2e and runtime count check |
| Agenda union | `data-agenda-kind`, `data-agenda-state`, join anchors | Agenda e2e and runtime kind/join counts |
| Volunteer organization | `data-volunteer-cycle`, position/division/opening selectors | Volunteer e2e and runtime count check |
| Consent-ledger boundary | `data-visibility`, profile/ledger selectors, future-verification copy | Privacy e2e and forbidden-field scan |
| Publication readiness | `data-evidence-placeholder`, state markers, source fields | Production runtime guard and placeholder assertions |
| Staging boundary | `data-fixtures`, demo markers, robots metadata | Fixture leakage scan and noindex assertion |
| Responsive recomposition | CSS media rules, stable DOM order | 1280×720 and 390×844 screenshots/overflow checks |
| Reduced motion | `prefers-reduced-motion` CSS behavior | Playwright reduced-motion run |

## Route/state coverage

The required scenarios are contextual, not generic labels:

| Scenario | Route/state | Viewport | Expected reading path |
| --- | --- | --- | --- |
| `community-production-empty` | `/community`, fixtures disabled | 1280×720 and 390×844 | KAD saat ini → placeholder/current → Programs → Agenda → people boundary → sources |
| `community-staging-qualified` | `/community`, fixtures enabled | 1280×720 and 390×844 | fictional notice → three metrics → five Programs → 4 Agenda preview items → profiles/stubs |
| `programs-production` | `/programs`, verified catalogue boundary | 1280×720 | compact header → five public records → filter/source actions |
| `program-japanese-staging` | `/programs/japanese-study-club`, fixture | 1280×720 and 390×844 | purpose → three Series → Sessions → four metrics → contributors/evidence |
| `program-english-staging` | `/programs/english-study-club`, fixture | 390×844 | purpose → direct Sessions (no Series) → metrics/evidence |
| `agenda-production-empty` | `/events`, fixtures disabled | 1280×720 and 390×844 | Agenda header → empty state → safe Discord confirmation |
| `agenda-staging-mixed` | `/events`, fixture | 1280×720 and 390×844 | dated rows → three Sessions + one Event → status/time/join |
| `agenda-detail-staging` | `/events/{id}`, fixture | 390×844 | kind/status → time/timezone → relationship → revision → join |
| `volunteer-staging-directory` | `/volunteer`, fixture | 1280×720 and 390×844 | Cycle → positions → divisions → openings → people → consent |
| `volunteer-profile-staging` | `/volunteer/{slug}`, fixture | 390×844 | visibility → assignments → Program-grouped ledger → review/evidence → future link boundary |
| `stories-production-empty` | `/stories`, fixtures disabled | 1280×720 and 390×844 | documentation header → empty/publication gate |
| `stories-staging-detail` | `/stories/{slug}`, fixture | 390×844 | story body → date/review → related records → source/back link |

## Unknowns kept open

- The live Agenda projection, freshness rules, and exact Language Club mapping
  are implemented for staging. Standalone collaborations and additional event
  families remain unpublished until they receive explicit classifications.
- Program metrics and contribution evidence are manually attested in this
  release. Automated attendance, social, repository, voice, and observability
  integrations require separate approval.
- Public identity consent and future recruiter verification are modelled as
  boundaries, not as authentication or token flows.
- Production history, public milestone numbers, and volunteer identities remain
  unpublished until source and consent review is complete.

## Review boundary

The IR and hierarchy report are contract artifacts. They may be updated when a
rendered route proves a mismatch, but they must not be relaxed to make a failing
runtime check look green. Human screenshot review remains required for the
represented desktop and mobile viewports.
