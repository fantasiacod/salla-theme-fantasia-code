import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import type { SmartTags } from '../../../lib/fantasia';
import { PlatformChip } from './PlatformChip';

const DELIVERY: Record<string, [string, string, string, string]> = {
  codes: ['sicon-key', 'blocks.fantasia.license_key_delivery', 'مفتاح ترخيص فوري', 'Instant license key'],
  digital: ['sicon-lightning', 'blocks.fantasia.instant_download', 'تحميل فوري', 'Instant download'],
  service: ['sicon-headphones', 'blocks.fantasia.dev_service', 'خدمة برمجية', 'Dev service'],
};

/** The chips above the product title: category path, delivery type, version, and platforms. */
export function SoftwareMeta({ product, tags }: { product: Product; tags: SmartTags }) {
  const { t, locale } = useTranslation();
  const delivery = DELIVERY[String(product.type ?? '')];
  const category = product.category as { name?: string; url?: string | null } | undefined;
  const version = tags.version ? (tags.version.startsWith('v') ? tags.version : `v${tags.version}`) : '';
  if (!category?.name && !delivery && !version && !tags.platforms.length) return null;

  return (
    <div className="fc-product__head" data-testid="fc-software-meta">
      <div className="fc-product__chips">
        {category?.name &&
          (category.url ? (
            <Link to={category.url} className="fc-chip fc-chip--path">
              <span className="fc-mono">~/</span>
              {category.name}
            </Link>
          ) : (
            <span className="fc-chip fc-chip--path">
              <span className="fc-mono">~/</span>
              {category.name}
            </span>
          ))}
        {delivery && (
          <span className="fc-chip fc-chip--accent">
            <i className={delivery[0]} aria-hidden="true" />
            {t(delivery[1], locale === 'ar' ? delivery[2] : delivery[3])}
          </span>
        )}
        {version && <span className="fc-chip fc-chip--version fc-mono">{version}</span>}
      </div>
      {tags.platforms.length > 0 && (
        <div className="fc-platforms" aria-label={t('blocks.fantasia.platforms', 'Supported platforms')}>
          {tags.platforms.map((p) => (
            <PlatformChip key={p} name={p} />
          ))}
        </div>
      )}
    </div>
  );
}
