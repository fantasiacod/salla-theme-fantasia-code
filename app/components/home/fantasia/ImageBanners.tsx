import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { Banner } from '../../fantasia';
import { href, isOn, pick, text } from '../../../lib/fantasia';
import { rows, str, type BlockProps } from './shared';

/** `home.image-banners`: the merchant's own banner artwork, 1–3 per row. */
export function ImageBanners({ data }: BlockProps) {
  const { locale } = useTranslation();
  const banners = rows(data.banners).filter((b) => str(b.image));
  if (!banners.length) return null;
  return (
    <div className={data.full_width === true ? '' : 'container'}>
      <div className={`fc-banners__grid fc-banners__grid--${pick(data.columns, '1')}`}>
        {banners.map((b, i) => (
          <Banner
            key={i}
            image={str(b.image)}
            mobile={str(b.mobile_image) || null}
            alt={text(b.alt, locale)}
            url={href(b.url)}
            rounded={isOn(data.rounded)}
            zoom={isOn(data.hover_zoom)}
          />
        ))}
      </div>
    </div>
  );
}
