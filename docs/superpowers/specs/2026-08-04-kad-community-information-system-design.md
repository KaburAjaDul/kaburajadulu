# KAD Community Information System Design

## Purpose

Reorganize the public KAD website around the information people actually need:
what the community runs, what is scheduled, who carries the work, and what can
be proven. The first release is a fixture-backed staging prototype. It must be
useful enough to evaluate end to end while keeping fictional data visibly
separate from production truth.

## Audience and tasks

The public surface serves four actors:

1. A community member choosing a Program or scheduled activity.
2. A prospective volunteer understanding Divisions, openings, and the current
   Volunteer Cycle.
3. A contributor reviewing or sharing their attributed work.
4. A supporter or recruiter checking evidence without receiving private
   Discord identifiers or unrelated ledger contents.

## Ubiquitous language

The canonical definitions live in `CONTEXT.md`. The interface follows these
relationships:

```text
Program -> optional Series -> Session
Standalone collaboration -> Event
Agenda = scheduled Sessions + Events

Volunteer Position + Division Assignment + Volunteer Cycle
Contribution -> one or more Contribution Attributions
Contribution Ledger -> Contributor Ledger View -> optional public projection
```

Recurring KAD-owned formats such as CeritaAjaDulu and Tech/Coding Club are
Programs. A bounded collaboration outside a continuing Program is an Event.
Discord Scheduled Events are join-path representations, not the domain source
of truth.

## Information architecture

### Community `/community`

Job: provide orientation without becoming a second directory.

Order:

1. Compact introduction with Discord and Programs actions.
2. `KAD saat ini`: three qualified metrics with period, definition, source,
   method, and review date.
3. Featured Programs with their structure and next known step.
4. Next Agenda items with time, status, and detail/join action.
5. A small contributor preview containing opt-in profiles and anonymous public
   contributor stubs.
6. Public source and participation links.

Production uses Evidence Placeholders when approved evidence is absent. Staging
uses deterministic, visibly fictional values and remains `noindex, nofollow`.

### Programs `/programs` and `/programs/{slug}`

Job: help a visitor choose a continuing offering and understand its contents.

The directory groups Programs by domain and exposes title, purpose, status,
Series summary, next Session state, and source. Program detail exposes:

- purpose and audience;
- optional Series and their level/curriculum;
- Sessions and the next scheduled occurrence;
- the small Program Metric Contract;
- Stories/documentation;
- contributors and responsibilities;
- public provenance and Discord confirmation/join path.

Tech/Coding Club starts as a sharing Program. Repository or project output is
rendered only when an actual artifact exists.

### Agenda `/events`

The route remains `/events` for compatibility; its public navigation label and
page title become `Agenda`.

Job: show what will happen, when, and how to join.

Agenda combines scheduled Sessions and standalone Events. Each row exposes
type, related Program/Series when applicable, start and end time, timezone,
lifecycle status, revision/freshness, and a safe public join/detail action.
Production initially renders an honest Evidence Placeholder. Staging renders a
mixed fixture set that proves Program Sessions and standalone Events.

### Volunteer `/volunteer` and `/volunteer/{slug}`

Job of the index: explain the organization, current cycle, openings, and who
does the work. The position order is Advisor, Community Manager, Division Lead,
and Individual Volunteer. Divisions are Study Club, Tech/Coding Club, Event,
Design, Content, Partnership, and Data.

The index includes:

- the current three-month reorganization Cycle;
- continuous recruitment state and bounded openings;
- a compact organization map;
- Division responsibilities;
- a faculty-like directory containing opt-in profiles and anonymous stubs;
- the intake action.

The profile detail includes current and historical assignments, responsibility
scope, Contributions grouped by Program, evidence/review state, and Program
outcomes only as shared context. It never creates an individual impact score or
ranking. Verification-link creation is shown only as a future owner capability;
the staging public page must not simulate a functioning secret link.

### Stories `/stories`

Job: publish readable Program recaps, Event documentation, and community
stories. Stories link back to related Program, Session/Event, and opted-in
contributors. Stories are not a substitute for Agenda or the Contribution
Ledger.

## Metrics

Success belongs to Programs, not individuals.

The initial shared Program Metric Contract is deliberately small:

- completed Sessions;
- unique participants when an approved count exists;
- returning participants when an approved count exists;
- documentation coverage;
- period, definition, method, source, and reviewed date for every number.

Program-specific outcomes are optional. Tech/Coding Club may later count
published repositories or demos; Language Programs may later measure Series
continuity; Data may later measure source coverage and freshness. Missing
measurements remain Evidence Placeholders.

Contributor surfaces show directly attributed outputs and responsibilities.
They may say a contributor worked on a Program whose sessions reached a given
audience, but they must not claim the entire Program outcome as personal impact.

## Contribution and privacy model

One organization Contribution Ledger owns every work record. A person's ledger
is a derived Contributor Ledger View over Contribution Attributions.

