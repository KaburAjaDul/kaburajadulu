# KAD public website page system

Status: design contract for the clean redesign branch. This document defines
the page experience before implementation. It does not approve private Discord
evidence, disputed history, personal attribution, social-media image reuse, or
donation collection.

## Product intent

The website should feel like an open front door to a real Indonesian global
community: optimistic enough to invite participation, practical enough to help
someone choose a next step, and accountable enough for volunteers, partners,
and supporters to understand what is active and what is still being verified.

The design retains the strongest parts of the current homepage:

- white space and high-contrast Plus Jakarta Sans typography;
- cobalt blue as the primary action and emphasis color;
- soft, highly rounded cards with purposeful shadows;
- the destination photo collage and Caveat handwritten accent;
- concise copy and one obvious Discord action.

The redesign adds structure, not a replacement personality. It does not reuse
PR20's global dark-paper shell, global body overrides, or unsourced editorial
cards.

## Evidence deconstruction

| Evidence | Status | Observation | Transferable rule | Implementation boundary |
| --- | --- | --- | --- | --- |
| Production desktop and mobile screenshots | Observed | Spacious white page, large direct headline, cobalt actions, playful destination collage, rounded cards | Keep the visual DNA and increase information density gradually below the hero | Screenshots are comparison-only and never bundled |
| `src/styles/global.css`, `Layout.astro`, current home components | Observed | Plus Jakarta Sans, Caveat, `#0055ff`, pill buttons, 32px media radii | Promote these primitives into named tokens and shared components | Preserve existing destination interaction and locale routing |
| Public KADSocialHub source links | Observed | Five program candidates have canonical public posts; current availability and reuse rights are incomplete | Every real program card links to its source and says when availability must be confirmed | Do not hotlink or redistribute social CDN media |
| Discord events and reports | Unknown for publication | Operational evidence exists privately, but no approved public event feed exists | Design complete empty, stale, error, and future published states | No private IDs, messages, links, counts, or media in the website or public evidence docs |
| History, growth, volunteer leadership | Unknown for publication | The desired narrative exists, but dated corroboration and editorial approval are incomplete | Give history a useful evidence-review state before any public timeline claims | No names, growth numbers, disputes, or testimony in runtime fixtures |
| Public support and donation goal | Inferred | Partners need programs, impact, governance, and use-of-funds before a financial ask is credible | Make `/support` an accountability proposal first | No payment or donation collection until finance ownership and policy exist |

## Design language

### Character

**Optimistic field guide.** The system combines the clarity of an editorial
guide with the warmth of a community noticeboard. It should never resemble a
corporate SaaS dashboard or a generic dark community template.

### Tokens

- Paper `#ffffff`; ink `#111318`; cobalt `#0055ff`.
- Supporting fields: sky `#edf4ff`, sun `#ffbd3e`, mint `#dff7eb`.
- Secondary text `#687081`; rules `#dfe4ec`.
- Display typography uses Plus Jakarta Sans at a fluid 42–72px range.
- Caveat is decorative: annotations, arrows, and short labels only.
- Page max width is 1240px; readable prose max width is 720px.
- Cards use 20–32px radii. Interactive controls remain pill-shaped.
- Section spacing is 72px mobile and 112px desktop.
- Shadows indicate a clickable or floating layer, never simple grouping.

### Composition

Pages share a masthead, an editorial page intro, modular content rails, a
cross-link band, and an expanded footer. Each page gets one expressive gesture:
a collage, step rail, calendar spine, timeline, contribution ledger, or support
blueprint. This keeps the family coherent without making every route identical.

## Page family designs

### 1. Home `/`

**Job:** explain KAD in ten seconds and move a newcomer toward a real activity.

1. Existing-style hero with Discord primary action and programs secondary action.
2. Destination collage retained as the visual signature.
3. `Mulai dari sini` three-step rail: discover, participate, contribute.
4. Five source-backed flagship program cards, each with availability text.
5. Event preview in an honest empty state until the public projection exists.
6. Community story teaser labelled as editorial work in progress.
7. Volunteer and support split CTA.

No community-size or impact number is shown until the denominator and approval
are established.

### 2. Community `/community`

**Job:** orient a new member before they enter Discord.

- Hero: `Komunitas bukan cuma server`.
- Three-part participation map: find a room, follow a routine, contribute back.
- Public-channel expectations and safety copy without exposing channel names or
  private moderation workflows.
- Canonical Discord, X, and Instagram destinations.
- `What happens after joining` checklist.

Expressive gesture: a route-map line connecting the three participation stages.

### 3. Programs `/programs`

**Job:** help someone find a recurring learning or career activity.

- Filter chips are real URL anchors, not client-only decorative tabs.
- Program cards expose category, source, current certainty, and the next action.
- Initial source-backed set: French trial, Mandarin Transport, Apple Developer
  Academy session, English + Mandarin weekly clubs, and GKS preparation.
- Unknown capacity, recurrence, registration, and archive status are never
  silently converted into `active`.

Expressive gesture: colour-coded index tabs with a source/status rail.

### 4. Program detail `/programs/{slug}`

**Job:** turn interest into a confident next action.

- Program promise and source-backed facts.
- `Yang sudah diketahui` versus `Konfirmasi di Discord` columns.
- Routine/session format only when a source proves it.
- Canonical source link and Discord action.
- Related programs.

Expressive gesture: a large typographic program marker, created in CSS rather
than copied social artwork.

### 5. Events `/events`

**Job:** show the reliable public schedule.

