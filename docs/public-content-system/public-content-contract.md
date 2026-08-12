# Public content contract (PR0)

This contract is the boundary between KAD's private operational systems and the
public website. It is deliberately small: the first implementation can use
deterministic fixtures, while a later adapter can read the same shape from a
sanitised public projection.

## Canonical terms

- **Program**: a repeatable learning or contribution offering.
- **Session**: one scheduled occurrence of a Program.
- **Event**: a Session or community gathering approved as a public record.
- **Volunteer Opportunity**: a bounded public work need; it is not a person's
  identity profile.
- **Story**: an editorial record with a public source, editorial state, and
  optional approved media.
- **Public Projection**: a sanitised, approved record derived from private
  operational truth.
- **Projection Revision**: a monotonic version for one public entity.
- **Tombstone**: a withdrawal/revocation record that dominates older revisions.
- **Public Provenance**: a safe source label or public URL; never a private
  Discord identifier.

## Common public record envelope

Every record returned by a public repository has this envelope. Page-specific
fields are described below.

```ts
type PublicationState =
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'superseded'
  | 'revoked'
  | 'stale'
  | 'execution_failed';

type Freshness = 'current' | 'aging' | 'stale' | 'unknown';

interface PublicRecordEnvelope {
  id: string;
  kind: 'program' | 'session' | 'event' | 'volunteer_opportunity' | 'story';
  schemaVersion: 1;
  locale: 'id' | 'en' | string;
  visibility: 'public';
  publicationState: PublicationState;
  title: string;
  summary: string;
  revision: number;
  sourceRevision: string;
  publishedAt: string | null;
  updatedAt: string;
  observedAt: string | null;
  freshness: Freshness;
  publicProvenance: PublicProvenance[];
  media: PublicMedia[];
  attributionPublicState: 'not_applicable' | 'anonymous' | 'opted_in';
  correctionPath: string;
  tombstone: boolean;
  demo: boolean;
}

interface PublicProvenance {
  label: string;
  url: string | null;
  observedAt: string | null;
}

interface PublicMedia {
  id: string;
  kind: 'image' | 'document' | 'video';
  url: string;
  alt: string;
  caption: string | null;
  approvedAt: string;
  revision: number;
  width: number | null;
  height: number | null;
  sha256: string | null;
}
```

Internal actor IDs, consent-record IDs, Discord IDs, channel IDs, message IDs,
private URLs, member counts, moderation details, and internal authority
references are forbidden fields in this envelope and in every page-specific
DTO.

## Page-specific DTOs

```ts
interface Program extends PublicRecordEnvelope {
  kind: 'program';
  slug: string;
  category: string;
  categoryId: 'language' | 'career';
  audience: string | null;
  cadence: string | null;
  format: string | null;
  known: string[];
  needsConfirmation: string[];
  nextSessionId: string | null;
  archiveState: 'active' | 'needs_confirmation' | 'archived';
}

interface Event extends PublicRecordEnvelope {
  kind: 'event';
  programId: string | null;
  startsAt: string;
  endsAt: string | null;
  timezone: string; // IANA timezone, e.g. Asia/Jakarta
  format: 'online' | 'in_person' | 'hybrid' | 'unknown';
  locationLabel: string | null;
  registrationUrl: string | null;
  status: 'live' | 'upcoming' | 'completed' | 'cancelled';
}

interface VolunteerOpportunity extends PublicRecordEnvelope {
  kind: 'volunteer_opportunity';
  programId: string | null;
  teamLabel: string;
  outcome: string;
  commitment: string;
  dueAt: string | null;
  openings: number | null;
  state: 'open' | 'full' | 'closed';
  applicationUrl: string | null;
}

interface Story extends PublicRecordEnvelope {
  kind: 'story';
  slug: string;
  excerpt: string;
  body: string;
  publishedDate: string;
  topic: string;
  programId: string | null;
  editorialState: 'featured' | 'published' | 'archived' | 'withdrawn';
}
```

Volunteer profiles and attribution credits are intentionally not part of this
first public record set. They require a separate opt-in and withdrawal drill.

## Repository boundary

The website depends on a repository interface, never on a storage technology:

