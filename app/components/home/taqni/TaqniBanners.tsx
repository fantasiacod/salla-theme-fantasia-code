import { Link } from '@salla.sa/twilight-theme-engine/common';
import bannerPhp from '../../../assets/taqni/banner-php.png';
import bannerSites from '../../../assets/taqni/banner-sites.png';
import bannerSystems from '../../../assets/taqni/banner-systems.png';

const FALLBACK_IMAGES = [bannerPhp, bannerSites, bannerSystems];
const STYLES = ['blue', 'purple', 'teal'];

interface PromoBanner {
  title?: string;
  button?: string;
  url?: string | null;
  image?: string | null;
}

export interface TaqniBannersProps {
  data: { banners?: PromoBanner[]; [key: string]: unknown };
}

/** `home.taqni-banners`: gradient promo cards; colours and fallback images cycle every three. */
export function TaqniBanners({ data }: TaqniBannersProps) {
  const banners = data.banners ?? [];
  if (!banners.length) return null;

  return (
    <div className="container">
      <div className="tq-banners__grid">
        {banners.map((banner, index) => (
          <Link
            key={index}
            to={banner.url || '#'}
            className={`tq-banner tq-banner--${STYLES[index % 3]}`}
          >
            <div className="tq-banner__text">
              <h3>{banner.title}</h3>
              {banner.button && (
                <span className="tq-banner__btn">
                  <i className="sicon-arrow-left tq-flip" aria-hidden="true" /> {banner.button}
                </span>
              )}
            </div>
            <img
              className="tq-banner__img"
              src={banner.image || FALLBACK_IMAGES[index % 3]}
              alt={banner.title ?? ''}
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
