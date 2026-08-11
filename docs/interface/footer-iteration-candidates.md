# Footer iteration candidates

Status: Candidate A selected with a reviewed synthesis

## Decision

An independent copy and hierarchy review scored Candidate A at 81/100, ahead
of Candidate B at 73/100 and Candidate C at 64/100. The implementation keeps
the Field Station task order from A, borrows B's warmer human framing, and uses
C's quiet records rail without adopting its institutional claims.

Selected public copy:

- `Bawa pertanyaanmu. Pilih langkah berikutnya.`
- One primary `Gabung ke Discord` handoff with no channel, member-count, or
  automated-role promise.
- Three internal paths: Program, Agenda, and Relawan.
- A secondary but complete Catatan publik and Sumber publik index, including
  the current support-readiness route.

The reviewed wording replaces unexplained `QA`, registration-focused phrasing,
mixed-language labels, and incomplete verbs. The final implementation is
contracted in `docs/interface/kad-community-interface.ir.json`.

## Audience

Footer ini melayani orang yang sudah sampai di ujung halaman dan membutuhkan satu langkah yang jelas: ikut percakapan, menemukan kegiatan, membantu pekerjaan komunitas, atau memeriksa catatan publik tanpa harus menebak-nebak struktur situs.  
This footer serves people who have reached the end of a page and need one clear next step: join the conversation, find an activity, help with community work, or inspect public records without guessing the site structure.

## Evidence deconstruction

| Evidence | Status | What it says | Implementation boundary |
| --- | --- | --- | --- |
| `src/components/layout/Footer.tsx` renders a brand block, one Discord link, an Explore list, public-source links, and a bottom note. | Observed | The footer is currently a broad sitemap repeated on every route. | Keep a real `contentinfo`, one labelled navigation region, and ordinary anchors. Recompose the hierarchy instead of adding more links. |
| The current Explore list contains Community, Programs, Events, Volunteer, Stories, History, Impact, Credits, and Support. | Observed | Nine route links have equal visual weight, so a visitor must decide the information architecture at the footer. | Group links by visitor task. Do not remove a live route from the site; move lower-frequency records into a quiet secondary group. |
| `src/constants/urls.ts` defines `https://discord.gg/RUFFbEaeDx`. | Observed | Discord is the stable public handoff. | Use the constant and label the action as joining Discord or opening the community. Do not invent a channel name or a role-grant guarantee. |
| Public events do not require registration or attendance confirmation. | Observed | Events are open participation, not a form funnel. | Copy should say “langsung masuk ke Discord” or “join in Discord”, never “daftar”, “konfirmasi kehadiran”, or “reserve a seat”. |
| Volunteer intake begins through Discord/QA. | Observed | The website can explain the route but cannot promise a currently-live interview, form, or automation. | Say “tanya tim relawan di Discord” or “mulai dari QA”. Expose a form or interview label only when an owner has published that capability. |
| Support has no payment flow yet. | Observed | A donation conversion is not available in the current product. | Use “baca kesiapan dukungan” or “hubungi tim” only if the route exposes it. Never use “donate now”, payment language, or a fictive fiscal claim. |
| The website is a public context and records layer. | Inferred | The footer should hand off to context and evidence, not behave like a campaign banner. | Keep one main handoff plus a calm records/source area. Do not place unverified metrics or member counts in the footer. |
| The Discord invite is permanent, while its API anchor is `moderator-main`. | Observed | The URL is safe to reuse, but the current landing destination is not a public content contract. | Do not write “go to #welcome”, “get the role automatically”, or any channel-specific promise. |
| Locale handling maps `id` to Indonesian and all other requested locales to English in `Footer.tsx`. | Observed | Footer language must remain coherent for Indonesian and English, including action labels and notes. | Keep a full Indonesian and concise English pair for every new phrase. Do not leave mixed Indonesian and English fragments in one sentence. |
| Source links point to KADSocialHub X, Instagram, and the GitHub repository. | Observed | These are verification paths, not primary participation paths. | Keep them subordinate to the participation handoff and label them as public sources or project records. |
| The footer is shared by home, content routes, and blog layout. | Observed | Any change affects every route family and narrow screens. | Test at least Home, Programs, Events, Volunteer, Stories, one secondary route, Indonesian, English, desktop, and mobile. |
| It is unknown whether an approved current event, volunteer opening, or support contact should be promoted globally. | Unknown | A global “next” slot could quickly become stale or duplicate page content. | Do not add a live-status slot until content ownership, freshness, and empty-state copy are defined. |

## Capability map and acceptance checks

### Required for the next footer iteration

