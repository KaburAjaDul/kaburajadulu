# KAD Field Station: ASCII redesign draft

Status: `DRAFT FOR HUMAN APPROVAL`

This document is a design proposal, not an implementation record. It does not
change the public website contract, enable live Discord synchronization, or
approve unverified metrics, identities, history claims, media, or donation
flows.

## 1. Design outcome

KaburAjaDulu should feel like a living community dispatch for Indonesians
abroad, not a SaaS directory and not a travel campaign.

The visual language is called **KAD Field Station**:

- editorial enough to carry history, stories, and attribution;
- operational enough to make schedules and joining paths obvious;
- human enough to show people, posters, notes, and incomplete work;
- disciplined enough to distinguish verified records from placeholders;
- route-specific enough that Programs, Agenda, Volunteer, and Stories do not
  look like the same card template.

### What must visibly change

Current baseline:

```text
white page + black headline + blue eyebrow + rounded white cards + blue pills
```

Proposed system:

```text
warm paper + navy ink + ruled editorial grid + indexed records + real artifacts
              + route-specific composition + one restrained action color
```

The redesign fails if a reviewer can still describe every inner page as
"the same rounded-card grid with different text."

## 2. Product truths that design may not change

| Truth | Design consequence |
| --- | --- |
| Public events require no website registration or attendance confirmation. | Agenda cards open details. An upcoming or live detail page owns the Discord handoff. |
| The website is a public discovery and context surface. Discord is where participation continues. | Use one clear Discord conversion at the moment it is useful, not on every module. |
| Volunteer intake is separate from public event participation. | Volunteer uses intake, QA, interview, or a live form only when that path exists. |
| Program success metrics belong to Programs. | Individual profiles show responsibilities and contributions, not personal impact scores. |
| Public identity is opt-in. | Anonymous contributor records remain useful and dignified. |
| Staging data is fictional and deterministic. | Show a quiet metadata disclosure, never a promotional badge or first focal point. |
| History, growth, support, and donation claims require evidence and governance. | Use evidence states and readiness checklists until facts are approved. |
| Only the landing page may use a large emotional hero. | Inner pages start with compact, useful information. |

Canonical public handoff:

```text
PUBLIC_DISCORD_INVITE = https://discord.gg/RUFFbEaeDx
```

Every generic Home, Program, event-fallback, and volunteer Discord action must
resolve through this one constant. CI rejects the retired invite host/path and
checks the rendered link in both locale trees. A live-room URL is a separate,
event-scoped field and must never overwrite the canonical public invite.

## 3. Evidence and uncertainty

| Evidence | Status | Observation | Transferable rule | Boundary |
| --- | --- | --- | --- | --- |
| Current staging, reviewed 2026-08-05 | observed | Inner pages repeat the same white shell, blue kicker, thin rule, rounded panel, and pill action. | Give each route family a distinct content composition. | Preserve current domain behavior while changing visual primitives. |
| Existing landing exploration | observed | Asymmetric destination photography, large type, and editorial annotation had more warmth and identity. | Reuse asymmetry, mixed media scale, and documentary annotation. | Do not copy unlicensed imagery or embed text in images. |
| `docs/interface/page-system.md` | observed | Route jobs, order, states, privacy, and Discord handoffs are already defined. | Visual order must preserve semantic task order. | Do not silently change route contracts. |
| KADSocialHub and approved public documentation | inferred | Posters, event photos, and public records can make the community tangible. | Treat media as evidence with source and date. | Rights, consent, and source must be recorded before production. |
| Live Discord projection | unknown | Automated schedules, participation, and activity status are not implemented. | Design useful empty, pending, and stale states. | Do not present automation as live. |
| Public history and growth timeline | unknown until reviewed | Narrative exists, but dates and attribution still need a dated evidence pass. | Design an evidence-led timeline shell. | Do not publish disputed or unsupported claims. |

## 4. Audience and voice

### Audience sentence

An Indonesian visitor who is curious about study, work, or life abroad, has
probably already searched alone, and needs a credible first conversation rather
than another inspirational promise.

### Voice

```text
calm + concrete + warm + accountable
```

Write like a capable community operator speaking to a new member:

- name what is happening;
- name what the visitor can do;
- name what remains uncertain;
- use ordinary Indonesian;
- never manufacture urgency, prestige, or social proof.

Avoid:

```text
Jelajahi perjalananmu
Temukan kemungkinan tanpa batas
Community pulse
Unlock your potential
Daftar sekarang
Konfirmasi kehadiran
Pelajari lebih lanjut
```

Prefer:

```text
Lihat sesi berikutnya
Buka catatan program
Masuk ke Discord saat sesi dimulai
Lihat bagaimana angka ini dihitung
Tanya tim relawan
Kirim sumber atau koreksi
```

### Landing headline candidates

| Candidate | Angle | Hook | Human | Clarity | CTA fit | Natural ID | Total |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `Mulai dari pertanyaan yang nyata.` | practical field note | 9 | 9 | 9 | 9 | 9 | 45 |
| `Cari tahu sebelum berangkat.` | direct preparation | 9 | 8 | 9 | 8 | 9 | 43 |
| `Temukan orang yang sudah lebih dulu mencoba.` | community proof | 8 | 9 | 8 | 8 | 9 | 42 |

Recommendation: keep **Mulai dari pertanyaan yang nyata.** It is specific to
the community's function without overpromising an outcome.

### Final landing copy draft

```text
Kicker
Ruang publik KAD

Headline
Mulai dari pertanyaan yang nyata.

Supporting copy
Cari program yang masih berjalan, lihat agenda terdekat, atau baca pengalaman
orang lain. Kalau kamu ingin ikut, percakapannya berlanjut di Discord.

Primary action
Masuk ke Discord KAD

Secondary action
Lihat agenda terdekat

Microcopy
Event publik tidak memerlukan pendaftaran atau konfirmasi kehadiran.
```

## 5. Visual system

### 5.1 Color roles

```text
+----------------------+----------+--------------------------------------+
| TOKEN                | VALUE    | ROLE                                 |
+----------------------+----------+--------------------------------------+
| paper                | #F5F1E9  | primary page surface                 |
| paper_bright         | #FFFDF8  | readable inset surface               |
| ink                  | #152132  | primary text and strong rules        |
| ink_muted            | #5C6470  | supporting text                      |
| cobalt               | #155BFF  | primary actions and active selection |
| signal_orange        | #F26A3D  | live, changed, needs attention       |
| verified_mint        | #B7D9B0  | reviewed or verified reinforcement   |
| archive_blue         | #DCE8F8  | records and calm supporting panels   |
| line                 | #C8C5BC  | ordinary dividers                    |
| line_strong          | #152132  | section boundaries                   |
+----------------------+----------+--------------------------------------+
```

Rules:

- cobalt is an action color, not a decorative wash;
- signal orange always appears with text such as `LIVE` or `Perlu ditinjau`;
- verified mint never acts as proof by itself;
- the default page is warm paper, not pure white;
- no purple-blue gradient, generic glass card, or multi-accent rainbow.

### 5.2 Typography

Candidate open-font stack, subject to license and loading review:

```text
DISPLAY / BODY    Archivo Variable
EDITORIAL ACCENT  Newsreader Italic
METADATA / DATA   IBM Plex Mono
```

```text
+----------------------+----------------------+-----------------------------+
| LEVEL                | DESKTOP              | USE                         |
+----------------------+----------------------+-----------------------------+
| display_landing      | 88-112 / 0.90        | landing promise only        |
| h1_inner             | 48-64 / 0.98         | route name or current task  |
| h2_section           | 30-42 / 1.05         | major section decision      |
| h3_record            | 20-28 / 1.15         | program, event, person      |
| body_large           | 20-24 / 1.45         | orientation and lead copy   |
| body                 | 16-18 / 1.55         | normal reading              |
| meta_mono            | 11-13 / 1.35         | date, source, status, code  |
+----------------------+----------------------+-----------------------------+
```

