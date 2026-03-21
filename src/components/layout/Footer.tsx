'use client';

import { translate } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/constants';

interface FooterProps {
  locale?: Locale;
}

export function Footer({ locale = 'id' }: FooterProps) {
  const t = (key: string) => translate(locale, key);

  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-4">
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            {t('footer.tagline')}
          </p>
        </div>

        {/* Footer Bottom */}
        <div className="pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
