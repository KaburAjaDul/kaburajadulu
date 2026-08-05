# PR0 evidence deconstruction

This document separates what is directly present in the current repositories
from design decisions made for the public-content rewrite. It is a planning
contract, not a claim that the website is already backed by live Discord data.

## Scope and success condition

The first public-content slice is the Programs catalogue and detail route. A
visitor should be able to understand what each program is, what is known, what
needs confirmation, and where to take the next step. The same UI must work with
deterministic staging records now and an approved public projection later.

## Evidence inventory

| Evidence ID | Source | Access and date | Use | Status |
| --- | --- | --- | --- | --- |
| E-01 | `src/components/community-system/CommunityPage.astro` | repository, 2026-08-04 | Current route composition and repeated inner-page structure | observed |
| E-02 | `src/components/community-system/TaskHeader.astro` | repository, 2026-08-04 | Current compact-header fields and CTA contract | observed |
| E-03 | `src/content/community-site.ts` | repository, 2026-08-04 | Existing public program source records, slugs, copy, source links, and approved local media metadata | observed |
| E-04 | `src/content/staging-fixtures.ts` | repository, 2026-08-04 | Deterministic preview fixture boundary and current state vocabulary | observed |
| E-05 | `src/wrangler.jsonc` | repository, 2026-08-04 | Current static Cloudflare deployment shape and absence of a public D1/R2 binding | observed |
| E-06 | `KAD-Agent` service and event documents | sibling repository, 2026-08-04 | Private Discord-first operational authority and approval workflow | observed |
| E-07 | `docs/interface/page-system.md` | repository, 2026-08-04 | Existing visual language and current design-system decisions | observed |
| E-08 | User-approved information-first review | conversation, 2026-08-04 | Inner pages should expose information and actions before decorative spectacle | observed |
| E-09 | Public-content rewrite architecture | planning synthesis, 2026-08-04 | One-way private-to-public projection boundary | inferred |
| E-10 | Public source approval, ownership, and Discord channel allowlist | not supplied | Required to publish live records safely | unknown |

## Deconstruction table

| Evidence | Status | Observation | Transferable rule | Implementation boundary |
| --- | --- | --- | --- | --- |
| E-01 | observed | Inner routes are delegated through one `CommunityPage` composition. | A page family may share semantic primitives, but catalogue, operational, editorial, and evidence pages need different compositions. | Refactor only through page-family work; do not copy a universal page template into new routes. |
| E-02 | observed | The current compact header expects title, summary, three status facts, and a primary action on every inner page. | Headers should answer the route's immediate task; statistics are optional and only appear when they clarify that task. | PR1 retires the universal three-fact requirement. |
| E-03 | observed | Five program records have stable slugs, public source URLs, known facts, confirmation questions, and repository-owned poster metadata. | A program row must show source, certainty, and next action without presenting an unverified field as fact. | Use these records as seed inputs; keep media local and retain source metadata. |
| E-03 | observed | The GKS record has no approved local media. | A missing image is a content state, not a reason to invent or hotlink artwork. | Render the text fallback and public source link. |
| E-04 | observed | Preview fixtures are deterministic and can expose upcoming, live, completed, pending, empty, and error states. | Seed data must exercise meaningful states and use the same DTO boundary as a future API. | Fixture mode is staging-only, visibly labelled, and never a production claim. |
| E-05 | observed | The website is currently a static Astro/Cloudflare asset deployment without public D1/R2 bindings. | The first API integration should be an explicit public projection service, not an accidental direct Discord dependency. | Keep build-time seed adapter and future API adapter behind one repository interface. |
| E-06 | observed | KAD-Agent treats private SQLite and Discord operations as operational truth and has approval workflows. | Website publication must be a distinct approved projection decision. | No raw channel, message, member, or private attachment data crosses the public boundary. |
| E-07 | observed | The site uses white paper, cobalt actions, Plus Jakarta Sans, playful annotations, and rounded media. | Retain the visual vocabulary while changing page hierarchy and density. | Shared tokens may be promoted; screenshots and private media are comparison evidence only. |
| E-08 | observed | The user wants Programs, Events, Volunteer, and Stories to answer questions before creating a visual “wow” moment. | The landing page may remain expressive; inner pages lead with task information, status, filters, and actions. | Do not use a large landing hero or decorative statistics as the default inner-page header. |
| E-09 | inferred | A sanitized projection can provide revision, freshness, provenance, and withdrawal semantics to a static or edge website. | Public records need a stable envelope that supports seed data, caching, corrections, and stale states. | D1 is a public read model; SQLite remains authoritative; sync is one-way in v1. |
| E-10 | unknown | We do not yet know which Discord channels/templates, staff owners, or content classes are authorised for web publication. | Treat source allowlist, approver, and correction SLA as release-blocking policy inputs. | Do not implement generic channel scraping or automatic publication until these are explicit. |

## Current design and data issues

### Confirmed issues

1. The same header and card rhythm is used for page families with different
   jobs (`E-01`, `E-02`).
2. Current fixtures are useful for static staging but are not yet the public DTO
   contract that a projector or API can consume (`E-04`).
3. Event/public projection infrastructure is not present in the static site
   deployment (`E-05`).
4. Existing public program content contains an intentional distinction between
   known facts and confirmation questions; that distinction must remain visible
   in the new UI (`E-03`).

### Decisions for PR0

- Programs catalogue/detail is the first vertical slice.
- Seed and live adapters share one `PublicContentRepository` interface.
- Public records are allowlisted, sanitised, revisioned, and explicitly
  approved.
- The public site never treats Discord as a read API.
- The landing page keeps expressive composition; inner pages use information-
  first page families.

### Open questions

- Which KAD-Agent channel/template pairs may create web-public drafts?
- Which record classes can be routine-auto-approved, and which always require
  a human publication decision?
- Who owns editorial approval, privacy/attribution approval, and correction
  response time?
- What freshness thresholds make a program, event, story, or metric stale?
- Which public source URL and join action should each record expose?

## Non-goals

- No Discord scraping.
- No publication of member identities, private channel activity, moderation
  material, or raw attachments.
- No donation collection, impact totals, or historical growth claims until the
  evidence owner and metric definition are approved.
- No visual promotion claim from a planned screenshot; strict reference
  coverage requires captured PNGs and dated human review.