The italic serif is used for one human phrase, quote, or editorial annotation.
It is not applied to every heading.

### 5.3 Grid and geometry

```text
desktop container  : 1320px max, 12 columns, 24px gutters
tablet             : 8 columns
mobile             : 4 columns, 16px page gutter
spacing scale      : 4 8 12 16 24 32 48 72 112
radius controls    : 4-8px
radius records     : 0-12px
radius media       : 0-28px, chosen by crop role
radius pills       : status only, never default container grammar
rule standard      : 1px line
rule emphasis      : 2px ink
```

Use containers only when they communicate one bounded record. Prefer ruled
rows, columns, and media spreads over a grid of equal cards.

### 5.4 Shared visual primitives

```text
[KAD/03]               kode rute dalam mono
[DITINJAU 05 AGU 2026] penanda kebaruan
[BERLANGSUNG]          status teks + tanda oranye
[SUMBER: KADSOCIALHUB] penanda sumber publik
[CATATAN MENUNGGU]     fallback media tipografis
01 / 02 / 03           nomor urut
---------------------  garis pembatas
->                     kelanjutan internal
[external]             external handoff in rendered UI only
```

Shared components:

1. `masthead`: compact navigation and one Discord action.
2. `route_stamp`: route code, locale, update time, and staging disclosure.
3. `ruled_section_header`: title, one sentence, optional contextual action.
4. `dispatch_row`: indexed record with status, facts, and detail action.
5. `source_stamp`: source, review date, and publication state.
6. `archive_thumb`: approved media or typographic pending state.
7. `people_rail`: opt-in portrait or anonymous identity-safe mark.
8. `contribution_row`: responsibility, period, evidence, and review state.

## 6. Information and action hierarchy

```text
L0  environment truth     staging / stale / unavailable
L1  visitor decision      what is here and what can I do now?
L2  current state         next session, open role, latest record
L3  evidence              people, poster, metric, source, date
L4  context               explanation, structure, history
L5  provenance            method, revision, correction, consent
```

L0 must be visible but quiet. It must not outrank L1.

Every first viewport must contain:

```text
1 route identity
1 concrete current fact or honest empty state
1 dominant next action
1 visible evidence or evidence placeholder
```

Action levels:

```text
PRIMARY     one filled rectangular action
SECONDARY   text link with explicit object
TERTIARY    disclosure or source action
STATUS      never styled like an action
```

The masthead Discord link is always a secondary text link. On Home, the filled
hero action is the only primary action. Inner routes may promote a Discord
handoff only when their route contract explicitly permits it.

Wireframe notation uses square brackets for controls and media placeholders.
All visitor-facing examples in the Indonesian frames must ship in Indonesian;
English words used only to name an implementation primitive are not product
copy and must not be rendered.

## 7. Shared shell

### Desktop

```text
+------------------------------------------------------------------------------+
| #KABURAJADULU   KOMUNITAS  PROGRAM  AGENDA  RELAWAN  CATATAN   ID  DISCORD ->|
+------------------------------------------------------------------------------+
| KAD/RUTE   | DITINJAU: TANGGAL | STATUS SUMBER        [PRATINJAU: DATA CONTOH]|
+------------------------------------------------------------------------------+
|                                                                              |
| PAGE-SPECIFIC COMPOSITION                                                    |
|                                                                              |
+------------------------------------------------------------------------------+
| DISCORD | KADSOCIALHUB | INSTAGRAM | SUMBER & KOREKSI | PRIVASI              |
+------------------------------------------------------------------------------+
```

### Mobile

```text
+--------------------------------------+
| #KAD                  [MENU] DISCORD ->|
+--------------------------------------+
| KAD/RUTE  DIPERBARUI TANGGAL         |
| [data contoh, khusus pratinjau]      |
+--------------------------------------+
| route-specific content               |
| semantic order never changes         |
+--------------------------------------+
| compact source and legal links       |
+--------------------------------------+
```

Locale and route discovery rules:

- `ID` is a labelled language control, not an unexplained badge. Opening it
  exposes every supported locale; the selected locale has `aria-current` and
  switching preserves the equivalent route when one exists.
- The primary masthead stays limited to Community, Programs, Agenda,
  Volunteer, and Stories. History, Impact, Credits, Support, privacy, sources,
  and corrections remain discoverable in the expanded footer and mobile menu.
- The Indonesian and English copy maps include navigation, statuses, filters,
  dates, state messages, source labels, and action labels, not only H1 copy.
- A missing translation uses the complete English surface and marks the
  language boundary. It never mixes Indonesian and English within one module.

## 8. Route wireframes

All wireframes show semantic order. Decorative placement must not reorder the
DOM or keyboard path.

### 8.1 Home: departure atlas

Primary task: choose an entry point and understand that participation continues
in Discord.

Desktop, 1440 x 900:

```text
+------------------------------------------------------------------------------+
| #KABURAJADULU   KOMUNITAS  PROGRAM  AGENDA  RELAWAN       ID  DISCORD ->     |
+------------------------------------------------------------------------------+
| KAD/00  RUANG PUBLIK UNTUK INDONESIA DI LUAR NEGERI                          |
|                                                                              |
|  Mulai dari pertanyaan              +--------------------------------------+ |
|  yang nyata.                        | JAKARTA  ->  SEOUL  ->  TOKYO         | |
|                                     |                                      | |
|  Cari program yang masih berjalan,  | [ASYMMETRIC CITY PHOTO / HALFTONE]   | |
|  lihat agenda terdekat, atau baca   |                                      | |
|  pengalaman orang lain.             | TOKYO / CITY 02 OF 06                | |
|                                     | member note + source/date stamp      | |
|  [MASUK KE DISCORD KAD]             +--------------------------------------+ |
|  Lihat agenda terdekat ->                    [prev] [pause] [next]            |
|  Event publik tidak perlu daftar atau konfirmasi kehadiran.                   |
+--------------------------+--------------------------+--------------------------+
| SEKARANG                 | PROGRAM                  | CATATAN                  |
| [BERLANGSUNG] Japanese N5| Korean Study Club        | Dari satu siklus belajar |
| 20:00 WIB -> detail      | next: TOPIK prep ->      | 02 Aug -> baca           |
+--------------------------+--------------------------+--------------------------+
| 01 / KOTA-KOTA KAD                                                          |
|                                                                              |
| [SEOUL: LARGE PHOTO]       [TOKYO: TALL]   [SINGAPORE: OVAL]                 |
|                            [BERLIN: WIDE PHOTO]                              |
+------------------------------------------------------------------------------+
```

Mobile, 390 x 844:

```text
+--------------------------------------+
| #KAD                  [MENU] DISCORD ->|
+--------------------------------------+
| KAD/00  RUANG PUBLIK KAD             |
|                                      |
| Mulai dari                           |
| pertanyaan yang                      |
| nyata.                               |
|                                      |
| Cari program, agenda, dan pengalaman |
| yang bisa kamu tindak lanjuti.       |
|                                      |
| [MASUK KE DISCORD KAD]               |
| Lihat agenda terdekat ->             |
| Tidak perlu daftar atau konfirmasi.  |
|                                      |
| [CITY PHOTO / TOKYO]                 |
| TOKYO  02/06       [pause] [next]    |
+--------------------------------------+
| SEKARANG                             |
| [BERLANGSUNG] Japanese N5 20:00 ->   |
+--------------------------------------+
| [PROGRAM] [CATATAN] [KOTA]           |
| daftar mendatar; bisa digeser atau   |
| dipilih dengan tombol panah          |
+--------------------------------------+
```

Motion:

- city transition: 500ms opacity + 12px translate, ease-out;
- autoplay interval: 6 seconds;
- pause on hover, focus, visibility loss, and explicit pause;
- reduced motion: no autoplay, manual city selection remains.

Every city image exposes a quiet `Foto / pemilik / lisensi / ditinjau` source
line below its caption. That line may collapse into a labelled disclosure on
mobile, but its accessible name and source link remain available.

