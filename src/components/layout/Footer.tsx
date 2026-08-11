import { EMAIL } from '@/constants/contacts';
import {
  DISCORD_URL,
  GITHUB_URL,
  INSTAGRAM_URL,
  X_URL,
} from '@/constants/urls';
import type { Locale } from '@/i18n/constants';
import { translate } from '@/i18n/dictionaries';

interface FooterProps {
  locale?: Locale;
}

const TASK_LINKS = [
  { code: '01', key: 'programs', path: '/programs' },
  { code: '02', key: 'events', path: '/events' },
  { code: '03', key: 'volunteer', path: '/volunteer' },
] as const;

const RECORD_LINKS = [
  { key: 'community', path: '/community' },
  { key: 'stories', path: '/stories' },
  { key: 'history', path: '/about/history' },
  { key: 'impact', path: '/community/impact' },
  { key: 'credits', path: '/community/credits' },
  { key: 'support', path: '/support' },
] as const;

function localizedPath(locale: Locale, path: string): string {
  return `${locale === 'id' ? '' : `/${locale}`}${path}`;
}

export function Footer({ locale = 'id' }: FooterProps) {
  const contentLocale = locale === 'id' ? 'id' : 'en';
  const t = (key: string) => translate(contentLocale, key);
  const homePath = localizedPath(locale, '/');

  return (
    <footer
      className="kad-footer"
      lang={contentLocale}
      dir="ltr"
      data-requested-locale={locale}
      data-footer-system="field-station-handoff"
    >
      <div className="kad-container kad-footer__handoff">
        <div className="kad-footer__intro">
          <div className="kad-footer__identity">
            <a className="kad-footer__brand" href={homePath} aria-label={`KaburAjaDulu, ${t('nav.home')}`}>
              <img src="/favicon.svg" alt="" width={38} height={38} aria-hidden="true" />
              <span>KaburAjaDulu</span>
            </a>
            <span className="kad-footer__route">KAD/END</span>
          </div>

          <p className="kad-footer__eyebrow">{t('footer.eyebrow')}</p>
          <h2>{t('footer.heading')}</h2>
          <p className="kad-footer__summary">{t('footer.summary')}</p>
        </div>

        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="kad-footer__discord"
          data-footer-primary-action
        >
          <span className="kad-footer__discord-kicker">{t('footer.discord_kicker')}</span>
          <strong>{t('footer.join_discord')}</strong>
          <span className="kad-footer__discord-note">{t('footer.discord_note')}</span>
          <span className="kad-footer__discord-arrow" aria-hidden="true">↗</span>
        </a>
      </div>

      <nav className="kad-container kad-footer__tasks" aria-label={t('footer.task_navigation')}>
        {TASK_LINKS.map((item) => (
          <a
            key={item.path}
            href={localizedPath(locale, item.path)}
            data-footer-task={item.key}
          >
            <span className="kad-footer__task-code" aria-hidden="true">{item.code}</span>
            <span className="kad-footer__task-copy">
              <strong>{t(`footer.task_${item.key}_title`)}</strong>
              <span>{t(`footer.task_${item.key}_description`)}</span>
            </span>
            <span className="kad-footer__task-action">
              {t(`footer.task_${item.key}_action`)} <span aria-hidden="true">→</span>
            </span>
          </a>
        ))}
      </nav>

      <div className="kad-container kad-footer__index">
        <section aria-labelledby="footer-records-title">
          <p id="footer-records-title" className="kad-footer__index-label">
            {t('footer.public_records')}
          </p>
          <ul className="kad-footer__record-links">
            {RECORD_LINKS.map((item) => (
              <li key={item.path}>
                <a href={localizedPath(locale, item.path)}>{t(`footer.record_${item.key}`)}</a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="footer-sources-title">
          <p id="footer-sources-title" className="kad-footer__index-label">
            {t('footer.public_sources')}
          </p>
          <ul className="kad-footer__source-links">
            <li><a href={X_URL} target="_blank" rel="noopener noreferrer">X · @KADSocialHub ↗</a></li>
            <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram · @kadsocialhub ↗</a></li>
            <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub · {t('footer.website_repository')} ↗</a></li>
            <li><a href={`mailto:${EMAIL}`}>{t('footer.send_correction')} →</a></li>
          </ul>
        </section>
      </div>

      <div className="kad-container kad-footer__bottom">
        <p>© 2026 KaburAjaDulu.</p>
        <p>{t('footer.evidence_note')}</p>
      </div>
    </footer>
  );
}

export default Footer;
