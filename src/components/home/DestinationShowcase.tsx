'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/constants';
import { cn } from '@/lib/utils';

interface DestinationShowcaseProps {
  locale?: Locale;
}

const AUTO_ADVANCE_MS = 7_000;

const destinations = [
  { id: 'seoul', imageUrl: '/images/seoul.webp', idLabel: 'Seoul, Korea Selatan', enLabel: 'Seoul, South Korea', idNote: 'hangat, cepat, penuh kemungkinan', enNote: 'warm, fast, full of possibility' },
  { id: 'tokyo', imageUrl: '/images/tokyo.webp', idLabel: 'Tokyo, Jepang', enLabel: 'Tokyo, Japan', idNote: 'detail, ritme, ruang untuk tersesat', enNote: 'detail, rhythm, room to get lost' },
  { id: 'singapore', imageUrl: '/images/singapore.webp', idLabel: 'Singapura', enLabel: 'Singapore', idNote: 'terhubung, jernih, mulai dari kecil', enNote: 'connected, clear, start small' },
  { id: 'berlin', imageUrl: '/images/berlin_2.webp', idLabel: 'Berlin, Jerman', enLabel: 'Berlin, Germany', idNote: 'berani, terbuka, bikin sendiri', enNote: 'bold, open, make your own way' },
] as const;

export default function DestinationShowcase({ locale = 'id' }: DestinationShowcaseProps) {
  const contentLocale = locale === 'id' ? 'id' : 'en';
  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener?.('change', updatePreference);
    return () => mediaQuery.removeEventListener?.('change', updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % destinations.length);
      setIsChanging(true);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(interval);
  }, [isPaused, prefersReducedMotion]);

  useEffect(() => {
    if (!isChanging) return;
    const frame = window.requestAnimationFrame(() => setIsChanging(false));
    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, isChanging]);

  const activeDestination = destinations[activeIndex];
  const activeLocation = contentLocale === 'id' ? activeDestination.idLabel : activeDestination.enLabel;
  const autoplayPaused = prefersReducedMotion || isPaused;
  const copy = contentLocale === 'id'
    ? {
        route: '02 · Kota-kota KAD',
        title: 'Empat kota. Banyak alasan untuk mulai bertanya.',
        summary: 'Pilih kota yang memanggil rasa penasaranmu. Ini titik masuk visual, bukan peringkat popularitas anggota.',
        pause: 'Jeda rotasi',
        resume: 'Lanjutkan rotasi',
        show: 'Tampilkan',
        visualNote: 'Visual konteks. Hubungan kota dan program belum diklaim.',
      }
    : {
        route: '02 · KAD cities',
        title: 'Four cities. Plenty of reasons to start asking.',
        summary: 'Choose the city that catches your curiosity. This is a visual entry point, not a member-popularity ranking.',
        pause: 'Pause rotation',
        resume: 'Resume rotation',
        show: 'Show',
        visualNote: 'Context image. No city-to-program relationship is claimed.',
      };

  const selectDestination = (index: number) => {
    setActiveIndex(index);
    setIsChanging(true);
    setIsPaused(true);
  };

  const toggleAutoplay = () => {
    if (!prefersReducedMotion) setIsPaused((current) => !current);
  };

  return (
    <section
      className="kad-city-atlas"
      data-testid="destination-showcase"
      data-requested-locale={locale}
      lang={contentLocale}
      aria-labelledby="destinations-heading"
    >
      <div className="kad-container">
        <header className="kad-city-atlas__header">
          <p>{copy.route}</p>
          <h2 id="destinations-heading">{copy.title}</h2>
          <span>{copy.summary}</span>
        </header>

        <span
          className="sr-only"
          data-testid="destination-live-status"
          aria-live={autoplayPaused ? 'polite' : 'off'}
          aria-atomic="true"
        >
          {activeLocation}
        </span>

        <div className="kad-city-atlas__stage">
          <figure
            data-testid="featured-destination"
            data-destination={activeDestination.id}
            className={cn('kad-city-atlas__featured', isChanging && 'is-changing')}
            aria-live="off"
          >
            <img src={activeDestination.imageUrl} alt={activeLocation} width="1200" height="800" />
            <figcaption>
              <span>{String(activeIndex + 1).padStart(2, '0')} / 04</span>
              <strong>{activeLocation}</strong>
              <small>{contentLocale === 'id' ? activeDestination.idNote : activeDestination.enNote}</small>
            </figcaption>
          </figure>

          <div className="kad-city-atlas__selectors" role="group" aria-label={copy.title}>
            {destinations.map((destination, index) => {
              const label = contentLocale === 'id' ? destination.idLabel : destination.enLabel;
              return (
                <button
                  key={destination.id}
                  type="button"
                  className={cn('kad-city-atlas__selector', activeIndex === index && 'is-active')}
                  data-testid="destination-selector"
                  aria-label={`${copy.show} ${label}`}
                  aria-pressed={activeIndex === index}
                  onFocus={() => setIsPaused(true)}
                  onClick={() => selectDestination(index)}
                >
                  <img src={destination.imageUrl} alt="" width="320" height="220" aria-hidden="true" />
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{label}</strong>
                </button>
              );
            })}
          </div>
        </div>

        <footer className="kad-city-atlas__footer">
          <span>{copy.visualNote}</span>
          <button
            type="button"
            data-testid="destination-autoplay-toggle"
            aria-label={autoplayPaused ? copy.resume : copy.pause}
            aria-pressed={autoplayPaused}
            disabled={prefersReducedMotion}
            onClick={toggleAutoplay}
          >
            {autoplayPaused ? copy.resume : copy.pause}
          </button>
        </footer>
      </div>
    </section>
  );
}
