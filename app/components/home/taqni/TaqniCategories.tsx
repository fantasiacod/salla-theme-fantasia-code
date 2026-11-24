import { Link } from '@salla.sa/twilight-theme-engine/common';

interface CategoryTile {
  icon?: string;
  title?: string;
  subtitle?: string;
  url?: string | null;
}

export interface TaqniCategoriesProps {
  data: { items?: CategoryTile[]; [key: string]: unknown };
}

/** `home.taqni-categories`: icon tiles linking to sections. The first one is highlighted. */
export function TaqniCategories({ data }: TaqniCategoriesProps) {
  const items = data.items ?? [];
  if (!items.length) return null;

  return (
    <div className="container">
      <div className="tq-cats__grid">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.url || '#'}
            className={`tq-cat${index === 0 ? ' is-active' : ''}`}
          >
            <span className="tq-cat__icon">
              <i className={item.icon} aria-hidden="true" />
            </span>
            <span className="tq-cat__text">
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