The mobile Program, Catatan, and Kota strip is a labelled horizontal list of
native links, not a gesture-only carousel. Arrow controls are keyboard
operable, its label is announced, and swiping is merely an additional input.

### 8.2 Community: current briefing

Primary task: see what is active, what is next, and who is doing the work.

Desktop, 1440 x 900:

```text
+------------------------------------------------------------------------------+
| KAD/01  RINGKASAN KOMUNITAS       DATA CONTOH    DITINJAU 05 AGU 2026         |
+------------------------------------------------------------------------------+
| Komunitasnya terlihat dari           | YANG BERIKUTNYA                       |
| yang berjalan.                       |                                        |
|                                      | 10 AGU / 20:00 WIB                    |
| Bukan dashboard. Ini ringkasan       | Japanese N5                           |
| kegiatan dan catatan yang tersedia.  | Sesi program / Akan datang            |
|                                      | Buka detail ->                        |
+----------------------+---------------+----------------------------------------+
| 12 sesi              | 8 catatan     | 3 program                              |
| Jan-Jun 2026         | Siklus 02     | per 05 Agu 2026                         |
| definisi+sumber ->   | definisi+sumber -> | definisi+sumber ->                   |
+----------------------+---------------+----------------------------------------+
| PROGRAM YANG BISA DIIKUTI            | ORANG DI BALIK KEGIATAN               |
|                                      |                                        |
| 01 Japanese Study Club    berikut -> | [N] Nara       pemandu Program         |
|    N5 / N4-N3 / N2-N1               | [?] Anonim     recap Session           |
| 02 English Study Club     berikut -> | [M] Maya       relawan Data            |
| 03 Tech/Coding Club       berbagi    |                                        |
|                                      | Lihat direktori relawan ->             |
| Lihat semua program ->               | Atribusi publik bersifat opt-in.       |
+--------------------------------------+----------------------------------------+
| SUMBER PUBLIK: DISCORD / KADSOCIALHUB / INSTAGRAM / CATATAN                 |
+------------------------------------------------------------------------------+
```

Mobile, 390 x 844:

```text
+--------------------------------------+
| KAD/01  KOMUNITAS                    |
| ditinjau 05 Agu 2026                 |
|                                      |
| Komunitasnya terlihat dari           |
| yang berjalan.                       |
| Ringkasan kegiatan dan catatan yang  |
| tersedia.                            |
+--------------------------------------+
| YANG BERIKUTNYA                      |
| 10 AGU / 20:00 WIB                   |
| Japanese N5        Buka detail ->    |
+--------------------------------------+
| 12 sesi / Jan-Jun 2026               |
| 8 catatan / Siklus 02                |
| 3 program / per 05 Agu 2026          |
| Definisi dan sumber ->               |
+--------------------------------------+
| PROGRAM                              |
| 01 Japanese Study Club ->            |
| 02 English Study Club ->             |
| 03 Tech/Coding Club ->               |
+--------------------------------------+
| ORANG                                |
| [N] Nara  [?] Anonymous  [M] Maya -> |
| Atribusi publik bersifat opt-in.     |
+--------------------------------------+
```

The first viewport must include one agenda record and visible people. Metrics
must not consume the whole screen.

### 8.3 Programs: programme index

Primary task: choose a continuing Program by purpose, structure, and next known
Session.

Desktop, 1440 x 900:

```text
+------------------------------------------------------------------------------+
| KAD/02  PROGRAM                                05 CATATAN PUBLIK              |
+------------------------------------------------------------------------------+
| Pilih sesuatu untuk diikuti.                                                |
| Setiap Program berisi Session. Beberapa sudah tersusun menjadi Series.       |
|                                                                              |
| FILTER: [SEMUA]  BAHASA  KARIER  TEKNOLOGI        Cari program [__________] |
+------------------------------------------------------------------------------+
| 01  [POSTER 4:3]  JAPANESE STUDY CLUB              AKTIF                   |
|                    Program belajar bahasa Jepang bertahap.                   |
|                    SERIES  N5 / N4-N3 / N2-N1                               |
|                    SESI BERIKUTNYA  10 AGU 2026 / 20:00 WIB                  |
|                    Buka program ->                       SUMBER: POST PUBLIK |
+------------------------------------------------------------------------------+
| 02  [POSTER 4:3]  ENGLISH STUDY CLUB               AKTIF                   |
|                    Latihan percakapan dengan ritme informal.                 |
|                    SESSION LANGSUNG / TANPA SERIES                           |
|                    Buka program ->                                           |
+------------------------------------------------------------------------------+
| 03  [CATATAN      TECH/CODING CLUB               SESI BERBAGI               |
|      MENUNGGU]     Sesi berbagi dan project repo bila sudah ditinjau.        |
|                    Buka program ->                       REPO: BELUM TERBIT   |
+------------------------------------------------------------------------------+
```

Mobile, 390 x 844:

```text
+--------------------------------------+
| KAD/02  PROGRAMS                     |
| Pilih sesuatu untuk diikuti.         |
| Program, Series, dan Session.        |
|                                      |
| [SEMUA] [BAHASA] [KARIER]            |
| Cari [__________________________]    |
+--------------------------------------+
| 01  JAPANESE STUDY CLUB    AKTIF     |
| [POSTER / 4:3]                       |
| N5 / N4-N3 / N2-N1                  |
| Berikutnya: 10 Agu / 20:00 WIB       |
| Buka program ->                      |
+--------------------------------------+
| 02  ENGLISH STUDY CLUB     AKTIF     |
| [POSTER / 4:3]                       |
| Session langsung                     |
| Buka program ->                      |
+--------------------------------------+
```

Empty result copy:

```text
Belum ada program di kategori ini.
Coba kategori lain atau lihat semua program.
[LIHAT SEMUA PROGRAM]
```

### 8.4 Program detail: dossier

Primary task: understand one Program and decide whether to continue in Discord.

```text
+------------------------------------------------------------------------------+
| <- SEMUA PROGRAM           KAD/02.01                AKTIF / TANGGAL TINJAU  |
+------------------------------------------------------------------------------+
| [PROGRAM POSTER]        JAPANESE STUDY CLUB                                 |
|                         Belajar bahasa Jepang melalui rangkaian sesuai level.|
|                         Untuk anggota yang ingin belajar rutin bersama.      |
|                                                                              |
| [MASUK KE DISCORD KAD]  Tidak perlu daftar atau konfirmasi kehadiran.        |
+-------------------------+----------------------------------------------------+
| SERIES                  | SESSION BERIKUTNYA                                 |
| [N5]                    | 10 AGU  20:00 WIB  Japanese N5 / Session 01 ->      |
| [N4-N3]                 | 17 AGU  20:00 WIB  Japanese N5 / Session 02 ->      |
| [N2-N1]                 | Belum ada Session yang disetujui                   |
+-------------------------+----------------------------------------------------+
| CATATAN PROGRAM / DATA CONTOH                                                 |
| 12 Session / Jan-Jun 2026 | 41 kehadiran / log acara | 8 recap / Siklus 02  |
| Definisi, periode, metode, dan sumber ->                                      |
+------------------------------------------------------------------------------+
| JEJAK KONTRIBUSI                   | DOKUMENTASI                              |
| Nara / pemandu / Siklus 03         | [FOTO] [POSTER] [CATATAN SESSION]       |
| Anonim / recap / Siklus 03         | sumber dan tanggal pada setiap artefak |
+------------------------------------------------------------------------------+
```

Mobile, 390 x 844:

```text
+--------------------------------------+
| <- PROGRAM  AKTIF / TANGGAL TINJAU   |
| [PROGRAM POSTER / 4:3]               |
| JAPANESE STUDY CLUB                  |
| Belajar sesuai rangkaian level.      |
+--------------------------------------+
| SESSION BERIKUTNYA                   |
| 10 AGU / 20:00 WIB / Japanese N5     |
| [MASUK KE DISCORD KAD]               |
| Tidak perlu daftar atau konfirmasi.  |
+--------------------------------------+
| SERIES                               |
| N5 ->  N4-N3 ->  N2-N1 ->            |
+--------------------------------------+
| CATATAN PROGRAM / DATA CONTOH        |
| 12 Session / Jan-Jun 2026            |
| 41 kehadiran / catatan event         |
| Definisi, metode, dan sumber ->       |
+--------------------------------------+
| KONTRIBUSI -> DOKUMENTASI ->         |
+--------------------------------------+
```

