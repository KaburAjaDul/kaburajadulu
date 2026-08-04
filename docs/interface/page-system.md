# KAD community page system

This document is the content and hierarchy companion to
`kad-community-interface.ir.json`. It describes the public contract, not a
future backend. The current release is a fixture-backed staging prototype with
an evidence-safe production build.

## Route jobs and information order

| Route | Visitor job | First useful information | Required states and actions |
| --- | --- | --- | --- |
| `/community` | Orient quickly | `KAD saat ini`, then programs, agenda, people, sources | Five ordered sections; Discord and internal links; production placeholders where evidence is absent |
| `/programs` | Choose a continuing offering | Program purpose, status, structure, and next known Session | Five records; URL filters; source/readiness state |
| `/programs/{slug}` | Understand one Program | Purpose → Series or direct Sessions → metrics → contributors → documentation → provenance | Optional Series; four Program metric slots; no fabricated repository |
| `/events` | See what will happen | Agenda rows grouped by date with status, time, and join action | Union of Sessions and Events; production empty state; staging 3 Sessions + 1 Event |
| `/events/{id}` | Confirm one scheduled item | Kind, status, time, timezone, Program/Series relationship, revision, join path | Textual lifecycle; safe Discord action; no private Discord identifiers |
| `/volunteer` | Decide whether and how to contribute | Current Cycle, positions, divisions, openings, people | 3-month Cycle; 4 Positions; 7 Divisions; 3 openings; consent boundary |
| `/volunteer/{slug}` | Review one contributor’s work | Identity visibility → assignments → contributions grouped by Program | Anonymous stub or opt-in identity; evidence/review state; no impact score/ranking |
| `/stories` | Read documented context | Story title, date, summary, state, related records | Documentation index; stories never replace Agenda or the ledger |
| `/stories/{slug}` | Read one documented record | Body, review/date, related Program/Session/Event/contributor links | Source, consent, and editorial state remain visible |

The home route may retain a large visual hero. The nine information routes use a
compact task header. The first viewport must answer “what is this page and what
can I do next?” before secondary narrative or decorative media.

## Community section contract

`/community` renders exactly five `data-community-section` regions in this
order:

1. `current`: three qualified metrics. Every metric carries period, definition,
   method, source, review state, and reviewed date. Production uses an Evidence
   Placeholder when a number is not approved. Staging values are deterministic,
   fictional, and explicitly labelled.
2. `programs`: the five Program records and their next known step. The list links
   to the catalogue; it does not duplicate the full Program detail view.
3. `agenda`: a preview of the next Sessions and standalone Events. The index
   links to `/events`; joining always uses the safe public Discord invite.
4. `people`: opt-in public profiles plus anonymous contributor stubs. The public
   surface never exposes private IDs, raw Discord links, or consent authority
   fields.
5. `sources`: Discord, KADSocialHub, Instagram, and Stories handoffs. A source
   link is not itself proof of a claim.

## Domain display rules

### Program, Series, Session

`Program` is a continuing offering. A Program may have zero or more `Series`.
Each Series may contain Sessions. A Program without a Series renders direct
Sessions. Japanese Study Club demonstrates three Series in staging (N5, N4–N3,
N2–N1); English Study Club demonstrates direct Sessions. Tech/Coding Club is a
sharing Program: a repository or project link appears only when an actual
artifact has passed review.

### Agenda

Agenda is a view over two kinds of scheduled records:

- `session`: a scheduled Session, with a required Program and optional Series;
- `event`: a bounded standalone collaboration, with no required Program.

Every row has start/end time, timezone, lifecycle text (`Akan datang`,
`Berlangsung`, `Selesai`), revision/freshness, a detail link, and one safe
Discord confirmation/join path. Discord Scheduled Events are a join path only;
the domain record remains the reviewed public projection.

### Volunteer organization

The current organization map is ordered by responsibility:

1. Advisor — non-executive context and guidance;
2. Community Manager — executive head across the volunteer organization;
3. Admin / Division Lead — accountable lead for one division;
4. Individual Volunteer — bounded contribution within a Program or division.

Divisions are Study Club, Tech/Coding Club, Event, Design, Content,
Partnership, and Data. A Volunteer Cycle is a three-month reorganization
horizon. Recruitment can remain continuous while the Cycle is open. The index
shows openings as bounded scopes rather than promising a role.

### Contribution Ledger

There is one organization Contribution Ledger. A profile page is a derived view
grouped by Program. Each entry may show responsibility, period, evidence, and
review state (`Dilaporkan`, `Bukti terlampir`, `Terverifikasi`, `Dikoreksi`, or
`Dicabut`). Program metrics describe the Program; a contributor page must not
convert them into a personal impact score or ranking.

Public attribution is opt-in. Every internal contributor may have an anonymous
stub with safe aggregate counts. Named profile details require explicit
consent. Owner-generated expiring and revocable recruiter links are a future
capability and must not be simulated in this release.

## Production and staging boundary

Production (`PUBLIC_STAGING_FIXTURES` unset):

- contains only approved public records and local approved media;
- excludes fixture IDs, fictional people, demo copy, private Discord fields,
  and raw Discord channel/message URLs;
- renders `Evidence Placeholder`, pending, empty, or not-published states when
  evidence is not ready;
- has no indexable fixture profile or story pages.

Staging (`PUBLIC_STAGING_FIXTURES=true`):

- uses deterministic records marked `data-fixtures="enabled"` and a quiet
  `Pratinjau · data contoh` disclosure;
- includes the mixed Agenda fixture (three Sessions and one standalone Event),
  five Programs, optional Series, four Positions, seven Divisions, three
  openings, opt-in profiles, and anonymous stubs;
- is `noindex, nofollow` on every generated page;
- never carries private Discord IDs, private media, or secret verification links.

The future live path is KAD-Agent/Discord bot → reviewed public projection →
Astro repository. The website does not scrape Discord or read the private bot
database. Program metrics and contributions remain manually attested in the
first live iteration.

## Responsive, interaction, and content rules

- Use Indonesian as the source language and complete English equivalents on
  supported English routes. Do not mix Indonesian product copy into an English
  surface.
- Use ordinary anchors for internal navigation, detail pages, filters, and
  source handoffs. Preserve browser back/forward behavior.
- At 390px, multi-column facts and records become one column without changing
  semantic or focus order. At 1280px, keep line length and metadata scannable.
- Status is always textual; color is supplemental. Keep visible keyboard focus,
  skip link, and a stable destination after mobile menu dismissal.
- Motion is finite and optional. Reduced motion removes transitions while
  preserving state, content, and focus.
- Do not add universal inner-page heroes, generic feature-card grids,
  decorative assistant notes, or unsupported metrics.

## Runtime selector contract

The runtime guard uses stable selectors rather than copy-only matching:

- `data-page-family` identifies catalogue/detail page families;
- `data-community-section` identifies the five Community regions;
- `data-program-record`, `data-program-series`, `data-program-metric`, and
  `data-program-session` prove Program structure;
- `data-agenda-kind`, `data-agenda-state`, and `data-discord-join-path` prove
  Agenda union and safe joining;
- `data-volunteer-cycle`, `data-volunteer-position`,
  `data-volunteer-division`, and `data-volunteer-opening` prove organization
  counts;
- `data-volunteer-profile`, `data-contribution-group`, and
  `data-verification-future` prove consent-ledger boundaries;
- `data-evidence-placeholder`, `data-fixtures`, and the robots meta tag prove
  publication readiness and staging isolation.

The validator is intentionally strict about route presence, count contracts,
forbidden private fields, and fixture leakage. It is not a substitute for
Playwright interaction or human screenshot review.