- Empty state is the initial and truthful state.
- The state explains that schedules are currently confirmed in Discord.
- Future list design supports date spine, timezone, status, program, and source
  revision without changing the page composition.
- Stale and error states remain textual and distinguishable without colour.

Expressive gesture: a calendar spine that remains useful as an empty scaffold.

### 6. Event detail `/events/{id}`

**Job:** provide one approved public record and its documentation.

- Reserved prototype state only; no fake event is rendered.
- Future regions: status/time, summary, registration, approved recap/resources,
  calendar export, source revision, and corrections.
- The static prototype publishes explicit `not-published` and `pending` fixtures;
  all other IDs remain a normal static 404 until the approved event projection
  owns route generation.

Expressive gesture: document tabs and a clear revision stamp.

### 7. Volunteer `/volunteer`

**Job:** explain how work enters, moves through, and leaves a volunteer cycle.

- Anonymous three-month cycle model: intake, program work, handover.
- Program-based teams and explicit work distribution.
- Public volunteer intake remains easy to find.
- Attribution is anonymous by default and labelled as a later opt-in feature.
- No volunteer names or private operational metrics.

Expressive gesture: an operational cycle loop with handover at the seam.

### 8. Stories and history `/stories`, `/about/history`

**Job:** preserve institutional memory without publishing contested material.

- Stories index may expose public source records such as Cerita Aja Dulu only
  after editorial approval.
- History initially renders an evidence-review state and a public correction
  invitation.
- The final timeline requires dated corroboration, metric definitions, editorial
  ownership, attribution approval, and a correction/revocation path.

Expressive gesture: a horizontal growth timeline that remains hidden until the
claims are approved; the placeholder is a visible evidence checklist.

### 9. Impact `/community/impact`

**Job:** show what programs accomplish, with traceable definitions.

- Initial state explains the metric contract instead of showing invented totals.
- Future metrics are grouped into activities, participation, outputs, and
  volunteer contribution.
- Social reach, Discord membership, role counts, attendance, and volunteer hours
  remain separate measures.
- Every published figure needs period, source, denominator, and freshness.

Expressive gesture: an impact ledger rather than a generic dashboard.

### 10. Support `/support`

**Job:** help a prospective partner understand what support would enable.

- Program continuity, documentation infrastructure, volunteer tooling, and
  safety/moderation are the initial support areas.
- `How support is governed` precedes any financial action.
- Contact/community action is available; payment collection is unavailable.
- Future donation capability requires owner, reporting cadence, refund policy,
  accounting boundary, and public use-of-funds reporting.

Expressive gesture: a transparent allocation blueprint with `proposed`, not
`funded`, labels.

### 11. Credits `/community/credits`

**Job:** attribute work without forcing public identity.

- Initial state explains anonymous-by-default credit.
- Future cards support chosen display name, role, program, cycle, scope, expiry,
  and revoked state.
- Public credits never expose Discord IDs or private profiles.

Expressive gesture: a contribution ledger with visible consent state.

### Existing blog routes

The current blog remains part of the ecosystem but is not populated on `main`.
The redesign fixes navigation/SEO composition without inventing posts. A blog
index becomes a later content slice after real entries exist.

## Shared component system

| Component | Purpose | Required states |
| --- | --- | --- |
| Masthead | Brand, four grouped destinations, locale, Discord | desktop, mobile closed/open, RTL |
| Page intro | Eyebrow, H1, summary, dominant action | compact, feature |
| Source chip | Canonical source and freshness/status | public source, approval pending |
| Program card | Program promise and next action | confirm in Discord, recurring confirmed, archived, gated |
| Event state | Public schedule status | empty, loading, published, stale, error |
| Journey rail | Discover → participate → contribute | desktop rail, mobile stack |
| Evidence panel | Explain missing approval/data | pending, approved, revoked |
| Cross-link band | Connect page families | default, high-emphasis |
| Expanded footer | Route index, social sources, Discord | LTR, RTL |

## Responsive and accessibility contract

- Test at 1280×720 and 390×844; inspect full-page screenshots at 1440px and
  390px widths.
- At 200% zoom, content remains readable without two-dimensional scrolling.
- The mobile menu is a disclosure controlled by one button. Escape closes it
  and restores focus to the trigger.
- A skip link is first in the focus order. Focus rings use cobalt plus a white
  offset and remain visible on coloured surfaces.
- Heading levels describe the document, not the card size.
- Status and certainty are always text; colour and icons only reinforce them.
- Arabic uses logical properties and RTL-aware composition, not duplicated
  markup.
- Motion is finite opacity/transform feedback. Reduced motion removes reveals,
  autoplay, and decorative transform changes.

## Runtime and content boundary

- Astro remains static. Shared page data is a checked TypeScript fixture.
- Public source links are implementation-safe; social CDN media is not.
- Event data stays at an empty state until the D1/R2 projection PR.
- Private Discord evidence never enters the public repo, bundle, rendered HTML,
  metadata, screenshots, or test fixtures.
- Page copy is Indonesian-first in this prototype. Existing locale navigation,
  `lang`, `dir`, and route generation remain functional; approved translations
  are a separate content task.

## Acceptance trace

The executable contract must prove:

- 10 page families are represented in navigation/design data;
- 5 public program cards render with canonical source links;
- 0 public events render in the initial state;
- event, history, impact, support, and credits show explicit readiness states;
- all internal routes preserve the locale prefix;
- no private manifest IDs, private Discord labels, or social CDN URLs appear in
  `dist`;
- mobile menu, Escape focus restoration, keyboard traversal, RTL, reduced
  motion, overflow, SEO, build, and screenshots pass.