### 8.5 Agenda: dispatch schedule

Primary task: see what happens next and open the correct detail record.

Desktop, 1440 x 900:

```text
+------------------------------------------------------------------------------+
| KAD/03  AGENDA                          ZONA WAKTU: WIB / UBAH                |
+------------------------------------------------------------------------------+
| Jadwal yang bisa kamu datangi.                                               |
| Tidak perlu daftar atau konfirmasi. Buka detail, lalu masuk saat dimulai.    |
+----------+------------+-------------------------------+-----------------------+
| TANGGAL  | STATUS     | CATATAN                       | HUBUNGAN              |
+----------+------------+-------------------------------+-----------------------+
| 10 AGU   | AKAN DATANG| Japanese N5 / Session 01      | Japanese / N5         |
| 20:00    | titik oranye| 60 menit                      | Buka detail ->        |
+----------+------------+-------------------------------+-----------------------+
| 12 AGU   | AKAN DATANG| English conversation          | English / langsung    |
| 19:30    |            | 45 menit                      | Buka detail ->        |
+----------+------------+-------------------------------+-----------------------+
| 14 AGU   | ACARA      | Kolaborasi beasiswa           | Acara mandiri         |
| 20:00    |            | Stage publik                  | Buka detail ->        |
+----------+------------+-------------------------------+-----------------------+
| CATATAN SELESAI / 06                                                 BUKA -> |
+------------------------------------------------------------------------------+
```

The index contains no Discord join CTA.

Mobile, 390 x 844:

```text
+--------------------------------------+
| KAD/03  AGENDA            WIB [ubah] |
| Jadwal yang bisa kamu datangi.       |
+--------------------------------------+
| 10 AGU / 20:00                       |
| [AKAN DATANG] Japanese N5            |
| Japanese Study Club / N5             |
| Buka detail ->                       |
+--------------------------------------+
| 12 AGU / 19:30                       |
| [AKAN DATANG] English conversation   |
| English Study Club                   |
| Buka detail ->                       |
+--------------------------------------+
```

### 8.6 Event detail: participation handoff

```text
+------------------------------------------------------------------------------+
| <- AGENDA       KAD/03.01       AKAN DATANG    DITINJAU 05 AGU              |
+------------------------------------------------------------------------------+
| 10 AGU 2026 / 20:00-21:00 WIB        Japanese N5 / Session 01               |
|                                                                              |
| Sesi pertama untuk rangkaian N5.                                              |
| Program: Japanese Study Club                                                  |
| Series: N5                                                                    |
| Format: Discord voice/stage                                                   |
|                                                                              |
| [GABUNG KAD UNTUK IKUT]                                                       |
| Tidak perlu mendaftar atau mengonfirmasi kehadiran.                           |
+------------------------------------------------------------------------------+
| YANG AKAN DILAKUKAN         | SUMBER / KOREKSI                                |
| topik, host jika disetujui  | status sumber / tanggal tinjau / kirim koreksi |
+------------------------------------------------------------------------------+
```

Lifecycle action rules:

```text
AKAN DATANG -> Masuk ke KAD untuk mengikuti acara
BERLANGSUNG -> Masuk ruang live hanya jika URL publik yang disetujui tersedia
SELESAI     -> Tanpa aksi masuk; tampilkan recap hanya jika sudah ditinjau
DIBATALKAN  -> Tanpa aksi masuk; pertahankan catatan pembatalan
MENUNGGU    -> Tanpa aksi masuk; jelaskan gerbang publikasi
```

Mobile, 390 x 844:

```text
+--------------------------------------+
| <- AGENDA  AKAN DATANG / DITINJAU    |
| 10 AGU / 20:00-21:00 WIB            |
| Japanese N5 / Session 01             |
| Japanese Study Club / N5             |
+--------------------------------------+
| Sesi pertama untuk rangkaian N5.     |
| Format: Discord voice/stage          |
| [GABUNG KAD UNTUK IKUT]              |
| Tidak perlu daftar atau konfirmasi.  |
+--------------------------------------+
| YANG AKAN DILAKUKAN                  |
| topik / host jika disetujui          |
+--------------------------------------+
| SUMBER / KOREKSI ->                  |
+--------------------------------------+
```

Concrete lifecycle variants, desktop and mobile use the same semantic order:

```text
BERLANGSUNG / URL RUANG LIVE DISETUJUI
+------------------------------------------------------------------------------+
| [BERLANGSUNG] Japanese N5 / 20:00-21:00 WIB                                  |
| [MASUK KE RUANG LIVE]  Ruang ini sudah dibuka oleh host.                     |
+------------------------------------------------------------------------------+

BERLANGSUNG / URL RUANG LIVE BELUM TERSEDIA
+------------------------------------------------------------------------------+
| [BERLANGSUNG] Japanese N5 / 20:00-21:00 WIB                                  |
| Tautan ruang live belum tersedia. [BUKA SERVER KAD]                          |
| Tautan cadangan memakai invite publik yang sudah disetujui.                  |
+------------------------------------------------------------------------------+

MENUNGGU TINJAUAN
+------------------------------------------------------------------------------+
| [MENUNGGU] Detail acara belum lolos tinjauan sumber.                         |
| Tidak ada aksi masuk. [KEMBALI KE AGENDA]                                    |
+------------------------------------------------------------------------------+

DIBATALKAN
+------------------------------------------------------------------------------+
| [DIBATALKAN] Acara tidak berlangsung. Catatan waktunya tetap disimpan.       |
| Tidak ada aksi masuk. [KEMBALI KE AGENDA]                                    |
+------------------------------------------------------------------------------+
```

On mobile, each variant becomes one linear status block: status, event title,
time, literal explanation, then its single valid action. The fallback public
invite is `https://discord.gg/RUFFbEaeDx`; it is never labelled as the live
room. If the invite itself is unavailable, replace the action with `Tautan
Discord sedang tidak tersedia` and keep the page useful without a dead button.

### 8.7 Volunteer: roster and intake ledger

Primary task: see useful work that is open now and understand responsibility.

Desktop, 1440 x 900:

```text
+------------------------------------------------------------------------------+
| KAD/04  DAFTAR RELAWAN                           SIKLUS 03 / JUL-SEP 2026     |
+------------------------------------------------------------------------------+
| Bantu bagian yang sedang butuh orang.  | STATUS PENERIMAAN                     |
| Ambil satu tanggung jawab dengan       | JALUR KHUSUS BELUM TERVERIFIKASI      |
| lingkup dan handover yang jelas.       | [TANYA TIM RELAWAN DI DISCORD]        |
|                                        | Tidak menjanjikan role atau interview.|
+------------------------------------------------------------------------------+
| PEKERJAAN YANG TERBUKA                                                       |
|                                                                              |
| 01 KONTEN        Edit satu recap Session    2 jam/minggu    Tanya tim ->     |
| 02 DATA          Tinjau satu sumber metrik  kecil/siklus    Tanya tim ->     |
| 03 TEKNOLOGI     Bantu satu sesi berbagi    bulanan         Tanya tim ->     |
+------------------------------------------------------------------------------+
| STRUKTUR ORGANISASI                      | ORANG                               |
|                                          |                                     |
| ADVISOR                                  | [N] Nara / pemandu Program         |
|   -> COMMUNITY MANAGER                   | [?] Anonim / relawan Acara         |
|      -> LEAD DIVISI                      | [M] Maya / Data                    |
|         -> RELAWAN INDIVIDU              |                                     |
|                                          | Buka daftar ->                      |
| Study / Tech / Event / Design / Konten   | Identitas publik bersifat opt-in.  |
| Partnership / Data                       |                                     |
+------------------------------------------------------------------------------+
```

