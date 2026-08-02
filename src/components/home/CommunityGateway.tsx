import { ArrowUpRight, CalendarDays, Compass, HandHeart, UsersRound } from 'lucide-react';
import { DISCORD_URL, PROGRAMS, localizedPath } from '@/content/community-site';
import type { Locale } from '@/i18n/constants';

interface CommunityGatewayProps {
  locale?: Locale;
}

const JOURNEY = [
  {
    icon: Compass,
    title: 'Temukan pintu masuk',
    summary: 'Mulai dari program bahasa, pendidikan, karier, atau pertanyaan hidup di luar negeri.',
  },
  {
    icon: UsersRound,
    title: 'Ikuti ritmenya',
    summary: 'Periksa sumber publik, lalu konfirmasi jadwal dan kapasitas terbaru di Discord.',
  },
  {
    icon: HandHeart,
    title: 'Berkontribusi kembali',
    summary: 'Bantu satu program, dokumentasikan pekerjaan, dan serahkan konteks ke siklus berikutnya.',
  },
] as const;

export function CommunityGateway({ locale = 'id' }: CommunityGatewayProps) {
  const href = (path: string): string => localizedPath(locale, path);

  return (
    <div data-interface-slice="community-home" data-program-count={PROGRAMS.length}>
      <section className="kad-section kad-section--sky" aria-labelledby="start-heading">
        <div className="kad-container">
          <div className="kad-section__header">
            <p className="kad-eyebrow">Mulai dari sini</p>
            <h2 id="start-heading">Masuk lewat kebutuhanmu, bukan lewat kebisingan.</h2>
            <p>
              Website ini menjadi peta publik. Percakapan, konfirmasi, dan kegiatan komunitas
              tetap berlangsung di Discord.
            </p>
          </div>
          <div className="kad-grid kad-grid--three kad-journey">
            {JOURNEY.map(({ icon: Icon, title, summary }) => (
              <article key={title} className="kad-card">
                <div className="kad-visual-marker">
                  <Icon aria-hidden="true" size={24} />
                </div>
                <h3>{title}</h3>
                <p>{summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kad-section" aria-labelledby="program-heading">
        <div className="kad-container">
          <div className="kad-section__header">
            <p className="kad-eyebrow">Program unggulan</p>
            <h2 id="program-heading">Kegiatan nyata, dengan sumber yang bisa diperiksa.</h2>
            <p>
              Lima program awal berasal dari pengumuman publik KADSocialHub. Status terbaru
              tetap dikonfirmasi sebelum kamu datang.
            </p>
          </div>
          <div className="kad-grid kad-grid--three">
            {PROGRAMS.slice(0, 3).map((program, index) => (
              <article key={program.slug} className="kad-card kad-program-preview">
                {program.media[0] && (
                  <a
                    className="kad-program-preview__media"
                    href={href(`/programs/${program.slug}`)}
                    aria-label={`Lihat detail ${program.title}`}
                  >
                    <img
                      src={program.media[0].src}
                      alt={program.media[0].alt}
                      width={program.media[0].width}
                      height={program.media[0].height}
                      loading="eager"
                      decoding="async"
                    />
                  </a>
                )}
                <div className="kad-visual-marker kad-program-preview__number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <span className="kad-pill">{program.category}</span>
                <h3>{program.title}</h3>
                <p>{program.summary}</p>
                <div className="kad-card__meta">
                  <span className="kad-status" data-state="confirm">
                    Konfirmasi di Discord
                  </span>
                  <a className="kad-source-link" href={href(`/programs/${program.slug}`)}>
                    Lihat program
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="kad-actions">
            <a className="kad-button kad-button--outline" href={href('/programs')}>
              Lihat semua 5 program
            </a>
          </div>
        </div>
      </section>

      <section className="kad-section kad-section--sky" aria-labelledby="event-preview-heading">
        <div className="kad-container kad-split">
          <div className="kad-section__header">
            <p className="kad-eyebrow">Agenda publik</p>
            <h2 id="event-preview-heading">Jadwal muncul setelah datanya siap.</h2>
            <p>
              Kami tidak mengubah posting lama menjadi agenda aktif. Sampai sinkronisasi
              publik tersedia, jadwal terbaru dikonfirmasi langsung di Discord.
            </p>
          </div>
          <div className="kad-empty-state" data-event-count="0" data-event-state="empty">
            <CalendarDays aria-hidden="true" size={32} />
            <span className="kad-status" data-state="pending">
              0 acara publik
            </span>
            <h3>Belum ada acara yang dipublikasikan.</h3>
            <p>Waktu, pendaftaran, dan dokumentasi akan tampil setelah disetujui.</p>
            <div className="kad-actions">
              <a className="kad-button kad-button--ghost" href={href('/events')}>
                Lihat status agenda
              </a>
              <a
                className="kad-source-link"
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Konfirmasi di Discord <ArrowUpRight aria-hidden="true" size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="kad-section" aria-labelledby="community-next-heading">
        <div className="kad-container kad-crosslink">
          <div>
            <p className="kad-eyebrow" style={{ color: 'white' }}>
              Kerja komunitas
            </p>
            <h2 id="community-next-heading">Ikut program, bantu satu siklus, tinggalkan konteks.</h2>
            <p>
              Pelajari cara volunteer bekerja dan bagaimana dukungan bisa memperkuat program
              tanpa mengorbankan privasi.
            </p>
          </div>
          <div className="kad-actions">
            <a className="kad-button" href={href('/volunteer')}>
              Lihat siklus volunteer
            </a>
            <a className="kad-button" href={href('/support')}>
              Proposal dukungan
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CommunityGateway;
