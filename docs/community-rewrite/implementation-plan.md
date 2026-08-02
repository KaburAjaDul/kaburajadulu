# KAD community website rewrite — implementation plan

Status: Phase 0 planning and evidence. This document is the contract for the
staged rewrite; it is not a request to implement the later PRs in this branch.

## Scope and non-goals

KaburAjaDulu (KAD) remains an Astro 7 static site with React 19, Tailwind CSS
v4, 13 supported locales (14 generated route variants including `/`), and a
Cloudflare Worker serving static assets. The
rewrite adds a public community/events surface without turning the website
into an operational admin application. KAD-Agent's SQLite database is the
private operational authority. The website consumes a deliberately smaller
public projection; it never reads private Discord data directly.

The first source-backed program families are Language Clubs and selected
education/career sessions represented by the collected Apple Developer Academy
and GKS posts. Cerita Aja Dulu is a source-backed story/event candidate but
remains approval-gated. CV Review is a historical research lead, not an
approved program page, until an owner and current public source approve its
scope. A history page may be drafted later under editorial review. Founder or
leadership claims are out of scope for Phase 0 and require explicit approval
before publication. Public attribution is opt-in and prototype/deferred: no
real identity, Discord ID, private link, or profile is published until a
consent workflow exists. Impact automation and social APIs are later work, not
a dependency of the event launch.

## Product domains and page map

The rewrite is one website, but its data and approval rules are split into
domains so each PR can ship without coupling unrelated risk:

| Domain | Public surface | Private/operational surface | First PR |
| --- | --- | --- | --- |
| Community discovery | `/community`, homepage modules, join CTA | None | PR1 |
| Program catalog | `/programs`, `/programs/{slug}` | Editorial source files | PR2 |
| Event publication | `/events`, `/events/{event_id}`, ICS | Approved event projection | PR3–PR5 |
| Event documentation | Event recap/resources/media | Review workspace, rights checks, source evidence | PR3 |
| Stories and history | `/stories`, `/stories/{slug}`, `/about/history` | Editorial review and corroboration | PR6 |
| Volunteer operations | `/volunteer`, cycle explanation | KAD-Agent assignments/handovers | PR2 for the model; PR7 for attribution |
| Credits and attribution | `/community/credits` | Opt-in consent records and revocation | PR7 |
| Impact and support | `/community/impact`, `/support` | Approved aggregate metrics and finance governance | PR8 or later |
| Media governance | Controlled `/media/*` delivery | R2 ingestion, checksums, rights and redaction | PR3 |

The primary visitor journey is `homepage -> program -> upcoming event -> join
Discord or add calendar -> approved recap/story`. The organizer journey is
`create event -> run event -> submit report/media -> review/redact -> approve ->
publish`. The volunteer journey remains anonymous by default; a volunteer may
later opt in to a scoped public credit and revoke it. A partner or supporter
may read approved program/impact evidence, but donation collection is not
added until ownership, reporting, refund, and finance governance are defined.

## Runtime boundaries

| Concern | Placement | Authority / rule |
| --- | --- | --- |
| Pages, layout, locale routing, SEO | Static Astro build + React islands | Existing Astro 7 conventions; no SSR adapter |
| Public reads | Cloudflare Worker API routes | Validate and return published projection only |
| Public event/document projection | Cloudflare D1 | Separate public read model; no private operational tables |
| Approved documentation media | Cloudflare R2 | Only reviewed/approved objects; serve through controlled public keys |
| Operational events, consent, moderation | KAD-Agent SQLite (private) | Source of truth; never exposed to the browser |
| Future synchronization | KAD-Agent outbox/projector | Idempotent, approved records only; introduced in PR5 |

This boundary is grounded in the checked KAD-Agent snapshot at commit
`9f04a81`: `../KAD-Agent/ARCHITECTURE.md` states that service rules own event
and approval policy and that models are not workflow authority, while
`../KAD-Agent/docs/design-docs/event-approval-workflow.md` defines SQLite as
the source of truth for approval decisions and publish outcomes. PR0 sign-off
must refresh these references if KAD-Agent advances before implementation.

The Worker stays an asset-first deployment. API routes are additive and must
not require the static site to become server-rendered. If the API is down or
stale, pages render an explicit empty/stale state and never fall back to
private Discord URLs or unreviewed media.

## Public data contract (design before migration)

Names below are schema concepts, not a permission to create migrations in
Phase 0. Exact SQL, indexes, and retention rules are approved in PR3.

### D1 public projection

- `programs`: stable `program_id`, localized title/summary, slug, status
  (`draft`, `published`, `archived`, `tombstoned`), display order,
  `published_at`, `updated_at`, `source_revision`, `approval_revision`, and
  `deleted_at`.