Mobile, 390 x 844:

```text
+--------------------------------------+
| KAD/04  VOLUNTEER                    |
| Siklus 03 / Jul-Sep 2026             |
|                                      |
| Bantu bagian yang sedang             |
| butuh orang.                         |
| Ambil satu tanggung jawab yang jelas.|
| [TANYA TIM RELAWAN DI DISCORD]       |
| Jalur khusus belum terverifikasi.    |
+--------------------------------------+
| PEKERJAAN TERBUKA                    |
| 01 Edit recap Session ->             |
| 02 Tinjau sumber metrik ->           |
| 03 Bantu sesi berbagi ->             |
+--------------------------------------+
| STRUKTUR                             |
| Advisor                              |
| Community Manager                   |
| Division Lead                       |
| Individual Volunteer                |
+--------------------------------------+
| ORANG [N] [?] [M] ->                |
+--------------------------------------+
```

Volunteer intake is driven by a verified availability field:

```text
intake_path = verified_form     -> [MULAI PROSES RELAWAN]
intake_path = verified_channel  -> [BUKA CHANNEL PENERIMAAN RELAWAN]
intake_path = generic_invite    -> [TANYA TIM RELAWAN DI DISCORD]
intake_path = unavailable       -> Penerimaan belum memiliki jalur publik.
```

The generic invite never claims that an interview channel, form, or automatic
role assignment exists. The chosen path, owner, and last verification date are
part of the fixture and production record.

### 8.8 Volunteer profile: contribution dossier

```text
+------------------------------------------------------------------------------+
| <- DAFTAR RELAWAN       KAD/04.PERSON     IDENTITAS PUBLIK: OPT-IN           |
+------------------------------------------------------------------------------+
| [PORTRAIT]  NARA                                                              |
|             Pemandu Program / Study Club                                      |
|             Siklus aktif: Siklus 03                                           |
|             Tanggung jawab: persiapan, fasilitasi, handover Session            |
+------------------------------------------------------------------------------+
| LEDGER KONTRIBUSI, DIKELOMPOKKAN PER PROGRAM                                  |
|                                                                              |
| JAPANESE STUDY CLUB                                                           |
| Jul-Sep 2026  | Pemandu Session | bukti tersedia | ditinjau                  |
| Agu 2026      | Recap Session   | dilaporkan      | menunggu tinjauan        |
|                                                                              |
| CERITA AJA DULU                                                              |
| Agu 2026      | Moderator stage | terverifikasi    | sumber ->                |
+------------------------------------------------------------------------------+
| Catatan ini menjelaskan tanggung jawab, bukan skor dampak individu.           |
+------------------------------------------------------------------------------+
```

Anonymous profile treatment:

```text
[?] Kontributor anonim
Identitas tidak ditampilkan.
Kontribusi ditampilkan dalam periode dan lingkup yang sudah diagregasi.
Catatan tetap berguna tanpa tanggal, role, atau sumber yang dapat mengungkap
siapa orangnya.
```

Consent applies to each contribution, not only to the profile. Every ledger
entry stores an independently revocable disclosure scope:

```text
identity_visibility     named | pseudonymous | anonymous
program_visibility      exact | category_only | hidden
role_visibility         exact | generalized | hidden
period_visibility       exact | month | cycle | hidden
evidence_visibility     public_link | reviewer_only | hidden
metric_visibility       public | private
consent_reviewed_at     ISO date
```

For anonymous records, the public default is Program category, generalized
responsibility, and Cycle-level period. Exact dates, event combinations,
source links, rare roles, and small-group counts are hidden or aggregated when
they can reasonably re-identify someone. Recruiter proof may use a private,
holder-controlled verification link without broadening the public record.

Mobile, 390 x 844:

```text
+--------------------------------------+
| <- DAFTAR  IDENTITAS PUBLIK: OPT-IN  |
| [POTRET] NARA                        |
| Pemandu Program / Study Club         |
| Siklus 03                            |
+--------------------------------------+
| TANGGUNG JAWAB                       |
| persiapan / fasilitasi / handover    |
+--------------------------------------+
| LEDGER KONTRIBUSI                    |
| JAPANESE STUDY CLUB                  |
| Jul-Sep / pemandu / ditinjau ->      |
| Agu / recap / menunggu tinjauan ->   |
+--------------------------------------+
| Bukan skor dampak individu.          |
+--------------------------------------+
```

### 8.9 Stories: field notes archive

Primary task: read documented context and trace it to related records.

Desktop, 1440 x 900:

```text
+------------------------------------------------------------------------------+
| KAD/05  FIELD NOTES                              EDITORIAL ARCHIVE            |
+------------------------------------------------------------------------------+
| Catatan dari orang yang menjalankannya.                                      |
| Cerita diterbitkan setelah sumber, izin, dan tinjauan editorial tersedia.    |
+----------------------------------------------+-------------------------------+
| [FOTO ACARA DISETUJUI / BESAR]               | PILIHAN / 02 AGU 2026         |
|                                              |                               |
|                                              | Catatan belajar dari satu     |
|                                              | siklus.                       |
|                                              |                               |
|                                              | Japanese Study Club           |
| SUMBER: PUBLIK / DITINJAU                    | Baca catatan ->               |
+----------------------------------------------+-------------------------------+
| ARCHIVE                                                                      |
| 01  24 JUL  Cerita dari sesi percakapan      English Study Club       ->    |
| 02  18 JUL  Apa yang berubah setelah review  Volunteer Cycle 02       ->    |
| 03  03 JUL  Catatan satu project kecil       Tech/Coding Club         ->    |
+------------------------------------------------------------------------------+
```

Mobile, 390 x 844:

```text
+--------------------------------------+
| KAD/05  FIELD NOTES                  |
| Catatan dari orang yang              |
| menjalankannya.                      |
| sumber + izin + tinjauan editorial   |
+--------------------------------------+
| [FOTO PILIHAN / 4:3]                 |
| 02 AGU 2026                          |
| Catatan belajar dari satu siklus.    |
| Japanese Study Club                  |
| Baca catatan ->                      |
+--------------------------------------+
| ARCHIVE                              |
| 24 JUL  Cerita dari sesi... ->       |
| 18 JUL  Setelah review... ->         |
| 03 JUL  Project kecil... ->          |
+--------------------------------------+
```

### 8.10 Story detail: long-form field note

```text
+------------------------------------------------------------------------------+
| <- CATATAN LAPANGAN  KAD/05.01       DITINJAU / 02 AGU 2026                |
+------------------------------------------------------------------------------+
| Catatan belajar dari satu siklus.        | CATATAN TERKAIT                  |
|                                          | Japanese Study Club              |
| [RINGKASAN]                              | Session 01                       |
|                                          | 2 kontribusi relawan            |
| [FOTO UTAMA DISETUJUI + SUMBER]          |                                 |
|                                          | SUMBER                           |
| ISI, PANJANG BARIS 60-70 KARAKTER        | Post publik / editor            |
|                                          | Kirim koreksi ->                |
| [KUTIPAN HUMANIS / NEWSREADER ITALIC]    |                                 |
|                                          |                                 |
| ISI BERLANJUT                            |                                 |
+------------------------------------------------------------------------------+
```

Mobile, 390 x 844:

```text
+--------------------------------------+
| <- CATATAN  DITINJAU / 02 AGU        |
| Catatan belajar dari satu siklus.    |
| Japanese Study Club                  |
+--------------------------------------+
| [FOTO UTAMA DISETUJUI / 4:3]         |
| SUMBER: POST PUBLIK / TANGGAL        |
+--------------------------------------+
| Ringkasan                            |
|                                      |
| Isi dengan panjang baris nyaman.     |
|                                      |
| "Satu kutipan yang terasa manusia." |
|                                      |
| Isi berlanjut.                       |
+--------------------------------------+
| CATATAN TERKAIT -> SUMBER ->         |
+--------------------------------------+
```

