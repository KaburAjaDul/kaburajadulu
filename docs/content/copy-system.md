# KAD copy system

## Audience and task

People in Indonesia looking for a practical first step into study, work, or
community learning abroad should be able to tell what is known, what is
simulated, what needs confirmation, and what action is safe to take next.

Indonesian (`id`) is the source voice. English (`en`) is the complete fallback
for public and shell surfaces until a full translation exists. Other locales
show English inside an explicit `lang="en"` boundary with a quiet translation
notice. One surface never silently mixes Indonesian and English prose.

## Voice direction

Use a practical guide with a warm edge: concrete verbs, humane status language,
and useful actions without campaign pressure. The voice may be conversational,
but uncertainty must stay visible.

| Direction | Hook | Human tone | Desire | CTA | Natural ID | Page fit | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Practical guide | 8 | 8 | 7 | 9 | 9 | 9 | 50 |
| Friendly bulletin | 9 | 9 | 8 | 7 | 9 | 7 | 49 |
| Reflective field notes | 8 | 9 | 7 | 5 | 8 | 6 | 43 |

Approved examples:

- `Pilih kegiatan yang bisa benar-benar kamu tindak lanjuti.`
- `Tahu apa yang berlangsung sebelum menyisihkan waktu.`
- `Setiap kerja punya jejak. Setiap nama tetap pilihan.`

Inner-page headers use the route name as H1 and one plain task summary. They do
not repeat the landing promise. Examples: `Program komunitas`, `Agenda
komunitas`, `Cara kerja relawan`, and `Cerita dan dokumentasi`.

## Product truth table

| Surface | Audience task | Product fact we may state | Unknown or gate |
| --- | --- | --- | --- |
| Community | Understand participation | Three public ways to find a room, follow a routine, and contribute | Private channels and moderation workflows |
| Programs catalogue/detail | Choose an activity | Five source-backed records, known facts, confirmation questions, source, and next action | Live availability, capacity, recurrence, registration, archive freshness |
| Events schedule/detail | Check or read a public event | Date/timezone/status/source only for approved public records | Public projection owner, freshness, corrections, registrations |
| Volunteer | Find useful work now | Intake path, current cycle, open work, handover expectation | Owner, opening count, expiry, personal identity |
| Stories | Read a record | Approved title/body, date, topic, source, revision, editorial state | Editorial approval, media rights, withdrawal SLA |
| History | Assess a historical claim | Evidence-review status and correction invitation | Dated corroboration, owner, attribution, revocation policy |
| Impact | Understand a metric | Definition, period, denominator, method, source, freshness | Approved totals, inclusion/exclusion rules, calculation owner |
| Credits | Inspect attribution | Opt-in scope, chosen display name, role, cycle, expiry, consent state | Identity, consent record, withdrawal timing |
| Support | Evaluate readiness to support | Governance, proposed scope, owner, reporting cadence, accounting boundary | Finance readiness, refund policy, use-of-funds publication |

## Route and component copy map

| Route/component | Product copy | Primary action | Required fallback/state copy |
| --- | --- | --- | --- |
| Community intro | `Komunitas bukan cuma server` plus the three-step orientation | `Lihat cara ikut` / `Gabung Discord` | Public expectations and safe-source explanation |
| Staging metadata | `Data simulasi — hanya untuk review` | None | Never a hero, modal, or promotional CTA |
| Programs catalogue | `Program komunitas` and filter/result language | `Buka program` / `Lihat sumber publik` | `Memuat program`, `Belum ada program di kategori ini`, `Program sedang tidak tersedia` |
| Program detail | `Yang sudah diketahui` / `Yang perlu dikonfirmasi` | `Konfirmasi di Discord` / `Buka sumber publik` | Poster fallback keeps title, status, and source visible |
| Events schedule | `Agenda komunitas` with date, timezone, and status | `Buka detail acara` | `Belum ada agenda publik`, `Jadwal sedang dimuat`, `Agenda perlu ditinjau ulang` |
| Event detail | Record title, status, time, revision, correction path | `Buka pendaftaran` only when present | `Belum dipublikasikan`, `Data acara belum tersedia`, `Catatan ini ditarik` |
| Volunteer | `Cara kerja relawan`; intake, cycle, open work | `Isi minat relawan` | `Siklus berikutnya belum dibuka`, `Pekerjaan ini sudah ditutup` |
| Stories | `Cerita dan dokumentasi`; title, excerpt, date, topic | `Baca cerita` / `Buka sumber` | `Cerita menunggu persetujuan`, `Cerita ini ditarik` |
| History | `Riwayat yang sedang diverifikasi` | `Kirim koreksi` | `Bukti belum cukup untuk timeline publik` |
| Impact | `Dampak dan cara menghitungnya` | `Lihat metode` | `Metode metrik belum disetujui`; no invented total |
| Credits | `Kontribusi yang dipilih untuk ditampilkan` | `Pelajari cara ikut memberi kredit` | `Atribusi dicabut` as a neutral tombstone |
| Support | `Dukungan dan kesiapan tata kelola` | `Hubungi tim` | `Pengumpulan dana belum siap`; no payment action |

Buttons name the action and object. Avoid `Submit`, `Proceed`, `Click here`,
or a generic `Pelajari lebih lanjut` when the consequence is known.

## State coverage matrix

| State | Product treatment | Recovery/next action |
| --- | --- | --- |
| Default/ready | Show route task, certainty, metadata, and one dominant action | Continue to record, source, or intake |
| Loading | Keep heading and route context; say what is loading | Wait or retry when available |
| Empty | Explain why no record is shown; do not imply a broken system | Change filter, open Discord, or return to catalogue |
| Partial/unknown | Separate known facts from confirmation questions | Confirm against the named public source |
| Stale | Keep record readable but label last update and review need | Open source or correction path |
| Error | Say records are unavailable without exposing private fallback | `Coba lagi` or use the public contact path |
| Pending/blocked | Explain the approval/readiness gate | Correction, source review, or wait for owner |
| Revoked/tombstone | Neutral withdrawal language; never blame or reveal identity | Open correction/withdrawal explanation |
| Demo/staging | Quiet `Data simulasi` metadata; fictional records are visibly labelled | Leave staging; no production claim |

## Product copy versus developer notes

Product copy may name a user's task, state, consequence, and recovery path. It
must not expose component names, fixture flags, DTO fields, screenshot review,
database topology, private IDs, media hashes, or projection internals.

Developer-only notes belong in the Interface IR, route evidence, fixtures, test
assertions, or a developer-only overlay. Examples are
`PUBLIC_STAGING_FIXTURES`, `PublicRecordEnvelope`, `sourceRevision`, tombstone
dominance, canonical validator commands, and approved SHA-256 values.

## Glossary

- **Program**: a repeatable activity or pathway.
- **Session**: one occurrence of a program.
- **Event**: a session or gathering approved as a public record.
- **Data simulasi / Demo data**: deterministic fictional staging content.
- **Konfirmasi / Confirm**: the latest status still needs a public source or community confirmation.
- **Atribusi / Attribution**: naming a contributor only within the consented scope.
- **Tombstone**: a neutral withdrawal record that supersedes an older public revision.

## Claims requiring verification

Availability, capacity, registration, dates, participation totals, impact
metrics, historical timelines, personal identity, attribution, and funding
claims require a dated public source, an owner, a revision, and a correction or
withdrawal path before production copy can state them as fact. Unknowns listed
in the page-system evidence deconstruction remain explicit until resolved.
