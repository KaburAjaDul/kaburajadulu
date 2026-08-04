# KAD full-page evidence deconstruction

This document is the route-family contract for the agreed redesign. It records
what is observed in the current site, what is inferred for the redesign, and
what remains unknown. It is an evidence boundary, not a claim that private
Discord operations are public or that staging fixtures are real activity.

## Audience and success condition

The audience is a person deciding whether to join, attend, help, read, verify,
or support KaburAjaDulu. A successful page lets that person identify the route's
job, current certainty, and next safe action in the first viewport. Community is
the only route allowed an expressive orientation treatment.

## Evidence inventory

| ID | Source | Status | Use | Boundary |
| --- | --- | --- | --- | --- |
| E-01 | `src/components/community-system/CommunityPage.astro` | observed | Existing shared composition and route data | Do not force one visual template onto every page family |
| E-02 | `src/components/community-system/TaskHeader.astro` | observed | Compact title, summary, status facts, and action pattern | Status facts are route-specific, not a universal metric row |
| E-03 | `src/content/community-site.ts` | observed | Five public program records, source links, certainty, and local media | Keep known facts and confirmation questions separate |
| E-04 | `src/content/staging-fixtures.ts` | observed | Deterministic preview lifecycle and demo boundary | Never expose fixture IDs or demo claims in production |
| E-05 | `docs/public-content-system/public-content-contract.md` | inferred | Public record envelope, revision, freshness, provenance, and tombstones | A future API must publish sanitized records only |
| E-06 | User information-first review, 2026-08-04 | observed | Inner pages lead with task information and actions | Decorative hierarchy cannot outrank the route job |
| E-07 | Existing production screenshots and styles | observed | White paper, cobalt actions, rounded media, playful annotation | Preserve visual character without reusing comparison-only captures |
| E-08 | Private Discord/KAD-Agent operational evidence | unknown for publication | Explains why events, history, impact, and attribution need approval | No private IDs, messages, counts, names, or media cross the boundary |

## Route-family contract

| Route | User job | First viewport must show | Required state/evidence | Expressive allowance |
| --- | --- | --- | --- | --- |
| `/community` | Understand what KAD can publicly prove and where to participate | Compact orientation, qualified pulse, five program records, activity state, opt-in people boundary, join action | Five source-backed programs are public; people, events, contributions, and metrics are fictional in staging until an approved projection exists | Flat editorial ledger and text monograms |
| `/programs` | Find a suitable activity | Catalogue count, category filter, certainty, source, next action | Loading, empty, stale, and error guidance | Editorial index accents only |
| `/programs/{slug}` | Decide whether to follow one program | Record title, known/confirm split, availability, source, next action | Source revision/freshness and media fallback | CSS marker; no landing hero |
| `/events` | Check the public schedule | Date spine, timezone, status, program, source revision | Empty first; future loading/upcoming/live/completed/stale/error | Calendar spine remains an information scaffold |
| `/events/{id}` | Read one approved event record | Time/status, summary, registration, revision, corrections | `not-published` and pending remain explicit; tombstones win | Document tabs only after record metadata |
| `/volunteer` | Find how to help now | Intake path, current cycle, open work, handover expectation | Anonymous-by-default attribution and explicit cycle state | Operational cycle loop |
| `/stories` | Read an approved community record | Title, excerpt, published date, topic, source, editorial state | Readable body, freshness, correction/withdrawal path | Editorial rhythm, not campaign proof |
| `/about/history` | Assess whether a historical claim is ready | Evidence-review status, sources, owner, correction invitation | Pending/approved/revoked claim state | Timeline stays hidden until corroborated |
| `/community/impact` | Understand what a metric means | Metric definition, period, denominator, method, source, freshness | Pending contract before totals; stale/error are distinct | Ledger, never an unexplained dashboard |
| `/community/credits` | Inspect contribution attribution | Opt-in scope, display name, role, cycle, expiry, status | Revoked entries render as neutral tombstones; no private IDs | Contribution ledger |
| `/support` | Evaluate support readiness | Governance, proposed scope, owner, reporting cadence, readiness | Ask is unavailable until finance and use-of-funds policy are ready | Allocation blueprint labelled `proposed` |

The staging notice is quiet page metadata: a small text status adjacent to the
page introduction, never a hero, modal, promotional banner, or primary action.
It may explain that deterministic records are fictional and noindex, but it
must not compete with the route's task.

## Product/developer boundary

Product copy names the user's task, state, consequence, and recovery path. It
may say `Data simulasi`, `Konfirmasi di Discord`, `Belum dipublikasikan`,
`Atribusi dicabut`, or `Dukungan belum siap dikumpulkan`. It must not mention
component names, fixture flags, route implementation, screenshot review, or
database topology.

Developer copy belongs in this document, the Interface IR, test fixtures, or an
explicit developer-only overlay. Examples include `PUBLIC_STAGING_FIXTURES`,
DTO/revision terminology, canonical validator commands, private-to-public
projection rules, and media hashes. These notes are not customer-facing copy.

## Unknowns and release blockers

- Public event projection owner, allowlist, freshness window, and correction SLA.
- Approved public member-count definition, denominator, period, method, and
  source; legacy marketing totals remain excluded.
- History source set, date corroboration, editorial owner, and revocation policy.
- Impact metric definitions, denominator, method, period, and source owner.
- Volunteer intake owner, open-work expiry, and current-cycle handover policy.
- Credits consent scope, display-name policy, expiry, and withdrawal handling.
- Support finance owner, accounting boundary, reporting cadence, refund policy,
  and use-of-funds publication path.

Until these are answered, the relevant route must remain in an explicit pending,
empty, stale, or unavailable state. Unknowns must not be converted into counts,
availability, identity, impact, history, or a financial ask.

## Evaluation evidence

The Interface IR at `docs/interface/kad-community-interface.ir.json` carries the
machine-readable route criteria and provenance. The canonical validator is:

```bash
python3 /Users/hamardikan-mac/.codex/skills/engineer-interfaces/scripts/validate_interface.py \
  docs/interface/kad-community-interface.ir.json
```

Route screenshots, browser assertions, and runtime traces may prove rendering;
they do not promote unknown claims or private evidence into product truth.