### 8.11 Secondary record pages

#### History: evidence timeline

```text
+------------------------------------------------------------------------------+
| KAD/06  RIWAYAT                          TINJAUAN BUKTI BERLANGSUNG           |
+------------------------------------------------------------------------------+
| Riwayat yang sedang diverifikasi.                                           |
| Timeline hanya memuat peristiwa yang memiliki tanggal, sumber, dan owner.    |
+----------+------------------------------+------------------------------------+
| TANGGAL  | PERISTIWA                    | STATUS BUKTI                       |
+----------+------------------------------+------------------------------------+
| {tanggal}| {tonggak disetujui}          | ditinjau / sumber ->              |
| {tanggal}| {klaim menunggu bukti}       | menunggu / kirim sumber ->        |
+----------+------------------------------+------------------------------------+
```

Do not insert names, growth figures, or leadership claims until the evidence
review and attribution decision are approved.

#### Impact: method-first report

```text
+------------------------------------------------------------------------------+
| KAD/07  DAMPAK                           PERIODE / TINJAUAN TERAKHIR          |
+------------------------------------------------------------------------------+
| Dampak dan cara menghitungnya.                                               |
|                                                                              |
| PROGRAM             NILAI        DEFINISI         METODE / SUMBER           |
| Japanese Study      {nilai}      {definisi}       buka metode ->            |
| Cerita Aja Dulu     {nilai}      {definisi}       buka metode ->            |
| Siklus Relawan      {nilai}      {definisi}       buka metode ->            |
+------------------------------------------------------------------------------+
```

No unsupported community-wide vanity number should outrank Program evidence.

#### Credits: attribution directory

```text
+------------------------------------------------------------------------------+
| KAD/08  ATRIBUSI                         ATRIBUSI PUBLIK BERSIFAT OPT-IN      |
+------------------------------------------------------------------------------+
| Kontribusi yang dipilih untuk ditampilkan.                                   |
|                                                                              |
| NAMA / ANONIM | ROLE | SIKLUS | PROGRAM | KONTRIBUSI ->                    |
+------------------------------------------------------------------------------+
| ATRIBUSI DICABUT                                                           |
| Atribusi dicabut. Identitas dan lingkup lama tidak lagi ditampilkan.         |
+------------------------------------------------------------------------------+
```

#### Support: governance readiness

```text
+------------------------------------------------------------------------------+
| KAD/09  DUKUNGAN                         STATUS PENDANAAN: BELUM SIAP         |
+------------------------------------------------------------------------------+
| Dukungan dan kesiapan tata kelola.                                           |
| Sebelum menerima dana, KAD perlu menjelaskan owner, tujuan, pelaporan, dan   |
| batas penggunaan dana.                                                       |
|                                                                              |
| [ ] penanggung jawab legal/akuntansi                                         |
| [ ] kategori penggunaan dana yang disetujui                                 |
| [ ] jadwal pelaporan                                                         |
| [ ] kebijakan pengembalian dan sengketa                                     |
| [ ] kontak publik                                                            |
|                                                                              |
| [HUBUNGI TIM]           Tidak ada pembayaran sebelum daftar ini disetujui.   |
+------------------------------------------------------------------------------+
```

Secondary mobile pattern, 390 x 844:

```text
+--------------------------------------+
| KAD/0X  RUTE / STATUS BUKTI          |
| Hasil halaman secara literal         |
| Satu kalimat tentang kesiapan.       |
+--------------------------------------+
| CATATAN DISETUJUI SAAT INI ATAU      |
| STATUS MENUNGGU / KOSONG YANG JUJUR  |
+--------------------------------------+
| METODE / SUMBER / KOREKSI ->         |
+--------------------------------------+
```

## 9. Route copy map: Indonesian and English

| Route | Indonesian H1 | English H1 | Summary ID | Summary EN | Primary action |
| --- | --- | --- | --- | --- | --- |
| Home | `Mulai dari pertanyaan yang nyata.` | `Start with a real question.` | `Cari program yang masih berjalan, lihat agenda terdekat, atau baca pengalaman orang lain.` | `Find an active program, check the next event, or read what others learned.` | `Masuk ke Discord KAD` / `Join KAD on Discord` |
| Community | `Komunitasnya terlihat dari yang berjalan.` | `See what the community is doing now.` | `Ringkasan kegiatan, catatan, dan orang yang memilih menampilkan kontribusinya.` | `A concise view of activities, records, and people who chose public attribution.` | `Lihat agenda terdekat` / `View the next event` |
| Programs | `Pilih sesuatu untuk diikuti.` | `Choose something to join.` | `Setiap Program berisi Session. Beberapa sudah tersusun menjadi Series.` | `Every Program contains Sessions. Some are organized into Series.` | `Buka program` / `Open program` |
| Agenda | `Jadwal yang bisa kamu datangi.` | `See what you can join next.` | `Tidak perlu daftar atau konfirmasi kehadiran. Buka detail, lalu masuk ke Discord saat waktunya tiba.` | `No registration or attendance confirmation is required. Open the detail, then continue to Discord when it starts.` | `Buka detail acara` / `Open event details` |
| Volunteer | `Bantu bagian yang sedang butuh orang.` | `Help where the community needs people.` | `Ambil satu tanggung jawab dengan lingkup dan handover yang jelas.` | `Take one responsibility with a clear scope and handover.` | Default: `Tanya tim relawan` / `Ask the volunteer team`; verified intake only: `Mulai proses relawan` / `Start volunteer intake` |
| Stories | `Catatan dari orang yang menjalankannya.` | `Notes from the people doing the work.` | `Cerita diterbitkan setelah sumber, izin, dan tinjauan editorial tersedia.` | `Stories publish after source, consent, and editorial review.` | `Baca catatan` / `Read the note` |
| History | `Riwayat yang sedang diverifikasi` | `History under review` | `Timeline hanya memuat peristiwa yang memiliki tanggal, sumber, dan owner.` | `The timeline only includes events with a date, source, and owner.` | `Kirim sumber atau koreksi` / `Send a source or correction` |
| Impact | `Dampak dan cara menghitungnya` | `Impact and how it is measured` | `Setiap angka memiliki periode, definisi, metode, dan sumber.` | `Every number has a period, definition, method, and source.` | `Lihat metode` / `View methodology` |
| Credits | `Kontribusi yang dipilih untuk ditampilkan` | `Contributions chosen for public attribution` | `Nama hanya tampil sesuai izin dan lingkup kontribusi yang disetujui.` | `Names appear only within the approved attribution scope.` | `Buka catatan kontribusi` / `Open contribution record` |
| Support | `Dukungan dan kesiapan tata kelola` | `Support and governance readiness` | `Pengumpulan dana belum dibuka sampai owner, tujuan, dan pelaporan disetujui.` | `Fundraising stays closed until ownership, purpose, and reporting are approved.` | `Hubungi tim` / `Contact the team` |

## 10. State copy

| State | Indonesian | English | Action ID / EN |
| --- | --- | --- | --- |
| Loading | `Catatan program sedang dimuat.` | `Program records are loading.` | Tidak ada kecuali retry tersedia / None unless retry is available |
| Empty programs | `Belum ada program di kategori ini.` | `No programs are published in this category.` | `Lihat semua program` / `View all programs` |
| Empty agenda | `Belum ada agenda publik yang siap ditampilkan.` | `No public schedule is ready yet.` | `Lihat program` / `View programs` |
| Stale | `Catatan ini belum diperbarui sejak {date}.` | `This record has not been updated since {date}.` | `Buka sumber publik` / `Open public source` |
| Error | `Catatan publik tidak dapat dimuat.` | `Public records could not be loaded.` | `Coba lagi` / `Try again` |
| Pending | `Catatan ini menunggu tinjauan sumber.` | `This record is awaiting source review.` | `Kirim sumber atau koreksi` / `Send a source or correction` |
| Cancelled event | `Acara dibatalkan. Catatan waktunya tetap disimpan.` | `The event was cancelled. Its schedule record remains available.` | `Kembali ke Agenda` / `Return to Agenda` |
| Revoked attribution | `Atribusi ini telah dicabut.` | `This attribution has been withdrawn.` | `Buka penjelasan atribusi` / `Open attribution explanation` |
| Missing media | `Dokumentasi visual belum tersedia.` | `Visual documentation is not available yet.` | Pertahankan catatan teks / Keep the textual record readable |
| Volunteer closed | `Penerimaan untuk lingkup ini sudah ditutup.` | `Intake for this scope is closed.` | `Lihat pekerjaan lain` / `View other openings` |
| Demo | `Pratinjau. Halaman ini memakai data contoh.` | `Preview. This page uses demo data.` | Keterangan saja / Disclosure only |

