import { ArrowUpRight } from 'lucide-react';
import { DISCORD_URL, PROGRAMS, localizedPath, localizedProgram } from '@/content/community-site';
import type { Locale } from '@/i18n/constants';

export type LandingDirectionId = 'field-notes' | 'community-bulletin' | 'community-atlas';

interface LandingDirectionProps {
  direction?: LandingDirectionId;
  locale?: Locale;
  preview?: boolean;
  showFallbackNotice?: boolean;
}

const DIRECTIONS: ReadonlyArray<{ id: LandingDirectionId; label: string; note: string }> = [
  { id: 'field-notes', label: 'Field Notes', note: 'Recommended' },
  { id: 'community-bulletin', label: 'Community Bulletin', note: 'Comparison' },
  { id: 'community-atlas', label: 'Community Atlas', note: 'Comparison' },
];

const POSTERS = PROGRAMS.flatMap((program) =>
  program.media.map((media) => ({ media, program })),
);

function posterLabel(mediaId: string, fallback: string): string {
  if (mediaId.includes('english-study-club')) return 'English Study Club';
  if (mediaId.includes('mandarin-study-club-weekly')) return 'Mandarin Study Club';
  return fallback;
}

const STEPS_ID = [
  { number: '01', title: 'Pilih program', summary: 'Mulai dari topik yang ingin kamu pelajari atau bahas bersama.' },
  { number: '02', title: 'Gabung ke Discord', summary: 'Website memberi konteks. Percakapan dan event berlangsung di Discord.' },
  { number: '03', title: 'Ikut saat sesi dimulai', summary: 'Event publik tidak perlu daftar atau konfirmasi kehadiran. Datang saat waktunya tiba.' },
] as const;

const STEPS_EN = [
  { number: '01', title: 'Choose a program', summary: 'Start with a topic you want to learn or discuss with others.' },
  { number: '02', title: 'Join Discord', summary: 'The website gives context. Conversations and events happen on Discord.' },
  { number: '03', title: 'Join when it starts', summary: 'Public events require no registration or attendance confirmation. Join when it begins.' },
] as const;

