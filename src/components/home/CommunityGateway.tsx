import LandingDirection from '@/components/home/LandingDirection';
import type { Locale } from '@/i18n/constants';

interface CommunityGatewayProps {
  locale?: Locale;
}

export function CommunityGateway({ locale = 'id' }: CommunityGatewayProps) {
  return <LandingDirection direction="field-notes" locale={locale} showFallbackNotice={false} />;
}

export default CommunityGateway;
