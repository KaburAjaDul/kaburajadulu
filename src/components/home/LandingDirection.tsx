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
  {
    number: '01',
    title: 'Bawa satu pertanyaan',
    summary: 'Mulai dari hal yang ingin kamu pelajari, bukan dari daftar benefit.',
  },
  {
    number: '02',
    title: 'Temukan ritme yang pas',
    summary: 'Baca sumber publik, lalu konfirmasi jadwal dan kapasitas di Discord.',
  },
  {
    number: '03',
    title: 'Tinggalkan jejak untuk orang lain',
    summary: 'Ikut, bantu satu siklus, dan dokumentasikan konteks yang boleh dibagikan.',
  },
] as const;

const STEPS_EN = [
  { number: '01', title: 'Bring one question', summary: 'Start with what you want to learn, not a list of benefits.' },
  { number: '02', title: 'Find a rhythm that fits', summary: 'Read the public source, then confirm schedule and capacity on Discord.' },
  { number: '03', title: 'Leave something useful behind', summary: 'Join a cycle and document the context that may be shared.' },
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
  const items = POSTERS.filter(({ program }) => program.slug !== 'apple-developer-academy-batch-2027');
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
      <p className="kad-field-posters__hint">{isEnglish ? '4 posters · swipe to see all →' : '4 poster · geser untuk melihat semua →'}</p>
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
              <p className="kad-eyebrow">02 · Field Notes</p>
              <h2 id="field-notes-heading">
                {isEnglish ? <>Small things that make a city feel <em>closer.</em></> : <>Hal-hal kecil yang membuat kota terasa <em>dekat.</em></>}
              </h2>
            </div>
            <p>{isEnglish ? 'A journal rhythm for curiosity, not a benefits catalogue.' : 'Ritme jurnal untuk rasa penasaran, bukan katalog manfaat.'}</p>
          </div>

          <div className="kad-field-story__layout">
            <div>
              <p className="kad-field-story__lede">
                {isEnglish ? 'Start with the question you bring. Then find people, programs, and conversations that help you move.' : 'Mulai dari pertanyaan yang kamu bawa. Lalu temukan orang, program, dan percakapan yang membantu kamu melangkah.'}
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
                  <strong>{isEnglish ? 'Learn together, one step at a time.' : 'Belajar bersama, satu langkah sekali.'}</strong>
                  <span>{isEnglish ? 'Public KADSocialHub source · confirm the latest status' : 'Sumber publik KADSocialHub · status terbaru perlu dikonfirmasi'}</span>
                </figcaption>
              </figure>
            )}
          </div>

          <PosterRail locale={locale} />

          <div className="kad-evidence-band" data-event-count="0" data-event-state="empty">
            <strong>{isEnglish ? 'The public schedule is not synced yet.' : 'Agenda publik belum disinkronkan.'}</strong>
            <p>
              {isEnglish ? 'The posters above are approved program documentation, not a promise that each session is still active. Confirm schedule, capacity, and registration on Discord.' : 'Poster di atas adalah dokumentasi program yang disetujui, bukan janji bahwa sesinya masih aktif. Jadwal, kapasitas, dan pendaftaran dikonfirmasi di Discord.'}
            </p>
            <a href={localizedPath(locale, '/events')}>{isEnglish ? 'Check schedule status' : 'Lihat status agenda'}</a>
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
