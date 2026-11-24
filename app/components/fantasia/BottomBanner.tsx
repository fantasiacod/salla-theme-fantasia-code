import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { href, text } from '../../lib/fantasia';
import { Banner } from './Banner';

/** The `bottom_banner*` settings: one banner above the footer, on every page or only the home page. */
export function BottomBanner({ isHome }: { isHome: boolean }) {
  const { theme } = useTwilight();
  const { locale } = useTranslation();
  const s = (theme?.settings ?? {}) as Record<string, unknown>;
  const image = typeof s.bottom_banner_image === 'string' ? s.bottom_banner_image : '';
  if (s.bottom_banner !== true || !image || (s.bottom_banner_home_only === true && !isHome)) return null;

  return (
    <section className="container fc-bottom-banner" data-testid="fc-bottom-banner">
      <Banner
        image={image}
        mobile={typeof s.bottom_banner_mobile === 'string' ? s.bottom_banner_mobile : null}
        alt={text(s.bottom_banner_alt, locale)}
        url={href(s.bottom_banner_link)}
      />
    </section>
  );
}