```ts
interface PublicContentRepository {
  listPrograms(query: ProgramQuery): Promise<RepositoryResult<Program>>;
  getProgram(query: { locale: string; slug: string }): Promise<Program | null>;
}

// Added in later page-family slices, after their DTOs and seed scenarios ship.
interface ExpandedPublicContentRepository extends PublicContentRepository {
  listEvents(query: EventQuery): Promise<RepositoryResult<Event>>;
  listVolunteerOpportunities(query: OpportunityQuery): Promise<RepositoryResult<VolunteerOpportunity>>;
  listStories(query: StoryQuery): Promise<RepositoryResult<Story>>;
}

interface RepositoryResult<T> {
  state: 'loading' | 'ready' | 'empty' | 'stale' | 'error';
  records: T[];
  updatedAt: string | null;
  error: { code: string; message: string } | null;
}
```

PR0 implements the Programs surface of `PublicContentRepository`; Events,
Volunteer Opportunities, and Stories expand the same boundary in their own
vertical slices. The staging adapter is `SeedPublicContentRepository`. The
later adapter is `ApiPublicContentRepository`, backed by the public projection
API. Both adapters for a shipped page family must return the same DTOs and state
vocabulary. The UI may not branch on “seed” versus “live”; it branches only on
record state and freshness.

## Publication lifecycle

```text
draft → review → approved → published → superseded
                              └──────→ revoked
```

`stale` and `execution_failed` describe a published pipeline or record
condition; they are not permission to display an unapproved record.

Rules:

1. Only `published` records are returned by the public API.
2. A withdrawal emits a tombstone with a higher revision and invalidates older
   cache entries.
3. Content approval and media approval are separate decisions.
4. Replaying the same source revision is idempotent.
5. A lower or out-of-order revision is rejected or quarantined.
6. A tombstone always dominates an older published payload.
7. A correction keeps a public correction path and the latest revision.

## Source and freshness rules

Every claim-bearing field must have a dated public source, an owner, a revision,
and a correction path before production publication. The UI shows:

- `current`: within the entity's configured freshness window;
- `aging`: still usable, but due for review;
- `stale`: visible with a stale label and last update, never silently treated as
  current;
- `unknown`: source or observation time is absent; show confirmation guidance.

Freshness windows are policy inputs per entity type, not hard-coded visual
assumptions. Event times always use IANA timezone identifiers. The website's
display timezone is a locale preference, not an implicit `WIB` suffix.

## Deterministic staging clock

Fixtures use an explicit scenario clock, for example:

```ts
const scenario = {
  asOf: '2026-08-04T12:00:00+07:00',
  environment: 'staging',
  demo: true,
};
```

The clock is injected into state derivation and tests. It must not use the
machine clock, so an event cannot remain “live” after the scenario date passes.
Every fixture has a stable ID, revision, source label, and `demo: true` marker.
Staging builds are `noindex`; production fixtures are disabled.

## i18n and content policy

- Indonesian (`id`) is the source voice for KAD community copy.
- English (`en`) is the complete fallback for public and shell content until a
  full translation exists.
- Other locales render English inside an explicit `lang="en"` boundary and show
  a translation notice.
- One surface never silently mixes Indonesian and English prose.
- Dates, times, numbers, labels, empty states, errors, and action names are all
  translated; source URLs and public names remain unchanged.

## Discord/KAD-Agent projection boundary

```text
Discord/staff action
  → KAD-Agent service rules
  → private SQLite operational truth
  → explicit web-publication approval
  → outbox with source revision
  → sanitising projector
  → D1 public read model + R2 approved media
  → website API/snapshot adapter
```

The website never reads Discord directly. There is no generic server/channel
scrape. PR0 must define an allowlist containing stable channel/template/entity
kind, quote/media policy, owner, and expiry. Routine events may only project
automatically if a later policy explicitly permits it; sensitive stories and
identity attribution require separate approval.

The public projector must implement idempotency, monotonic revision checks,
retry/backoff, dead-letter quarantine, cursor/checkpoint state, and last-known-
good snapshots. D1 is a published read model only; KAD-Agent SQLite remains the
operational authority. No D1-to-SQLite writes are allowed in v1.
