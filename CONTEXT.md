# KAD Public Community Content

This context separates verifiable public community records from fictional
preview content used to evaluate the website.

## Language

**Program**:
A continuing community offering made up of Sessions. A Program may contain
several structured Series, or Sessions may belong directly to the Program while
its curriculum is still informal.
_Avoid_: Activity, scheduled event

**Series**:
An optional structured sequence within a Program that groups Sessions around a
level, curriculum, cohort, or learning objective.
_Avoid_: Program, category, calendar

**Session**:
One scheduled occurrence belonging to a Program, either directly or through a
Series, with a time, duration, and timezone.
_Avoid_: Program, Discord Scheduled Event

**Event**:
A bounded standalone or collaborative gathering that is not an occurrence of a
continuing Program. Recurring KAD-owned formats are Programs, even when their
individual Sessions are promoted socially as events.
_Avoid_: Program Session, Discord Scheduled Event

**Agenda**:
The chronological public view of upcoming Sessions and Events. Agenda is a
projection of scheduled records, not a record type of its own.
_Avoid_: Event database, Program catalogue

**Discord Scheduled Event**:
The Discord platform representation and join path for a scheduled Session or
Event.
_Avoid_: Event, public source of truth

**Preview Fixture**:
Deterministic fictional content used to evaluate staging without making a claim about KAD.
_Avoid_: Dummy fact, sample member

**Evidence Placeholder**:
A production-safe empty or pending state used when a public claim lacks approved
evidence. It names what is missing without inventing a person, number, status,
or outcome.
_Avoid_: Preview Fixture, estimated fact, unlabeled dummy data

**Volunteer Profile**:
A contributor's opt-in public identity, organizational role, and selected
attributions. No public Volunteer Profile exists without explicit consent.
_Avoid_: Private volunteer record, Discord identity

**Public Contributor Stub**:
The anonymous public projection automatically created for a contributor. It
shows only privacy-safe aggregate metrics until the contributor opts into a
named Volunteer Profile or selected public attributions.
_Avoid_: Volunteer Profile, anonymous Discord account

**Private Volunteer Record**:
The internal record used to associate one person with Division Assignments and
Contribution Attributions. It is not a public profile and may reference private
platform identity only inside the operational boundary.
_Avoid_: Volunteer Profile, public member directory

**Volunteer Opportunity**:
An open, bounded community work need with an outcome, commitment, owner, and application path.
_Avoid_: Volunteer Profile, Discord role

**Volunteer Cycle**:
A three-month reorganization horizon for renewing teams, responsibilities, and
handover. Recruitment may remain open throughout the Cycle and is not the Cycle
itself.
_Avoid_: Hiring window, fixed membership period

**Volunteer Position**:
A person's current level of organizational accountability: Advisor, Community
Manager, Division Lead, or Individual Volunteer. Position is independent from
the Division where the person contributes.
_Avoid_: Discord role, Division

**Advisor**:
A non-executive governance position that provides oversight and advice without
owning daily volunteer execution.
_Avoid_: Inactive admin, honorary title

**Community Manager**:
The head of the executive volunteer organization and lead of its Division
Leads.
_Avoid_: Community moderator, Division

**Division Lead**:
The executive position accountable for one Division. The operational Discord
role may be called Admin, but public organization records use Division Lead.
_Avoid_: Discord administrator permission, Community Manager

**Individual Volunteer**:
An active contributor carrying bounded responsibilities within one or more
Divisions during a Volunteer Cycle.
_Avoid_: Member, follower

**Division**:
An enduring area of volunteer execution. Current Divisions include Study Club,
Tech/Coding Club, Event, Design, Content, Partnership, and Data.
_Avoid_: Volunteer Position, Discord category

**Division Assignment**:
A time-bounded relationship connecting a Volunteer Profile to a Division,
Position, responsibilities, and Volunteer Cycle.
_Avoid_: Permanent rank, Discord role assignment

**Contribution**:
A bounded record of community work with responsible contributors, scope,
outcome, period, evidence, and review state.
_Avoid_: Task assignment, activity log, unverified claim

**Contribution Attribution**:
The traceable credit connecting a Contribution to one or more Private Volunteer
Records, including each person's responsibility and optional public identity.
_Avoid_: Honorary title, leaderboard entry

**Contribution Attestation**:
A verification decision over a Contribution and its attributions. Division
Leads attest Individual Volunteer work; the Community Manager attests Division
Lead and cross-Division work.
_Avoid_: Self-claim, automated detection

**Contribution Review State**:
The explicit confidence state of a Contribution: reported, evidence attached,
verified, corrected, or revoked.
_Avoid_: Completion status, publication status

**Contribution Ledger**:
The auditable history of Contributions across Programs, Events, Divisions, and
Volunteer Cycles. Its coverage may be incomplete and every record retains its
evidence and review state.
_Avoid_: Honorary list, CV claim, activity feed

**Contributor Ledger View**:
The personalized view of the shared Contribution Ledger derived from one
person's Contribution Attributions. It is not a separate copy of the ledger.
_Avoid_: Personal contribution database, public profile

**Contribution Export**:
A portable representation of one contributor's attributed work and derived
metrics, including evidence references and verification status.
_Avoid_: Automatically verified certificate, public profile

**Verification Link**:
An owner-generated, expiring, and revocable capability link that confirms a
selected identity and selected verified Contributions to a third party.
_Avoid_: Permanent private profile, public identity URL

**Attribution Consent**:
An explicit choice describing which identity and contribution details may be published.
_Avoid_: General consent

**Evidence Metric**:
A number paired with its definition, period, source, and revision.
_Avoid_: Impact claim, vanity metric

**Contribution Metric**:
An Evidence Metric derived from work directly attributed to a contributor, such
as verified Sessions facilitated or publication assets completed.
_Avoid_: Organization outcome, popularity score

**Contributor Portfolio**:
A program-grouped presentation of one person's verified Contributions,
responsibilities, evidence, and review states. It does not calculate personal
success or rank contributors.
_Avoid_: Impact score, leaderboard, performance rating

**Program Outcome Metric**:
An Evidence Metric describing the result of a Program, Series, Session, or
Event. It may appear as context on contributor work but is not wholly attributed
to one person.
_Avoid_: Individual impact score, unqualified reach

**Program Success**:
The evidence-backed evaluation of a Program over a defined period. Contributors
may be credited for work within the Program, but Program Success is never
converted into an individual's score.
_Avoid_: Volunteer performance score, contribution count

**Program Metric Contract**:
The small shared set of Evidence Metrics required for every Program, extended
only when a Program has a meaningful program-specific outcome to measure.
_Avoid_: Universal success score, exhaustive analytics schema

**Tech/Coding Club**:
A Program centered on recurring technology sharing Sessions. A Series may also
produce a project repository or other technical artifact, but project delivery
is optional rather than a prerequisite for the Program.
_Avoid_: Software product team, repository leaderboard

**Organization Health Metric**:
An Evidence Metric describing KAD's operational continuity, such as active
Programs, Volunteer Cycle retention, documentation coverage, or verification
timeliness.
_Avoid_: Member vanity count, contributor ranking

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