- `events`: stable `event_id`, `program_id`, localized title/summary,
  timezone-aware start/end, venue or redacted online label, registration URL
  (if approved), status (`draft`, `published`, `cancelled`, `tombstoned`),
  `published_at`, `updated_at`, `source_revision`, `approval_revision`, and
  `deleted_at`.
- `event_documents`: stable `document_id`, `event_id`, approved title,
  localized caption/alt text, document kind (`recap`, `announcement`,
  `resource`), R2 object key, checksum, immutable `source_revision` and
  `approval_revision`, consent record reference when a person is represented,
  and `published_at`/`deleted_at`. The table stores no raw Discord message,
  author ID, invite URL, or private attachment URL.
- `event_attributions` (deferred until PR7): opaque public attribution ID,
  display name supplied under consent, scope/expiry, revocation state, immutable
  `source_revision`, `approval_revision`, and opaque private consent-authority
  reference.
- `projection_tombstones`: entity type/ID, reason code, immutable source and
  approval revisions, tombstoned timestamp, and optional public replacement
  pointer. Tombstones prevent an old cache or replayed outbox item from
  resurrecting content.
- `projection_meta`: projection revision, generated-at timestamp, and health
  marker used by freshness/status responses.

All public text is either localized content with a locale fallback explicitly
declared or a neutral value approved for all locales. IDs are opaque and not
derived from Discord IDs. Every write is auditable by source revision and
approval revision, while audit detail remains private.

### Event lifecycle and publication rules

`captured (private) -> normalized -> consent/rights review -> editorial
review -> approved -> published -> updated or cancelled -> revoked/tombstoned`.

Only `approved` records may enter the projector, and only `published` rows are
returned by public endpoints. This rule applies equally to programs, events,
documents, stories, and attributions. Cancellation or archival is a visible
status change when approved; removal or consent withdrawal emits a tombstone
and removes media references. A deletion/revocation must be idempotent,
preserve the tombstone for at least the longest cache lifetime plus the maximum
outbox replay window (exact durations are a PR3 migration decision), and never
expose the underlying private reason or identity.

### Documentation intake, review, and publish

1. A moderator or scripted intake records a private source reference in
   KAD-Agent SQLite and copies candidate text/media into a review workspace.
2. Normalization removes Discord IDs, invite links, message links, mentions,
   EXIF/geolocation, and unapproved names; it assigns a stable source
   revision.
3. Rights/consent review verifies that each image, quote, and attribution may
   be public. Editorial review verifies accuracy, locale-safe copy, alt text,
   program/event association, and sensitive-data redaction.
4. An approval record freezes the publishable payload. A PR3 staging-only seed
   fixture may write a synthetic or redacted approved payload to staging D1 and
   approved test media to staging R2. It must include a non-public authority
   reference and approval revision; it cannot target production. Production
   publication is unavailable until the PR5 projector consumes an approved
   KAD-Agent record.
5. The public API serves the row after `published_at`; a correction creates a
   new revision. Revocation/deletion creates a tombstone, marks the row/media
   unavailable, and purges or invalidates relevant cache keys.

Social CDN URLs are never hotlinked. If a social asset is approved for reuse,
it must first be downloaded/ingested into R2, checked for rights and
redaction, assigned a controlled key, and then referenced by that R2 key.

### Consent, rights, and withdrawal contract

A private consent record is required whenever media, a quote, a story, or a
credit represents an identifiable person. It records the claimant/subject in
private form, public purpose and scope, asset/attribution IDs, consent method,
policy revision, granted/expiry timestamps, and current state (`pending`,
`granted`, `expired`, `withdrawn`). The public projection receives only the
opaque approval revision and allowed public fields.

Before PR3 accepts real media, the operator path must support `locate -> block
new publication -> tombstone public rows -> invalidate Worker caches -> delete
or quarantine R2 objects -> verify public 404/absence -> record completion`.
PR3 defines a bounded deletion SLA and retention exceptions; until then, real
person-linked media is rejected. PR7 adds the volunteer-facing request and
withdrawal UX/API, authenticated status receipt, and propagation audit. A
withdrawal takes effect publicly even when private audit retention is legally
or operationally required.

### R2 key strategy

Use deterministic, opaque, non-user-derived keys:

`public/events/{event_id}/{document_id}/{revision}-{sha256}.{ext}`

The API resolves keys to a controlled Worker URL (or signed short-lived URL
if later required); clients do not receive source URLs. MIME type, byte size,
checksum, and cache headers are recorded. New revisions get new keys; old
keys are quarantined or deleted only after the retention/tombstone window.

## Worker API and cache contract

Initial endpoint shape (all reads are published-only and locale-aware):

- `GET /api/v1/programs?locale={locale}` — published programs.
- `GET /api/v1/events?locale={locale}&from=&to=&program=&cursor=` — bounded,
  deterministic event list; default excludes past events except an explicit
  archive query.
