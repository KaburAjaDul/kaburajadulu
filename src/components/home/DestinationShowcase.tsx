'use client';

import DestinationCard from '@/components/destination-card';
import { translate } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/constants';

interface DestinationShowcaseProps {
  locale?: Locale;
}

export default function DestinationShowcase({ locale = 'id' }: DestinationShowcaseProps) {
  const t = (key: string) => translate(locale, key);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">
          {t('destinations.headline')}
        </h2>
        <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto">
          {t('destinations.subheadline')}
        </p>

        {/* Desktop view */}
        <div className="hidden sm:block relative mx-auto aspect-[16/9] md:aspect-[16/9] w-full max-w-7xl">
          {/* Seoul - large centered background card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[90%] h-auto aspect-[2/1] z-0">
            <DestinationCard
              imageUrl="/images/seoul.webp"
              location="Seoul, Korea Selatan"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 90vw, 90vw"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Tokyo */}
          <div className="absolute left-[-3%] top-[22%] w-[28%] sm:w-[28%] h-auto aspect-[1.5/1] z-10">
            <DestinationCard
              imageUrl="/images/tokyo.webp"
              location="Tokyo, Jepang"
              sizes="(max-width: 640px) 28vw, 28vw"
              style={{ width: '100%', height: '100%', transform: 'rotate(7.83deg)' }}
            />
          </div>

          {/* Singapore */}
          <div className="absolute right-[-2%] top-[-8%] w-[23%] sm:w-[23%] h-auto aspect-[1.56/1] z-10">
            <DestinationCard
              imageUrl="/images/singapore.webp"
              location="Singapura"
              sizes="(max-width: 640px) 23vw, 23vw"
              style={{ width: '100%', height: '100%', transform: 'rotate(-9.5deg)' }}
            />
          </div>

          {/* Berlin */}
          <div className="absolute right-[12%] bottom-[4%] w-[28%] sm:w-[28%] h-auto aspect-[1.5/1] z-10">
            <DestinationCard
              imageUrl="/images/berlin_2.webp"
              location="Berlin, Jerman"
              sizes="(max-width: 640px) 28vw, 28vw"
              style={{ width: '100%', height: '100%', transform: 'rotate(-6deg)' }}
            />
          </div>

          {/* Text overlay */}
          <div className="absolute left-[20%] bottom-[1%] text-primary text-xl md:text-2xl lg:text-3xl font-caveat z-20">
            {t('destinations.view_all')}
          </div>
        </div>

        {/* Mobile view */}
        <div className="block sm:hidden mt-8">
          <div className="grid grid-cols-2 gap-4">
            <DestinationCard
              imageUrl="/images/seoul.webp"
              location="Seoul, South Korea"
              className="aspect-[1.5/1]"
              sizes="(max-width: 640px) 50vw, 0vw"
            />
            <DestinationCard
              imageUrl="/images/tokyo.webp"
              location="Tokyo, Japan"
              className="aspect-[1.5/1]"
              sizes="(max-width: 640px) 50vw, 0vw"
            />
            <DestinationCard
              imageUrl="/images/singapore.webp"
              location="Singapore"
              className="aspect-[1.5/1]"
              sizes="(max-width: 640px) 50vw, 0vw"
            />
            <DestinationCard
              imageUrl="/images/berlin.webp"
              location="Berlin, Germany"
              className="aspect-[1.5/1]"
              sizes="(max-width: 640px) 50vw, 0vw"
            />
          </div>
          <div className="text-left text-primary text-xl font-caveat mt-4 pl-4">
            {t('destinations.view_all')}
          </div>
        </div>
      </div>
    </section>
  );
}
