import { Link } from '@salla.sa/twilight-theme-engine/common';
import heroFallback from '../../../assets/taqni/hero.png';

interface HeroFeature {
  icon?: string;
  title?: string;
  text?: string;
}

export interface TaqniHeroProps {
  data: {
    badge?: string;
    title?: string;
    highlight?: string;
    description?: string;
    image?: string | null;
    features?: HeroFeature[];
    primary_text?: string;
    primary_url?: string | null;
    secondary_text?: string;
    secondary_url?: string | null;
    [key: string]: unknown;
  };
}

/** `home.taqni-hero`: the store's main banner. Falls back to the bundled illustration. */
export function TaqniHero({ data }: TaqniHeroProps) {
  const features = data.features ?? [];

  return (
    <div className="container tq-hero__inner">
      <div className="tq-hero__content">
        {data.badge && (
          <span className="tq-hero__badge">
            <span className="tq-dot" />
            {data.badge}
          </span>
        )}
        <h2 className="tq-hero__title">
          <span>{data.title}</span>
          {data.highlight && <span className="tq-hero__highlight">{data.highlight}</span>}
        </h2>
        {data.description && <p className="tq-hero__desc">{data.description}</p>}

        {features.length > 0 && (
          <div className="tq-hero__features">
            {features.map((item, index) => (
              <div className="tq-hero__feature" key={index}>
                <span className="tq-icon-circle">
                  <i className={item.icon} aria-hidden="true" />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="tq-hero__actions">
          {data.primary_text && (
            <Link to={data.primary_url || '#'} className="tq-btn tq-btn--primary">
              {data.primary_text} <i className="sicon-arrow-left tq-flip" aria-hidden="true" />
            </Link>
          )}
          {data.secondary_text && (
            <Link to={data.secondary_url || '#'} className="tq-btn tq-btn--outline">
              <i className="sicon-play" aria-hidden="true" /> {data.secondary_text}
            </Link>
          )}
        </div>
      </div>

      <div className="tq-hero__media">
        <img
          src={data.image || heroFallback}
          alt={data.title ?? ''}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </div>
  );
}