- `GET /api/v1/events/{event_id}?locale={locale}` — event detail,
  documents, and approved attributions only.
- `GET /api/v1/events/{event_id}/ics` — generated RFC 5545 calendar payload;
  no private source fields.
- `GET /api/v1/status` — projection revision, generated-at, freshness class,
  and build/API version; no secrets or operational identifiers.

Responses use a versioned envelope (`data`, `meta`, `locale`, `projection`
revision), stable error codes, and an explicit `stale` boolean. Contract
tests must reject private fields and unknown status values. Cache keys include
path, query, locale, and projection revision. Public GETs may use
`Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=86400`
until measured traffic dictates otherwise. A stale projection is served only
with `stale: true`; a missing projection returns a safe empty result or 503
according to the endpoint contract. Publish, update, cancellation, and
tombstone events invalidate the affected detail/list/ICS keys.

## Staging, rollback, and safety

Every PR that needs infrastructure uses a separate Cloudflare staging Worker,
staging D1 database, and staging R2 bucket. Staging has no production secrets,
tokens, Discord credentials, or production URLs. Before the first remote
preview, Wrangler must define an explicit staging environment and an allowlist
of staging Worker, D1, and R2 resource names/IDs. CI fails closed when that
environment or allowlist is absent, when a preview names a production resource,
or when a staging deployment resolves a production binding. No remote preview
or production feature flag is permitted after a failed or skipped isolation
gate.

Each infrastructure PR publishes a staging preview URL when credentials are
available; without credentials, it may merge only as non-runtime preparation
with the feature unreachable and a recorded local-preview limitation. Use
Cloudflare's versioned Worker flow (`wrangler versions upload`, then a version
alias/preview URL) for PR evidence. The preview alias must resolve to the PR's
staging Worker environment, never the production Worker. Production bindings
are introduced only after the PR's gate passes.

Keep the static asset path intact while selectively running the Worker first
for `/api/*` (and the controlled R2 media path if used). Asset requests should
continue to use the static asset handler; API requests must not accidentally
fall through to an asset or expose a private binding. Preview resource names,
Worker version IDs, and aliases are evidence-only metadata and must not be
copied into public content.

Feature flags default off for public event routes and attribution. Rollback is
the prior static asset deployment plus disabling the flag; D1 migrations are
expand/contract (additive first, removal only after a later verified PR), and
R2 objects are versioned/quarantined before deletion. A failed projector must
stop safely and leave the last known-good published projection intact.

## PR sequence and acceptance matrix

The sequence is intentionally small and deployable. Each PR has one primary
write set; unrelated cleanup is out of scope.