function PreviewNavigation({ direction }: { direction: LandingDirectionId }) {
  return (
    <aside className="kad-design-review" aria-labelledby="design-review-heading">
      <div className="kad-container kad-design-review__inner">
        <div>
          <p className="kad-eyebrow">Staging review · bukan halaman produksi</p>
          <h1 id="design-review-heading">Pilih ritme landing yang paling terasa seperti KAD.</h1>
          <p>
            Semua pilihan memakai konten publik yang sama dan tetap terhubung ke placeholder
            halaman lengkap. Yang dibandingkan hanya cara menyusun cerita setelah kota.
          </p>
        </div>
        <nav className="kad-direction-tabs" aria-label="Arah desain landing">
          {DIRECTIONS.map((item, index) => (
            <a
              key={item.id}
              href={`/design-preview/${item.id}/`}
              aria-current={item.id === direction ? 'page' : undefined}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.label}</strong>
              <small>{item.note}</small>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function PosterRail({ locale }: { locale: Locale }) {
  const items = POSTERS
    .filter(({ program }) => program.slug !== 'apple-developer-academy-batch-2027')
    .slice(0, 3);
  const isEnglish = locale !== 'id';

  return (
    <>
      <div className="kad-field-posters" aria-label={isEnglish ? 'Public program poster archive' : 'Arsip poster program publik'}>
        {items.map(({ media: sourceMedia, program }) => {
          const localized = localizedProgram(locale, program);
          const media = localized.media.find((candidate) => candidate.id === sourceMedia.id);
          return media ? (
          <figure key={media.id}>
            <a href={localizedPath(locale, `/programs/${program.slug}`)}>
              <img
                src={media.src}
                alt={media.alt}
                width={media.width}
                height={media.height}
                loading="lazy"
                decoding="async"
              />
            </a>
            <figcaption>
              <strong>{posterLabel(media.id, localized.title)}</strong>
              <span>{isEnglish ? 'Public archive · check the latest status' : 'Arsip publik · cek status terbaru'}</span>
            </figcaption>
          </figure>
          ) : null;
        })}
      </div>
      <p className="kad-field-posters__hint">{isEnglish ? 'Selected public records · open a program for details →' : 'Pilihan catatan publik · buka program untuk detail →'}</p>
    </>
  );
}

function FieldNotes({ locale }: { locale: Locale }) {
  const isEnglish = locale !== 'id';
  const leadSource = PROGRAMS.find((program) => program.slug === 'apple-developer-academy-batch-2027');
  const lead = leadSource ? localizedProgram(locale, leadSource) : undefined;
  const leadMedia = lead?.media[0];
  const steps = isEnglish ? STEPS_EN : STEPS_ID;

  return (
    <div className="kad-direction-surface kad-field-notes" data-design-direction="field-notes">
      <section className="kad-field-story" aria-labelledby="field-notes-heading">
        <div className="kad-container">
          <div className="kad-field-story__topline">
            <div>
              <p className="kad-eyebrow">03 · Program notes</p>
              <h2 id="field-notes-heading">
                {isEnglish ? <>Start with a program you can <em>follow.</em></> : <>Mulai dari program yang bisa kamu <em>ikuti.</em></>}
              </h2>
            </div>
            <p>{isEnglish ? 'Read the public context, then continue the conversation on Discord.' : 'Baca konteks publiknya, lalu lanjutkan percakapan di Discord.'}</p>
          </div>

          <div className="kad-field-story__layout">
            <div>
              <p className="kad-field-story__lede">
                {isEnglish ? 'These are selected program records, not a complete archive. Open one to see what is known and what still needs a live Discord update.' : 'Ini pilihan catatan program, bukan arsip lengkap. Buka salah satunya untuk melihat apa yang sudah diketahui dan apa yang masih perlu diperbarui di Discord.'}
              </p>
              <ol className="kad-journal-steps">
                {steps.map((step) => (
                  <li key={step.number}>
                    <b>{step.number}</b>
                    <div>
                      <strong>{step.title}</strong>
                      <span>{step.summary}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {lead && leadMedia && (
              <figure className="kad-lead-poster">
                <a href={localizedPath(locale, `/programs/${lead.slug}`)}>
                  <img
                    src={leadMedia.src}
                    alt={leadMedia.alt}
                    width={leadMedia.width}
                    height={leadMedia.height}
                    loading="eager"
                    decoding="async"
                  />
                </a>
                <figcaption>
                  <strong>{isEnglish ? 'Learn together, one step at a time.' : 'Belajar bersama, selangkah demi selangkah.'}</strong>
                  <span>{isEnglish ? 'Public KADSocialHub source · confirm the latest status' : 'Sumber publik KADSocialHub · status terbaru perlu dikonfirmasi'}</span>
                </figcaption>
              </figure>
            )}
          </div>

          <PosterRail locale={locale} />

          <div className="kad-evidence-band" data-event-count="0" data-event-state="empty">
            <strong>{isEnglish ? 'Public schedule sync is still being built.' : 'Sinkronisasi agenda publik masih dibangun.'}</strong>
            <p>
              {isEnglish ? 'The records above are approved documentation, not a promise that each session is still active. Join KAD on Discord to take part when an event starts.' : 'Catatan di atas adalah dokumentasi yang disetujui, bukan janji bahwa setiap sesi masih aktif. Gabung ke Discord KAD untuk ikut saat acaranya dimulai.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={localizedPath(locale, '/events')}>{isEnglish ? 'Browse the public agenda' : 'Buka agenda publik'}</a>
              <a href={localizedPath(locale, '/stories')}>{isEnglish ? 'Read community stories' : 'Baca cerita komunitas'}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CommunityBulletin({ locale }: { locale: Locale }) {
  return (
    <div className="kad-direction-surface kad-bulletin" data-design-direction="community-bulletin">
      <section className="kad-container kad-bulletin__section" aria-labelledby="bulletin-heading">
        <div className="kad-field-story__topline">
          <div>
            <p className="kad-eyebrow">02 · Community Bulletin</p>
            <h2 id="bulletin-heading">Yang sedang ditempel di dinding <em>kita.</em></h2>
          </div>
          <p>Papan fisik untuk program, proses, dan ajakan yang bisa dibaca ulang.</p>
        </div>
        <div className="kad-bulletin__grid">
          <div className="kad-bulletin__intro">
            <h3>Ambil kertasnya.<br />Tulis pertanyaanmu.</h3>
            <p>
              Komunitas tidak harus terdengar rapi. Yang penting: konteksnya jelas dan
              pintunya terbuka.
            </p>
            <div><span>Public notice</span><span>No invented claims</span></div>
          </div>
          <div className="kad-bulletin__notices" aria-label="Papan poster program">
            {POSTERS.map(({ media, program }, index) => (
              <article key={media.id} className={`kad-bulletin__notice kad-bulletin__notice--${(index % 3) + 1}`}>
                <a href={localizedPath(locale, `/programs/${program.slug}`)}>
                  <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" />
                </a>
                <div>
                  <h3>{posterLabel(media.id, program.title)}</h3>
                  <p>Detail terbaru perlu dikonfirmasi.</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CommunityAtlas({ locale }: { locale: Locale }) {
  const cities = [
    ['Seoul', '/images/seoul.webp'],
    ['Tokyo', '/images/tokyo.webp'],
    ['Singapore', '/images/singapore.webp'],
    ['Berlin', '/images/berlin_2.webp'],
  ] as const;

  return (
    <div className="kad-direction-surface kad-atlas" data-design-direction="community-atlas">
      <section className="kad-container kad-atlas__section" aria-labelledby="atlas-heading">
        <div className="kad-field-story__topline">
          <div>
            <p className="kad-eyebrow">02 · Community Atlas</p>
            <h2 id="atlas-heading">Empat kota. <em>Satu peta eksplorasi.</em></h2>
          </div>
          <p>Konsep navigasi visual—bukan ranking atau klaim komunitas regional.</p>
        </div>
        <div className="kad-atlas__grid">
          <div className="kad-atlas__copy">
            <span className="kad-atlas__stamp">Design<br />concept</span>
            <p>
              Kota dipakai sebagai titik masuk menuju dokumentasi publik. Hubungan program
              dan wilayah perlu dibuktikan sebelum versi produksi.
            </p>
          </div>
          <div className="kad-atlas__route" aria-label="Peta konseptual kota">
            {cities.map(([city, image], index) => (
              <article key={city}>
                <img src={image} alt={`Pemandangan kota ${city}`} width="320" height="220" loading="lazy" />
                <div>
                  <span>City {String(index + 1).padStart(2, '0')}</span>
                  <h3>{city}</h3>
                  <p>Titik masuk visual · belum terhubung ke program.</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="kad-atlas__posters" aria-label="Arsip poster program">
          {POSTERS.map(({ media, program }) => (
            <a key={media.id} href={localizedPath(locale, `/programs/${program.slug}`)}>
              <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" />
              <span>{posterLabel(media.id, program.title)}</span>
            </a>
          ))}
        </div>
        <div className="kad-atlas__pending">
          <strong>Legenda:</strong> poster adalah dokumentasi yang disetujui. Jadwal aktif,
          peserta, dan dampak belum diklaim di prototipe ini.
        </div>
      </section>
    </div>
  );
}

export default function LandingDirection({
  direction = 'field-notes',
  locale = 'id',
  preview = false,
  showFallbackNotice = true,
}: LandingDirectionProps) {
  const contentLanguage = locale === 'id' ? 'id' : 'en';
  const usesFallback = locale !== 'id' && locale !== 'en';
  return (
    <div lang={contentLanguage} data-interface-slice="community-home" data-program-count={PROGRAMS.length} data-requested-locale={locale}>
      {showFallbackNotice && usesFallback && <p className="kad-translation-notice" role="status">This community section is available in English while a full translation is prepared.</p>}
      {preview && <PreviewNavigation direction={direction} />}
      {direction === 'field-notes' && <FieldNotes locale={locale} />}
      {direction === 'community-bulletin' && <CommunityBulletin locale={locale} />}
      {direction === 'community-atlas' && <CommunityAtlas locale={locale} />}
      {preview && (
        <section className="kad-review-cta" aria-labelledby="review-cta-heading">
          <div className="kad-container">
            <p className="kad-eyebrow">Bagikan pilihanmu</p>
            <h2 id="review-cta-heading">Yang terasa paling KAD—dan bagian mana yang masih terasa dibuat-buat?</h2>
            <div className="kad-actions">
              <a className="kad-button kad-button--primary" href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                Jawab di Discord <ArrowUpRight aria-hidden="true" size={16} />
              </a>
              <a className="kad-button kad-button--outline" href={localizedPath(locale, '/programs')}>
                Cek placeholder halaman lain
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