Every internal contributor receives an anonymous Public Contributor Stub
with privacy-safe aggregate counts. A named Volunteer Profile and detailed
public attribution require explicit opt-in. Shared work remains one
Contribution with multiple responsibility-specific attributions.

Contribution review states are `reported`, `evidence_attached`, `verified`,
`corrected`, and `revoked`. Division Leads attest Individual Volunteer work;
the Community Manager attests Division Lead and cross-Division work.

Future recruiter verification uses owner-generated, expiring, revocable links
that disclose selected identity and selected verified work. This release only
models the public and owner-facing content boundary; it does not implement
authentication, capability tokens, or recruiter verification endpoints.

## Data and integration boundary

This release uses checked TypeScript Preview Fixtures. The fixtures include:

- Language, Korean, Tech/Coding, and CeritaAjaDulu Programs;
- optional Series and direct-to-Program Sessions;
- Program Sessions and one standalone collaboration Event;
- one current Volunteer Cycle, four Positions, seven Divisions, openings,
  opt-in profiles, and anonymous stubs;
- responsibility-specific Contributions and evidence/review states;
- Program-level metrics and documentation records.

The production build must exclude all fictional claims and identifiers. It
keeps verified public-source records and renders Evidence Placeholders for the
rest.

Future live Agenda data flows from the Discord bot/KAD-Agent private authority
through an approved public projection. The website never scrapes Discord or
reads the private bot database. Program metrics and Contributions remain
manual-attested in the first live iteration. Social metrics, voice attendance,
repository activity, and observability automation are separate later phases.

## Content rules

- Use Bahasa Indonesia as the primary product language and complete English
  equivalents for supported translated routes.
- Replace the internal term `Pulse`/`Denyut komunitas` with `KAD saat ini`.
- Use `Agenda` as the public label for `/events`.
- State a period beside every metric.
- Keep `data contoh` visible on staging without turning implementation language
  into customer-facing copy.
- Use `Belum terdokumentasi`, `Menunggu verifikasi`, or a similarly specific
  Evidence Placeholder instead of invented facts.
- Never expose Discord IDs, private channel/message URLs, consent authority IDs,
  raw capability tokens, or private-platform media.

## Visual and interaction system

Preserve the established editorial KAD visual language: flat evidence-led rows,
strong typographic hierarchy, restrained borders, and local program media. Do
not add large inner-page heroes, generic feature-card grids, decorative assistant
notes, or universal metric dashboards.

Desktop and mobile must preserve the same reading order. Directory filters use
normal URLs. Detail links remain ordinary anchors. Agenda status is textual,
not color-only. All actionable controls retain visible keyboard focus. Motion is
optional and must disappear under reduced-motion without losing information.

## Meaningful states

| Surface | Production | Staging | Recovery/action |
| --- | --- | --- | --- |
| Community metrics | verified counts or Evidence Placeholder | qualified fictional metrics | open source or Programs |
| Programs | verified public records | structured fixture catalogue | confirm in Discord |
| Agenda | empty/pending Evidence Placeholder | upcoming/completed/cancelled examples | open Discord/detail |
| Volunteer directory | policy/openings without invented identities | opt-in and anonymous examples | open intake |
| Profile | normal 404 when no approved record | named/anonymous fixture detail | back to directory |
| Stories | approved records or empty state | fictional recap | contribute source material |

## Acceptance criteria

1. The Community content order is `current`, `programs`, `agenda`, `people`,
   `sources`; no public string says Pulse or Denyut komunitas.
2. Program detail proves optional Series, direct Sessions, Program metrics,
   contributor responsibilities, and evidence placeholders.
3. Agenda includes Program Sessions and standalone Events in staging, with
   textual lifecycle state and a safe public action.
4. Volunteer index proves four Positions, seven Divisions, current Cycle,
   continuous recruitment, openings, named opt-in profiles, and anonymous
   stubs.
5. Volunteer detail groups Contributions by Program and contains no personal
   success score or ranking.
6. Production contains no fixture IDs, fictional identities, fictional numbers,
   secret/private Discord fields, or indexable fixture pages.
7. English routes do not mix Indonesian product copy; unsupported locales use
   the existing explicit English fallback.
8. Required routes pass semantic, keyboard, focus, 200% zoom, 1280x720,
   390x844, overflow, reduced-motion, and screenshot review checks.
9. Interface IR, hierarchy report, runtime validator, Astro check, production
   build, unit tests, production Playwright, staging Playwright, and
   `git diff --check` pass before staging deployment.

## Out of scope for this release

- KAD-Agent outbox/projector implementation.
- Cloudflare D1/R2 persistence and APIs.
- Authentication, profile claiming, owner dashboard, and real verification
  links.
- Automated attendance, social-media, repository, or voice activity metrics.
- Production deployment or publication of real volunteer identities.