## 11. Media system

Every public media object must carry:

```text
media_id
role: evidence | portrait | poster | atmosphere
source_url or internal approved source
owner
rights_or_consent_state
captured_at
alt_text_id
fallback
reviewed_at
```

Allowed production media:

- approved KADSocialHub posts;
- approved public event posters;
- consented event documentation;
- opt-in volunteer portraits;
- original or properly licensed city photography;
- original CSS, SVG, or generated texture that makes no factual claim.

Never ship:

- private Discord screenshots or private channel URLs;
- unapproved participant faces or names;
- stock imagery presented as a real KAD event;
- AI-generated people presented as volunteers;
- an empty pale rectangle labelled only `KAD / TANPA POSTER`.

Media fallback:

```text
+------------------------------+
| KAD/PROGRAM/03               |
|                              |
| CATATAN MENUNGGU             |
| Dokumentasi visual belum     |
| tersedia.                    |
|                              |
| judul / status / sumber      |
+------------------------------+
```

## 12. Motion system

| Motion | Duration | Easing | Purpose | Reduced motion |
| --- | ---: | --- | --- | --- |
| City change | 500ms | ease-out | Make destination context legible | Disable autoplay; keep manual control |
| Filter underline | 180ms | ease-out | Confirm selected category | Instant state change |
| Record hover | 180ms | ease-out | Reinforce click target | Color/focus change only |
| Poster stack | 240ms | ease-out | Reveal artifact depth | Static stack |
| Live pulse | 1800ms loop | ease-in-out | Reinforce textual `LIVE` state | Static orange marker + text |
| Disclosure | 160ms | ease-out | Show method or metadata | Instant open/close |

No smooth-scroll hijacking, parallax, infinite decorative float, or animation
that changes semantic or focus order.

## 13. Responsive and accessibility contract

Required checks:

```text
[ ] one H1 per route
[ ] landmark and heading order matches ASCII order
[ ] 1280x720 primary task remains visible
[ ] 390x844 primary task remains visible
[ ] no horizontal document or component overflow
[ ] 200% zoom remains usable
[ ] keyboard focus is always visible
[ ] menu closes with Escape and restores stable focus
[ ] status meaning remains textual without color
[ ] media has meaningful alt or intentionally empty alt when decorative
[ ] city autoplay can pause and stops under reduced motion
[ ] Indonesian and English surfaces never mix prose
[ ] fallback locales declare the English language boundary
[ ] RTL layout is reviewed for Arabic
[ ] translation expansion of at least 35% does not clip controls
```

Mobile recomposition changes layout, not meaning. The semantic and focus order
must remain:

```text
skip -> brand -> nav -> page identity -> current fact -> primary action ->
records -> sources -> footer
```

## 14. Staging and dummy-data treatment

```text
demo = true
scenario_clock = fixed ISO timestamp
fixture IDs = deterministic
robots = noindex, nofollow
production leakage = zero
```

The disclosure lives in the route metadata bar:

```text
KAD/02 | DITINJAU 05 AGU 2026 | [PRATINJAU: DATA CONTOH]
```

It must not float above the page, look like a promotional pill, or compete with
the route title.

## 15. Visual-delta acceptance gate

The next implementation may be called a redesign only when all of these pass:

1. Side-by-side screenshots show a different palette, type system, geometry,
   media treatment, and route composition without reading the copy.
2. Warm paper replaces pure white on the main canvas.
3. The dominant inner-page radius is 0-12px, not 28-32px.
4. Programs are poster/index-led, Agenda is date-rail-led, Volunteer is
   roster-led, Stories are editorial-media-led, and Community combines current
   activity with people above the fold.
5. No primary inner page starts with three equal cards.
6. At least one approved artifact or explicit `RECORD PENDING` treatment appears
   in every content family.
7. The staging disclosure is metadata, not a focal badge.
8. Current functional selectors, privacy boundaries, and Discord handoffs still
   pass.
9. Desktop and mobile PNGs are captured for every primary route.
10. A named human reviewer records `accepted` or `rejected` with a date.

ASCII is planning evidence only. It cannot satisfy the rendered visual gate.

## 16. Proposed implementation sequence after approval

```text
PR A  visual tokens + masthead + route stamp + Home + Community
      gate: unmistakable visual delta at desktop and mobile

PR B  Programs + Program detail + Agenda + Event detail
      gate: catalogue and schedule remain distinct and task-complete

PR C  Volunteer + profile + Stories + story detail
      gate: consent, ledger, media, and editorial hierarchy pass

PR D  History + Impact + Credits + Support + state parity
      gate: no unsupported history, metric, identity, or payment claim
```

Every PR deploys to staging, runs production and fixture builds, validates the
Interface IR/runtime contract, and captures desktop/mobile review evidence.

## 17. Human decisions required before implementation

Approve or revise:

1. the name and metaphor: `KAD Field Station`;
2. warm paper + navy + cobalt + orange + mint palette;
3. Archivo + Newsreader Italic + IBM Plex Mono typography direction;
4. editorial ruled rows with limited radius instead of rounded card grids;
5. route compositions in Section 8;
6. exact Indonesian and English copy in Sections 4, 9, and 10;
7. whether real public KAD media may be collected now for the reference pack;
8. whether PR A may begin only after desktop and mobile reference frames are
   visually approved.

## Appendix A. Draft Interface IR delta

The approved domain IR remains the source of truth. After visual approval, its
tokens, components, media, motion, and evaluation criteria should gain the
following explicit delta.

### Proposed capabilities

| Capability ID | Requirement | Web mapping | Fallback | Provenance |
| --- | --- | --- | --- | --- |
| `editorial_dispatch_layout` | required | Semantic grid, ruled sections, indexed records | Linear document flow | inferred from the approved visual direction |
| `route_family_composition` | required | A distinct composition for briefing, index, schedule, roster, and archive | Same content in a linear list | inferred from the user's visual rejection |
| `evidence_led_media` | required | Approved local poster, portrait, photo, or source-stamped artifact | Typographic `RECORD PENDING` block | observed from the public-content boundary |
| `current_state_summary` | required | One concrete record or honest empty state in the first viewport | Literal state copy | inferred from hierarchy review |
| `semantic_navigation` | required | Native anchors and landmarks | Normal browser navigation | observed in the current runtime |
| `responsive_recomposition` | required | 12, 8, and 4-column layouts | Linear semantic order | observed requirement |
| `evidence_provenance` | required | Source, revision, review, and correction metadata | Evidence placeholder | observed requirement |
| `consent_led_attribution` | required | Opt-in identity or anonymous record | Anonymous record | observed requirement |
| `finite_meaningful_motion` | optional | City, filter, live, and disclosure feedback | Static equivalent | inferred from the proposed motion system |
| `live_discord_sync` | unavailable in this draft | Unsupported | Reviewed fixture or empty state | observed implementation gap |

### Proposed regions and semantic order

```text
site_header
  -> route_metadata
  -> page_heading
  -> primary_decision
  -> current_state
  -> primary_records
  -> evidence_media
  -> provenance_and_correction
  -> site_footer
```

### Proposed components

