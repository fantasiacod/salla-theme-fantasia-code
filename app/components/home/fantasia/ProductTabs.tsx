import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { product as productApi } from '@salla.sa/twilight-theme-engine/api/product';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { ProductCard } from '../../product';
import { href, pick } from '../../../lib/fantasia';
import { selectedIds } from '../taqni/TaqniProducts';
import { str, type BlockProps } from './shared';

function TabProducts({ ids }: { ids: number[] }) {
  const { data } = useQuery(productApi.queries.list({ source: 'selected', sourceValue: ids, perPage: 12 }));
  const items = data?.items ?? [];
  if (!items.length) return null;
  return (
    <div className="s-products-list-wrapper s-products-list-vertical-cards fc-tab-grid">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} layout="vertical" />
      ))}
    </div>
  );
}

/** `home.product-tabs`: up to four tabs of picked products (apps, plugins, templates…). */
export function ProductTabs({ data }: BlockProps) {
  const { t } = useTranslation();
  const tabs = [1, 2, 3, 4]
    .map((i) => ({
      title: str(data[`tab${i}_title`]),
      icon: str(data[`tab${i}_icon`]),
      ids: selectedIds(data[`tab${i}_products`] as never),
    }))
    .filter((tab) => tab.title && tab.ids.length);
  const [active, setActive] = useState(0);
  if (!tabs.length) return null;
  const style = pick(data.tabs_style, 'editor');
  const displayAll = href(data.display_all_url);

  return (
    <div className="container">
      <header className="fc-block__head">
        <div>
          {str(data.title) && <h2 className="fc-block__title">{str(data.title)}</h2>}
          {str(data.subtitle) && <p className="fc-block__sub">{str(data.subtitle)}</p>}
        </div>
        {displayAll && (
          <Link to={displayAll} className="fc-link-arrow">
            {t('blocks.home.display_all', 'View all')} <i className="sicon-arrow-left tq-flip" aria-hidden="true" />
          </Link>
        )}
      </header>
      <div className={`fc-htabs fc-htabs--${style} hide-scroll`} role="tablist">
        {tabs.map((tab, i) => (
          <button
            key={tab.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`fc-htabs__btn${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            {tab.icon && <i className={tab.icon} aria-hidden="true" />}
            <span>{tab.title}</span>
            {style === 'editor' && <em className="fc-htabs__x" aria-hidden="true">×</em>}
          </button>
        ))}
      </div>
      <div className="fc-htabs__panels">
        <div className="fc-htabs__panel is-active" role="tabpanel">
          <TabProducts key={active} ids={tabs[Math.min(active, tabs.length - 1)].ids} />
        </div>
      </div>
    </div>
  );
}
