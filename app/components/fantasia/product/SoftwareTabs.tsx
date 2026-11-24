import { useMemo, useState, type MouseEvent } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { pick, SECTION_ICONS, splitDescription, type SmartTags } from '../../../lib/fantasia';
import { youtubeFacades } from '../../../lib/descriptionVideos';
import { lazyIframes } from '../../product/ProductDetails';

/** The technical specs panel, filled from smart tags (`version:`, `platform:` …) and the SKU. */
export function SoftwareSpecs({ tags, sku }: { tags: SmartTags; sku?: string | null }) {
  const { t, locale } = useTranslation();
  const ar = locale === 'ar';
  const rows: [string, string, boolean?][] = [
    [t('blocks.fantasia.version', ar ? 'الإصدار' : 'Version'), tags.version ?? '', true],
    [t('blocks.fantasia.license', ar ? 'نوع الترخيص' : 'License type'), tags.license ?? ''],
    [t('blocks.fantasia.platforms', ar ? 'المنصات المدعومة' : 'Supported platforms'), tags.platforms.join(' · ')],
    [t('blocks.fantasia.stack', ar ? 'التقنيات' : 'Tech stack'), tags.stack.join(' · '), true],
    [t('blocks.fantasia.requires', ar ? 'المتطلبات' : 'Requirements'), tags.requires ?? ''],
    [t('blocks.fantasia.last_update', ar ? 'آخر تحديث' : 'Last update'), tags.updated ?? ''],
    [t('blocks.fantasia.file_size', ar ? 'حجم الملف' : 'File size'), tags.size ?? '', true],
    [t('pages.products.sku', ar ? 'رمز المنتج' : 'SKU'), sku ?? '', true],
  ];
  const shown = rows.filter(([, value]) => value);
  // SKU alone is not worth a panel.
  if (shown.length < 2) return null;

  return (
    <section className="fc-specs" aria-labelledby="fc-specs-title" data-testid="fc-product-specs">
      <h2 id="fc-specs-title" className="fc-section-label">
        <i className="sicon-computer" aria-hidden="true" /> {t('blocks.fantasia.tech_specs', ar ? 'المواصفات التقنية' : 'Technical specs')}
      </h2>
      <dl className="fc-specs__grid">
        {shown.map(([label, value, mono]) => (
          <div className="fc-specs__row" key={label}>
            <dt>{label}</dt>
            <dd className={mono ? 'fc-mono' : undefined}>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/**
 * Smart tabs: every top-level H2/H3 of the description becomes a tab (features, requirements,
 * changelog…), each styled for its kind. The text before the first heading is the overview.
 */
export function SoftwareTabs({ product, tags, showTags }: { product: Product; tags: SmartTags; showTags: boolean }) {
  const { t, locale } = useTranslation();
  const { theme } = useTwilight();
  const ar = locale === 'ar';
  const levels = pick((theme?.settings as Record<string, unknown> | undefined)?.product_tabs_heading, 'h2,h3')
    .split(',')
    .filter((l): l is 'h2' | 'h3' => l === 'h2' || l === 'h3');
  const [playing, setPlaying] = useState<Record<number, ReadonlySet<number>>>({});
  const [active, setActive] = useState(0);

  const sections = useMemo(
    () => splitDescription((product.description ?? '').replace(/&nbsp;/g, ' '), levels.length ? levels : ['h2', 'h3']),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product.description, levels.join()]
  );
  if (!sections.length && !tags.plain.length) return null;

  const overview = t('blocks.fantasia.overview', ar ? 'نظرة عامة' : 'Overview');
  // Each tab numbers its own videos, so each keeps its own "playing" set.
  const playVideo = (section: number) => (event: MouseEvent<HTMLElement>) => {
    const facade = (event.target as Element).closest?.('[data-video-index]');
    if (!facade) return;
    const index = Number(facade.getAttribute('data-video-index'));
    setPlaying((current) => ({ ...current, [section]: new Set(current[section]).add(index) }));
  };
  const none: ReadonlySet<number> = new Set();
  const current = Math.min(active, Math.max(sections.length - 1, 0));

  return (
    <section className={`fc-ptabs is-ready${sections.length < 2 ? ' is-single' : ''}`} data-testid="fc-smart-tabs">
      <div className="fc-ptabs__nav hide-scroll" role="tablist">
        {sections.map((section, i) => (
          <button
            key={`${section.title}-${i}`}
            type="button"
            role="tab"
            id={`fc-tab-${i}`}
            aria-controls={`fc-panel-${i}`}
            aria-selected={i === current}
            className={`fc-ptabs__btn${i === current ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            <i className={section.title ? SECTION_ICONS[section.kind] : 'sicon-information'} aria-hidden="true" />
            <span>{section.title ?? overview}</span>
          </button>
        ))}
      </div>
      <div className="fc-ptabs__panels">
        {sections.map((section, i) => (
          <div
            key={`${section.title}-${i}`}
            role="tabpanel"
            id={`fc-panel-${i}`}
            aria-labelledby={`fc-tab-${i}`}
            hidden={i !== current}
            className={`fc-ptabs__panel${i === current ? ' is-active' : ''}`}
          >
            <article
              className={`product__description article article--main fc-prose fc-prose--${section.kind}`}
              onClick={playVideo(i)}
              dangerouslySetInnerHTML={{
                __html: youtubeFacades(lazyIframes(section.html), playing[i] ?? none, t('pages.products.play_video', 'Play video')),
              }}
            />
          </div>
        ))}
        {showTags && tags.plain.length > 0 && (
          <div className="fc-tags">
            {tags.plain.map((tag) =>
              tag.url ? (
                <Link key={tag.name} to={tag.url} className="fc-tag">
                  #{tag.name}
                </Link>
              ) : (
                <span key={tag.name} className="fc-tag">
                  #{tag.name}
                </span>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
