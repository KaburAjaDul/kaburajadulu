import { ArrowUpRight } from 'lucide-react';
import { localizedPath } from '@/content/community-site';
import type { Locale } from '@/i18n/constants';

interface CommunityGatewayProps {
  locale?: Locale;
}

export function CommunityGateway({ locale = 'id' }: CommunityGatewayProps) {
  const contentLocale = locale === 'id' ? 'id' : 'en';
  const paths = contentLocale === 'id'
    ? [
        { number: '01', label: 'Program', title: 'Cari ruang belajar yang masih berjalan', body: 'Buka tujuan, susunan Series, dan Session yang sudah tercatat.', action: 'Buka program', href: localizedPath(locale, '/programs') },
        { number: '02', label: 'Agenda', title: 'Lihat apa yang berlangsung berikutnya', body: 'Tidak perlu daftar. Buka detail acara, lalu masuk saat waktunya tiba.', action: 'Lihat agenda', href: localizedPath(locale, '/events') },
        { number: '03', label: 'Relawan', title: 'Bantu satu pekerjaan yang jelas', body: 'Periksa lingkup, penanggung jawab, dan jalur penerimaan yang tersedia.', action: 'Lihat pekerjaan relawan', href: localizedPath(locale, '/volunteer') },
      ]
    : [
        { number: '01', label: 'Programs', title: 'Find a learning space that is still active', body: 'Open its purpose, Series structure, and recorded Sessions.', action: 'Open programs', href: localizedPath(locale, '/programs') },
        { number: '02', label: 'Agenda', title: 'See what is happening next', body: 'No registration is needed. Open the event detail, then join when it starts.', action: 'View the agenda', href: localizedPath(locale, '/events') },
        { number: '03', label: 'Volunteer', title: 'Help with one clearly scoped task', body: 'Check its scope, owner, and the intake path that is actually available.', action: 'View volunteer work', href: localizedPath(locale, '/volunteer') },
      ];

  return (
    <section className="kad-home-dispatch" lang={contentLocale} aria-labelledby="home-dispatch-title">
      <div className="kad-container">
        <header className="kad-home-dispatch__header">
          <p>01 · {contentLocale === 'id' ? 'Pintu masuk' : 'Ways in'}</p>
          <h2 id="home-dispatch-title">
            {contentLocale === 'id' ? 'Pilih sesuatu yang bisa ditindaklanjuti.' : 'Choose something you can act on.'}
          </h2>
          <span>{contentLocale === 'id' ? 'Website memberi konteks. Discord menjadi tempat percakapannya.' : 'The website gives context. Discord is where the conversation continues.'}</span>
        </header>

        <ol className="kad-home-dispatch__list">
          {paths.map((path) => (
            <li key={path.href}>
              <a href={path.href}>
                <span className="kad-home-dispatch__number">{path.number}</span>
                <span className="kad-home-dispatch__copy">
                  <small>{path.label}</small>
                  <strong>{path.title}</strong>
                  <span>{path.body}</span>
                </span>
                <span className="kad-home-dispatch__action">
                  {path.action} <ArrowUpRight aria-hidden="true" size={18} />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default CommunityGateway;