| PR | Deliverable / write set | Migrations or objects | Tests and acceptance gate | Deployment target | Blocked by |
| --- | --- | --- | --- | --- | --- |
| **PR0** | This planning/evidence document; inventory current Astro routes, locales, Worker config, and KAD-Agent authority. | None. | Evidence cites real files/commands; threat model and schema/API review signed off. | Branch only; no runtime change. | None |
| **PR1** | Visual shell and information architecture for `/community`, `/programs`, `/events`; navigation, empty/stale/error states, staging plumbing. No event data and **no D1**. | Worker staging config only; no D1/R2 binding required. | Browser/Playwright shell smoke at desktop/mobile; root plus every supported locale route; Arabic RTL; reduced-motion; static build/check; SEO canonical/hreflang/robots/sitemap. | Staging Worker preview with event flag off. | PR0 |
| **PR2** | Astro content collections and real static program pages for source-backed Language Clubs and the collected Apple Academy/GKS education sessions, plus the anonymous Volunteer Cycle operating model. Cerita Aja Dulu stays approval-gated; CV Review stays a research lead until sourced and approved. | Content schema and localized Markdown/JSON only. | Content schema/type checks; Playwright page/locale coverage; 13-locale fallback audit including root behavior; RTL and reduced-motion; SEO metadata, sitemap, no unapproved program/history/leadership claims. | Static staging Worker. | PR1 |
| **PR3** | D1/R2 event-documentation prototype with staging-only approved fixture seed; published-only API reads. | D1 initial public tables/indexes; R2 staging bucket object fixtures and metadata. | Fail-closed staging-binding allowlist; D1 migration apply/rollback-on-staging; API/contract tests; R2 object checksum/MIME/cache test; security/redaction test proves no Discord IDs/links/private fields; consent withdrawal/deletion-SLA drill; rights/editorial approval fixture; Playwright list/detail empty, published, stale, and error states; 13-locale/RTL/reduced-motion. | Staging Worker + staging D1/R2, no production secrets or real-person media. | PR2 |
| **PR4** | Public event list/detail UI, filters, pagination, localized dates/time zones, cancellation state, ICS route/button. | Additive indexes/ICS contract only; approved R2 fixtures. | Browser/Playwright list/detail/filter/cancel/ICS download; API schema and RFC 5545 validation; cache/staleness tests; SEO event metadata/sitemap; locale/RTL/reduced-motion; security redaction. | Staging only; production remains unreachable until PR5. | PR3 |
| **PR5** | KAD-Agent approved projection/outbox integration; idempotent publish/update/cancel/tombstone handling. | Outbox cursor/checkpoint in private KAD-Agent SQLite; D1 projector constraints; no private-table replication. | Projector unit/replay tests; reject any entity missing immutable source and approval revisions; D1 migration gate; contract tests from approved fixtures; tombstone/cache invalidation test; observability and retry/poison-item test; redaction/security review. | Staging end-to-end first; production only after soak and rollback drill. | PR4 and KAD-Agent approval |
| **PR6** | Story/editorial pipeline and later-reviewed history draft surface. | Optional additive `stories`/review metadata in public projection only after editorial schema approval; R2 approved media. | Editorial state transition tests; rights/alt-text/redaction checks; Playwright story states; 13-locale, RTL, reduced-motion, SEO/sitemap; explicit approval for any history/leadership claims. | Staging, feature-flagged. | PR5 |
| **PR7** | Opt-in volunteer attribution prototype with grant/status/withdrawal UX and API, consent scope/expiry, and propagation receipt. KAD-Agent owns issuance, access control, audit, expiry, and withdrawal. | Private KAD-Agent consent-record migration with owner/access/retention policy; additive public attribution projection containing only opaque consent authority/revision references; tombstones for withdrawal. | Private consent RBAC and migration tests; consent/revocation contract tests; authenticated withdrawal and propagation-SLA test; identity minimization/security review; cache purge/R2 absence/tombstone test; Playwright anonymous/consented/revoked views; locale/RTL/reduced-motion; SEO excludes non-indexable personal detail. | Staging only until policy sign-off, then production flag. | PR6 and approved consent workflow |
| **PR8** | Social metrics adapters and impact reporting, only after policy and data minimization review. | Separate metrics tables/objects; no change to event publication contract. | Adapter fixture/contract tests; rate-limit/retry/retention tests; no social CDN hotlinks; redaction/security review; dashboard/API observability; browser smoke where surfaced. | Staging first; production only with policy approval and explicit flag. | PR7 and approved metrics policy |

## Cross-cutting acceptance gates

Every PR that changes pages runs `bun run check` and `bun run build` plus the
repository's Playwright command against the built/preview site. Browser gates
cover desktop and mobile navigation, keyboard/focus behavior, loading/empty/
error/stale states, the root route and all 13 supported locales, Arabic RTL,
and `prefers-reduced-motion`.

Every API/data PR runs versioned API/contract tests, validates D1 migrations
against a clean staging database, and exercises R2 object existence,
checksum, MIME type, cache headers, and controlled URL resolution. Security
tests assert that private Discord IDs, invite/message links, raw source URLs,
unapproved names, secrets, and operational SQLite fields cannot cross the
public boundary. Deletion/revocation tests assert tombstone dominance over
retries and cached responses.

SEO gates cover canonical URLs, hreflang for all 13 locales, localized titles/
descriptions, structured data where applicable, robots, and sitemap output.
Event gates additionally validate timezone correctness, cancellation copy, and
RFC 5545 ICS content. Accessibility includes semantic landmarks, labels,
contrast, keyboard operation, and reduced-motion behavior.

## Observability and operating evidence

Worker logs emit request ID, route, status, locale, cache result, projection
revision, and latency; never payloads, tokens, Discord IDs, or private URLs.
Projector logs emit source revision, outcome (`applied`, `skipped`, `rejected`,
`tombstoned`), retry count, and a redacted reason. Metrics/alerts cover API
5xx/latency, stale age, D1 errors, R2 misses, projector lag, rejected items,
and tombstone failures. `/api/v1/status` is the operator-safe evidence point.

Each PR receipt records commands, exit codes, staging URL/bindings by name
only, migration/object identifiers, screenshots or Playwright report paths,
and rollback result. No production credential or private operational data is
copied into tickets, fixtures, logs, or public content.

## Platform references checked for this plan

- [Cloudflare Worker Preview URLs](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/) — versioned and aliased previews for CI/PR review.
- [Cloudflare D1 environments](https://developers.cloudflare.com/d1/configuration/environments/) — separate staging and production database bindings.
- [Cloudflare local development and environment-specific R2 bindings](https://developers.cloudflare.com/workers/local-development/) — isolate staging media from production resources.
- [Cloudflare static assets with a Worker script](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/) — retain static asset delivery while routing `/api/*` through Worker code.
