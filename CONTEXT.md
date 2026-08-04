# KAD Public Community Content

This context separates verifiable public community records from fictional
preview content used to evaluate the website.

## Language

**Program**:
A repeatable learning or contribution offering supported by a public source.
_Avoid_: Activity, event

**Session**:
One scheduled occurrence of a Program with a time, duration, and timezone.
_Avoid_: Event

**Event**:
A Session or community gathering approved as a public record.
_Avoid_: Raw schedule, Discord event

**Preview Fixture**:
Deterministic fictional content used to evaluate staging without making a claim about KAD.
_Avoid_: Dummy fact, sample member

**Volunteer Profile**:
A contributor's chosen public name and role within a contribution cycle.
_Avoid_: User account, Discord identity

**Volunteer Opportunity**:
An open, bounded community work need with an outcome, commitment, owner, and application path.
_Avoid_: Volunteer Profile, Discord role

**Contribution**:
A bounded piece of community work with a scope, state, and attribution choice.
_Avoid_: Task, activity

**Attribution Consent**:
An explicit choice describing which identity and contribution details may be published.
_Avoid_: General consent

**Evidence Metric**:
A number paired with its definition, period, source, and revision.
_Avoid_: Impact claim, vanity metric

**Published Record**:
An approved Story, Event, or Contribution credit available on the public website.
_Avoid_: Draft, preview

**Public Projection**:
A sanitized, approved website record derived from private operational truth.
_Avoid_: Database replica, Discord export

**Projection Revision**:
A monotonic version used to prevent duplicate or older records from replacing newer public content.
_Avoid_: Edit count

**Tombstone**:
A revocation marker that prevents withdrawn or deleted public content from being restored by a retry or stale cache.
_Avoid_: Hidden flag

**Public Source**:
A safe public provenance label and URL. It never contains a private Discord identifier, message link, or consent-authority reference.
_Avoid_: Internal source reference

**Publication Decision**:
The explicit approval, correction, archival, or withdrawal decision for one public record revision.
_Avoid_: Discord announcement state