| Capability | Acceptance check |
| --- | --- |
| Task-led grouping | A visitor can identify the participation, discovery, contribution, and records paths in one scan. No more than four top-level task labels. |
| Discord handoff | Exactly one primary Discord action uses `DISCORD_URL`, opens safely in a new tab, and states that events are open participation. |
| Honest volunteer handoff | Volunteer copy directs people to Discord/QA without promising a form, interview, role assignment, or automatic role. |
| Honest support state | Support copy does not imply a payment flow. If no contact path is available, the route remains an information link only. |
| Records and sources | History, Impact, Credits, and source links remain discoverable but visually secondary to the participation path. |
| No fabricated proof | No member count, attendance count, active-channel claim, donor claim, or live-status claim appears without a published source. |
| Language parity | Indonesian and English have matching meaning, with no fallback key visible and no accidental mixed-language sentence. |
| Keyboard and semantics | One `contentinfo`, one labelled `nav`, visible focus, logical tab order, descriptive external-link labels, and no keyboard trap. |
| Responsive recomposition | At 390px the groups become a readable single column or deliberate stack; no horizontal overflow, clipped label, or tiny tap target. |
| Route integrity | All existing footer destinations still resolve with the locale prefix rules. Discord, X, Instagram, and GitHub links remain external anchors. |
| Copy QA | Every sentence answers one job, avoids generic slogans, uses concrete verbs, and does not repeat the page's hero copy. |

### Optional after the first review

| Capability | Guardrail |
| --- | --- |
| Current handoff slot | Requires an owned feed, last-reviewed timestamp, and an honest empty state. It must not silently become a stale event promotion. |
| Discord availability marker | Requires a verified source and a defined meaning. Do not infer “online” from a static invite. |
| Locale-specific source labels | Useful only when the linked source actually has a translated surface. Otherwise keep the proper account or repository name. |
| Footer motion | A small arrival or underline transition may reinforce the loop; it must be disabled or reduced under `prefers-reduced-motion` and never delay navigation. |

## Candidate A: Field-station handoff

### Architecture

The footer behaves like the final dispatch board. A short left column explains what KAD is for. A high-contrast “berangkat” block asks the visitor to choose the next practical move. A compact records rail keeps the public archive visible without competing with participation.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ KABURAJADULU                                                        │
│ Bawa pertanyaanmu. Cari kegiatan yang cocok.                        │
│                                                                      │
│ LANGKAH BERIKUT                                                     │
│ [ Masuk ke Discord ]   [ Lihat agenda ]   [ Lihat program ]          │
│  Acara terbuka. Tidak perlu daftar atau konfirmasi.                  │
│                                                                      │
│ BANTU MENJALANKAN                  CATATAN PUBLIK                    │
│ Relawan → mulai dari QA Discord    Komunitas · Riwayat · Dampak      │
│                                     Kredit · Sumber                   │
│                                                                      │
│ © 2026 KaburAjaDulu      KADSocialHub · GitHub      Bahasa: ID / EN  │
└──────────────────────────────────────────────────────────────────────┘
```

### Copy direction

| Indonesian | English parity |
| --- | --- |
| **Bawa pertanyaanmu. Cari langkah berikutnya.** | **Bring your question. Find the next step.** |
| **Masuk ke Discord** | **Join Discord** |
| **Acara terbuka. Tidak perlu daftar atau konfirmasi.** | **Events are open. No registration or confirmation needed.** |
| **Lihat agenda** | **View the agenda** |
| **Lihat program** | **Explore programs** |
| **Bantu menjalankan** | **Help run the work** |
| **Mulai dari QA di Discord** | **Start with QA in Discord** |
| **Catatan publik** | **Public records** |
| **Komunitas · Riwayat · Dampak · Kredit · Sumber** | **Community · History · Impact · Credits · Sources** |

### Why this is genuinely different

It treats the footer as a practical departure point. The user chooses an action based on intent, not a category from the primary navigation. It is strongest when the overall site already feels like a field notebook and when “what do I do now?” is the final question.

## Candidate B: Community and belonging handoff

### Architecture

The footer closes with a welcome, then separates ways to belong from ways to understand the community. Discord owns the social action. Programs and events are framed as things people can join. Volunteer is framed as a responsibility, not an application. Records are available as a quieter “know the work” column.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ MASUK SEBAGAI DIRI SENDIRI                                           │
│ Ada ruang untuk bertanya, belajar, datang ke acara, atau membantu.   │
│                                                                      │
│ IKUT BERSAMA                         KENALI KERJANYA                  │
│ Gabung Discord                       Community · Programs             │
│ Lihat acara yang terbuka             Events · Stories                 │
│ Bantu sebagai relawan                History · Impact · Credits       │
│ Mulai dari QA di Discord             Sumber publik                     │
│                                                                      │
│ Acara tidak memakai pendaftaran. Langsung masuk ke Discord.           │
│ © 2026 KaburAjaDulu · KADSocialHub · GitHub                           │
└──────────────────────────────────────────────────────────────────────┘
```

### Copy direction

