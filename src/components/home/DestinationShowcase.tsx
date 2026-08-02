'use client';

import { useEffect, useMemo, useState } from 'react';
import DestinationCard from '@/components/destination-card';
import { translate } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/constants';
import { cn } from '@/lib/utils';

interface DestinationShowcaseProps {
  locale?: Locale;
}

const AUTO_ADVANCE_MS = 7_000;

const destinations = [
  { id: 'seoul', imageUrl: '/images/seoul.webp', locationKey: 'destinations.cities.seoul' },
  { id: 'tokyo', imageUrl: '/images/tokyo.webp', locationKey: 'destinations.cities.tokyo' },
  {
    id: 'singapore',
    imageUrl: '/images/singapore.webp',
    locationKey: 'destinations.cities.singapore',
  },
  { id: 'berlin', imageUrl: '/images/berlin_2.webp', locationKey: 'destinations.cities.berlin' },
] as const;

const collageSlots = [
  {
    className: 'left-0 top-[22%] w-[28%] sm:w-[28%] aspect-[1.5/1]',
    transform: 'rotate(7.83deg)',
    sizes: '(max-width: 640px) 28vw, 28vw',
  },
  {
    className: 'right-0 top-[-8%] w-[23%] sm:w-[23%] aspect-[1.56/1]',
    transform: 'rotate(-9.5deg)',
    sizes: '(max-width: 640px) 23vw, 23vw',
  },
  {
    className: 'right-[12%] bottom-[4%] w-[28%] sm:w-[28%] aspect-[1.5/1]',
    transform: 'rotate(-6deg)',
    sizes: '(max-width: 640px) 28vw, 28vw',
  },
] as const;

export default function DestinationShowcase({ locale = 'id' }: DestinationShowcaseProps) {
  const t = (key: string) => translate(locale, key);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, [isPaused, prefersReducedMotion]);

  const activeDestination = destinations[activeIndex];
  const activeLocation = t(activeDestination.locationKey);
  const autoplayPaused = prefersReducedMotion || isPaused;
  const previewDestinations = useMemo(
    () => destinations.filter((_, index) => index !== activeIndex),
    [activeIndex],
  );

  const selectDestination = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
  };

  const toggleAutoplay = () => {
    if (!prefersReducedMotion) setIsPaused((current) => !current);
  };

  return (
    <section
      className="py-12"
      data-testid="destination-showcase"
      aria-labelledby="destinations-heading"
    >
      <div className="container mx-auto px-4">
        <h2 id="destinations-heading" className="text-3xl font-bold text-center mb-2">
          {t('destinations.headline')}
        </h2>
        <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto">
          {t('destinations.subheadline')}
        </p>

        {/* Desktop view */}
        <div className="hidden sm:block relative mx-auto aspect-[16/9] md:aspect-[16/9] w-full max-w-7xl">
          {/* The featured card rotates while the surrounding cards stay as a visual collage. */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[90%] h-auto aspect-[2/1] z-0">
            <div
              key={activeDestination.id}
              data-testid="featured-destination"
              data-destination={activeDestination.id}
              aria-live="polite"
              aria-atomic="true"
            >
              <DestinationCard
                imageUrl={activeDestination.imageUrl}
                location={activeLocation}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 90vw, 90vw"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          {previewDestinations.map((destination, previewIndex) => {
            const slot = collageSlots[previewIndex];

            return (
              <div key={destination.id} className={cn('absolute h-auto z-10', slot.className)}>
                <DestinationCard
                  imageUrl={destination.imageUrl}
                  location={t(destination.locationKey)}
                  sizes={slot.sizes}
                  style={{ width: '100%', height: '100%', transform: slot.transform }}
                />
              </div>
            );
          })}

          {/* Text overlay */}
          <div className="absolute left-[20%] bottom-[1%] text-primary text-xl md:text-2xl lg:text-3xl font-caveat z-20">
            {t('destinations.view_all')}
          </div>
        </div>

        <div
          className="hidden sm:flex flex-wrap justify-center items-center gap-2 mt-5"
          role="group"
          aria-label={t('destinations.headline')}
        >
          {destinations.map((destination, index) => (
            <button
              key={destination.id}
              type="button"
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                activeIndex === index
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              )}
              data-testid="destination-selector"
              aria-label={`${t('destinations.show')} ${t(destination.locationKey)}`}
              aria-pressed={activeIndex === index}
              onFocus={() => setIsPaused(true)}
              onClick={() => selectDestination(index)}
            >
              {t(destination.locationKey)}
            </button>
          ))}
          <button
            type="button"
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              autoplayPaused
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-primary text-white',
            )}
            data-testid="destination-autoplay-toggle"
            aria-label={autoplayPaused ? t('destinations.resume') : t('destinations.pause')}
            aria-pressed={autoplayPaused}
            disabled={prefersReducedMotion}
            onClick={toggleAutoplay}
          >
            {autoplayPaused ? t('destinations.resume') : t('destinations.pause')}
          </button>
        </div>

        {/* Mobile view */}
        <div className="block sm:hidden mt-8">
          <div
            data-testid="featured-destination"
            data-destination={activeDestination.id}
            aria-live="polite"
            aria-atomic="true"
          >
            <DestinationCard
              imageUrl={activeDestination.imageUrl}
              location={activeLocation}
              className="aspect-[1.5/1]"
              sizes="(max-width: 640px) 100vw, 0vw"
            />
          </div>
          <div
            className="grid grid-cols-2 gap-2 mt-4"
            role="group"
            aria-label={t('destinations.headline')}
          >
            {destinations.map((destination, index) => (
              <button
                key={destination.id}
                type="button"
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  activeIndex === index
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                )}
                data-testid="destination-selector"
                aria-label={`${t('destinations.show')} ${t(destination.locationKey)}`}
                aria-pressed={activeIndex === index}
                onFocus={() => setIsPaused(true)}
                onClick={() => selectDestination(index)}
              >
                {t(destination.locationKey)}
              </button>
            ))}
            <button
              type="button"
              className={cn(
                'col-span-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                autoplayPaused
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-primary text-white',
              )}
              data-testid="destination-autoplay-toggle"
              aria-label={autoplayPaused ? t('destinations.resume') : t('destinations.pause')}
              aria-pressed={autoplayPaused}
              disabled={prefersReducedMotion}
              onClick={toggleAutoplay}
            >
              {autoplayPaused ? t('destinations.resume') : t('destinations.pause')}
            </button>
          </div>
          <div className="text-left text-primary text-xl font-caveat mt-4 pl-4">
            {t('destinations.view_all')}
          </div>
        </div>
      </div>
    </section>
  );
}
