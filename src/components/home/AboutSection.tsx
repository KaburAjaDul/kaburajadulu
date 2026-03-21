'use client';

import { GithubButton } from '../../components/github-button';
import { translate } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/constants';

interface AboutSectionProps {
  locale?: Locale;
}

export function AboutSection({ locale = 'id' }: AboutSectionProps) {
  const t = (key: string) => translate(locale, key);

  const handleGithubClick = () => {
    if (typeof window !== 'undefined') {
      window.open('https://github.com/KaburAjaDul/kaburajadulu', '_blank');
    }
  };

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-6 md:mb-8">
          {t('about.headline')}
        </h2>
        <div className="max-w-3xl mx-auto text-lg text-center">
          <p className="mb-6 font-light">
            {t('about.subheadline')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center mt-10 gap-6 sm:gap-6">
          <GithubButton
            className="px-6 py-2 text-base w-full sm:w-auto"
            ariaLabel={t('about.github_contributor')}
            onClick={handleGithubClick}
          >
            {t('about.github_contributor')}
          </GithubButton>
          <a
            href="mailto:kaburajadulusocials@gmail.com"
            className="text-base underline decoration-1 hover:text-blue-600 transition-colors mt-2 sm:mt-0"
            aria-label={t('about.feature2_title')}
          >
            {t('about.feature2_title')}
          </a>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