| Component ID | Region | Kind | Initial state | Focusable | Provenance |
| --- | --- | --- | --- | --- | --- |
| `masthead` | `site_header` | navigation | ready | yes | observed current shell, visually revised |
| `route_stamp` | `route_metadata` | metadata | current | no | inferred |
| `landing_atlas` | `primary_decision` | media-navigation | city_01 | yes | inferred from approved landing exploration |
| `current_record` | `current_state` | record | ready_or_empty | conditional | inferred |
| `dispatch_row` | `primary_records` | record-link | ready | yes | inferred |
| `program_dossier` | `primary_records` | structured-record | ready | yes | inferred from Program domain |
| `agenda_date_rail` | `primary_records` | schedule | upcoming_or_empty | yes | inferred from Agenda domain |
| `people_rail` | `evidence_media` | consent-led list | anonymous_safe | yes | inferred from attribution boundary |
| `contribution_ledger` | `primary_records` | evidence-list | ready_or_pending | yes | observed domain requirement |
| `source_stamp` | `provenance_and_correction` | metadata-link | reviewed_or_pending | yes | observed evidence contract |
| `record_pending_media` | `evidence_media` | fallback | missing_media | no | inferred safe fallback |

### Focus order

```text
skip_link
brand_link
primary_navigation
locale_control
discord_header_secondary
page_heading
current_record_action
primary_action
record_links_in_visual_order
source_and_correction_links
footer_navigation
```

CSS position, asymmetry, and media overlap must not alter this order.

## Appendix B. Route state coverage

| Route family | Ready | Empty | Partial or stale | Error | Pending or blocked | Revoked or cancelled |
| --- | --- | --- | --- | --- | --- | --- |
| Home | Hero, current record, city atlas | No current event; keep Programs and Discord | Show last-reviewed dates | Public records unavailable; Discord still explicit | Media pending uses typography | Not applicable |
| Community | Current record, metrics, people | Honest no-agenda or no-opt-in-people copy | Qualified metrics retain period/source | Current records unavailable with retry | Metrics or identity remain placeholders | Withdrawn attribution disappears into safe anonymous state |
| Programs | Indexed records and posters | No result for filter | Stale date and source remain visible | Retry catalogue | Program or media awaits review | Archived Program has no active join action |
| Program detail | Purpose, structure, next Session | No approved Session | Keep Program context and show stale Session state | Record unavailable with return path | Metrics/media/source pending | Archived Program remains readable |
| Agenda | Upcoming/live/completed rows | No public schedule | Stale date marked explicitly | Retry schedule | Record awaits review | Cancelled row remains textual and has no join action |
| Event detail | Upcoming/live with Discord handoff | Not published | Source or room link pending | Return to Agenda | No join action until public | Completed/cancelled has no join action |
| Volunteer | Cycle, openings, roles, people | No current opening | Intake owner/path requires review | Public roster unavailable | Form or role invite appears only when live | Closed opening remains closed, no fake intake |
| Volunteer profile | Opt-in or anonymous ledger | No public contribution yet | Contribution awaiting review | Return to roster | Identity remains anonymous until consent | Attribution withdrawal shows a neutral tombstone |
| Stories | Featured note and archive | No public story yet | Source/editorial state visible | Retry archive | Story awaits approval | Withdrawn story shows a neutral tombstone |
| History | Reviewed timeline entries | No approved timeline yet | Some claims pending | Evidence view unavailable | Claim awaits date/source/owner | Corrected entry supersedes older revision |
| Impact | Program metrics with methods | No approved metric | Period/method stale | Method view unavailable | Value remains unpublished | Corrected metric supersedes older revision |
| Credits | Opt-in and anonymous entries | No public attribution | Review date visible | Directory unavailable | Identity remains hidden | Withdrawn attribution hides name and old scope |
| Support | Approved readiness and contact | Fundraising not ready | Checklist incomplete | Contact path unavailable | No payment action | Not applicable |

## Appendix C. Visual reference coverage plan

No implementation begins until the first six reference frames are approved.
The remaining frames are required before claiming route-family completion.

| Scenario ID | Route and state | Represented viewport | Required visual evidence | Trigger/result pair |
| --- | --- | --- | --- | --- |
| `home_desktop_ready` | Home, ready city_01 | 1440x900 | hero, atlas, current record, one CTA | city_01 -> city_02 |
| `home_mobile_ready` | Home, ready city_01 | 390x844 | same decision and action priority | paused -> resumed |
| `community_desktop_ready` | Community, demo ready | 1440x900 | current event, metrics, people above fold | method closed -> open |
| `community_mobile_ready` | Community, demo ready | 390x844 | current event, compact metrics, people | method closed -> open |
| `programs_desktop_ready` | Programs, populated | 1440x900 | poster-led index and next Session | all -> language filter |
| `programs_mobile_ready` | Programs, populated | 390x844 | filter, record, poster, action | all -> language filter |
| `programs_empty` | Programs, empty filter | 1280x720 | meaningful empty state | populated -> empty |
| `program_detail_ready` | Program detail, Series | 1440x900 and 390x844 | poster, next Session, Series, method | method closed -> open |
| `agenda_desktop_upcoming` | Agenda, upcoming | 1440x900 | date rail and no index join CTA | upcoming -> live |
| `event_detail_live` | Event detail, live | 1280x720 and 390x844 | textual live state and one Discord handoff | upcoming -> live |
| `event_detail_cancelled` | Event detail, cancelled | 1280x720 | cancellation and no Discord handoff | upcoming -> cancelled |
| `volunteer_desktop_open` | Volunteer, open intake | 1440x900 | opening, structure, people | open -> closed opening |
| `volunteer_profile_opt_in` | Profile, named | 1280x720 and 390x844 | role and Program-grouped ledger | opt-in -> withdrawn |
| `volunteer_profile_anonymous` | Profile, anonymous | 390x844 | useful record without identity | anonymous stable |
| `stories_desktop_ready` | Stories, featured | 1440x900 | lead artifact and archive | featured -> detail |
| `story_detail_ready` | Story detail, reviewed | 1280x720 and 390x844 | long-form column and source notes | source note -> related record |
| `secondary_pending` | History or Support, pending | 1280x720 and 390x844 | honest readiness state | pending stable |

Every captured frame records:

```text
route
state
viewport
fixture revision
media provenance status
capture date
reviewer
accepted or rejected
```

## Appendix D. Per-route hierarchy and action contract

| Route | Semantic first | Visual focal point | Primary action | Secondary action | Evidence above fold |
| --- | --- | --- | --- | --- | --- |
| Home | H1 and context | Promise + city atlas | Join KAD on Discord | View next event | City context and one current record |
| Community | Current state | Next event + human activity | View next event | View all Programs | Metrics and people |
| Programs | Catalogue context | First poster-led Program record | Open Program | Filter catalogue | Poster or record-pending block |
| Program detail | Program purpose | Next known Session | Join KAD on Discord | Open Series or source | Poster and structure |
| Agenda | Schedule context | Earliest upcoming or live row | Open event detail | Change timezone/filter | Date, status, relationship |
| Event detail | Event facts | Status, time, and participation | Join KAD or live room when valid | Open related Program | Source and reviewed facts |
| Volunteer | Intake state | Open responsibility | Start volunteer intake | Ask volunteer team | Cycle, opening, people |
| Volunteer profile | Identity visibility | Responsibility and ledger | Open contribution record | Return to roster | Portrait/anonymous state and contribution |
| Stories | Archive context | Featured documented story | Read note | Open related Program | Approved artifact and source stamp |
| Story detail | Story title and source | Lead artifact and narrative | Open related Program | Open source | Media, source, related record |
| History | Evidence state | First reviewed milestone | Send source or correction | Open methodology | Evidence status |
| Impact | Measurement scope | First qualified Program metric | View methodology | Open Program | Period, definition, source |
| Credits | Attribution boundary | First consent-safe contribution | Open contribution record | Read attribution policy | Visibility and review state |
| Support | Governance status | Readiness checklist | Contact the team | Read governance notes | Explicit not-ready state |