| Indonesian | English parity |
| --- | --- |
| **Masuk sebagai diri sendiri.** | **Show up as yourself.** |
| **Ada ruang untuk bertanya, belajar, datang ke acara, atau membantu.** | **There is room to ask, learn, join an event, or help.** |
| **Ikut bersama** | **Join in** |
| **Gabung Discord** | **Join Discord** |
| **Lihat acara yang terbuka** | **See open events** |
| **Bantu sebagai relawan** | **Help as a volunteer** |
| **Mulai dari QA di Discord** | **Start with QA in Discord** |
| **Kenali kerjanya** | **Understand the work** |
| **Acara tidak memakai pendaftaran. Langsung masuk ke Discord.** | **Events do not use registration. Join Discord directly.** |

### Why this is genuinely different

It is a social welcome rather than a dispatch board. It gives equal dignity to asking, learning, attending, and contributing, which can make the community feel less transactional. The risk is that the welcome becomes soft or vague if the links are not kept sharply action-led.

## Candidate C: Open records and trust handoff

### Architecture

The footer starts from the public record promise. One sentence clarifies what the website can show, then offers a single participation route and a compact audit trail. The social CTA is present but not the visual center. This is the most transparent option for people deciding whether the community is credible.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ LIHAT YANG BISA DIPERIKSA                                            │
│ Program, agenda, cerita, dan kontribusi dipisahkan sesuai sumbernya. │
│                                                                      │
│ IKUTI KEGIATANNYA                    PERIKSA CATATANNYA               │
│ Gabung Discord                        Community · Programs             │
│ Acara terbuka, tanpa daftar            Events · Stories                 │
│ Tanya tentang relawan di QA            History · Impact · Credits       │
│                                       Sumber publik                     │
│                                                                      │
│ Tidak menemukan yang kamu cari? Mulai dari Discord.                   │
│ © 2026 KaburAjaDulu · KADSocialHub · GitHub                           │
└──────────────────────────────────────────────────────────────────────┘
```

### Copy direction

| Indonesian | English parity |
| --- | --- |
| **Lihat yang bisa diperiksa.** | **See what can be checked.** |
| **Program, agenda, cerita, dan kontribusi dipisahkan sesuai sumbernya.** | **Programs, agenda, stories, and contributions are kept with their sources.** |
| **Ikuti kegiatannya** | **Join the activity** |
| **Gabung Discord** | **Join Discord** |
| **Acara terbuka, tanpa daftar** | **Open events, no registration** |
| **Tanya tentang relawan di QA** | **Ask about volunteering in QA** |
| **Periksa catatannya** | **Check the records** |
| **Tidak menemukan yang kamu cari? Mulai dari Discord.** | **Can’t find what you need? Start with Discord.** |

### Why this is genuinely different

It makes trust the closing action. The visitor sees the boundary between public context and participation, which supports careful claims and future attribution features. The risk is that the footer feels institutional if the visual language does not retain enough warmth.

## Unscored comparison matrix

| Dimension | Candidate A: Field-station | Candidate B: Belonging | Candidate C: Open records |
| --- | --- | --- | --- |
| Primary closing question | “What should I do next?” | “Where do I fit?” | “What can I verify?” |
| Main visual action | Discord and practical next steps | Join together | Inspect records and sources |
| Best fit | Field Notes / dispatch visual language | Community-first welcome | Evidence-led public information system |
| Event truth | Explicitly open, no registration | Explicitly open, no registration | Explicitly open, no registration |
| Volunteer truth | Discord/QA handoff only | Responsibility-oriented Discord/QA handoff | Public boundary and Discord/QA handoff |
| Support truth | Secondary record link, no payment claim | Secondary understanding link, no payment claim | Governance/readiness link, no payment claim |
| Information density | Medium, task groups | Low to medium, warmer prose | Medium to high, strongest source framing |
| Mobile behavior | Stack action rail, then records | Stack belonging actions, then records | Stack source statement, then participation |
| Main copy risk | Feels like another navigation rail | Becomes generic welcome copy | Feels cold or institutional |
| Data dependency | None beyond existing links and route map | None beyond existing links and route map | None beyond existing links and route map |
| Needs a winner now? | No | No | No |

## Review loop before implementation

1. Validate every label against the live route and its content state.
2. Remove any sentence that promises a form, interview, automatic Discord role, live activity, donation, or metric that the product cannot prove.
3. Read Indonesian copy aloud, then compare the English line by line for meaning, not word count.
4. Render Home, Programs, Events, Volunteer, Stories, and a secondary route at desktop and 390px.
5. Check the footer after a long page, an empty state, and a populated staging state. It must remain a useful handoff rather than a second hero.
6. Ask reviewers to name the first action they see and the first fact they understand. If either answer is “the sitemap” or “a slogan”, revise the hierarchy.
