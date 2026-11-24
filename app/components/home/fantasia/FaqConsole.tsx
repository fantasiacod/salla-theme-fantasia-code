import { useMemo, useState } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { href, isOn } from '../../../lib/fantasia';
import { rows, str, type BlockProps } from './shared';

/** Arabic-friendly match: ignore diacritics and the common alef / taa marbuta variants. */
const normalize = (s: string) =>
  s.toLowerCase().replace(/[ً-ْ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').trim();

/** `home.faq-console`: questions with instant search and a category filter. */
export function FaqConsole({ data }: BlockProps) {
  const { t, locale } = useTranslation();
  const ar = locale === 'ar';
  const items = rows(data.items).filter((i) => str(i.question));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const cats = useMemo(() => [...new Set(items.map((i) => str(i.category)).filter(Boolean))], [items]);
  if (!items.length) return null;

  const q = normalize(query);
  const shown = items.filter(
    (i) => (!category || str(i.category) === category) && (!q || normalize(`${str(i.question)} ${str(i.answer)}`).includes(q))
  );
  const searchLabel = t('blocks.fantasia.faq_search', ar ? 'ابحث في الأسئلة...' : 'Search questions...');
  const support = href(data.support_link);

  return (
    <div className="container fc-faq">
      <div className="fc-faq__side">
        {str(data.title) && <h2 className="fc-block__title">{str(data.title)}</h2>}
        {str(data.subtitle) && <p className="fc-block__sub">{str(data.subtitle)}</p>}
        {str(data.support_text) && (
          <Link to={support || '#'} className="fc-btn fc-btn--outline mt-4">
            <i className="sicon-headphones" aria-hidden="true" /> {str(data.support_text)}
          </Link>
        )}
      </div>
      <div className="fc-faq__main">
        {isOn(data.search) && (
          <label className="fc-faq__search">
            <span className="fc-mono fc-text-accent" aria-hidden="true">grep</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchLabel} aria-label={searchLabel} />
            <i className="sicon-search" aria-hidden="true" />
          </label>
        )}
        {isOn(data.categories) && cats.length > 1 && (
          <div className="fc-faq__cats hide-scroll">
            {['', ...cats].map((c) => (
              <button key={c || 'all'} type="button" aria-pressed={category === c} className={category === c ? 'is-active' : ''} onClick={() => setCategory(c)}>
                {c || t('blocks.fantasia.all', ar ? 'الكل' : 'All')}
              </button>
            ))}
          </div>
        )}
        <div className="fc-faq__list">
          {shown.map((item, i) => (
            <details key={str(item.question)} className="fc-faq__item" open={(i === 0 && !q && isOn(data.open_first)) || (!!q || undefined)}>
              <summary>
                <span className="fc-faq__idx fc-mono">{String(items.indexOf(item) + 1).padStart(2, '0')}</span>
                <span className="fc-faq__q">{str(item.question)}</span>
                <i className="sicon-add" aria-hidden="true" />
              </summary>
              <div className="fc-faq__a" style={{ whiteSpace: 'pre-line' }}>{str(item.answer)}</div>
            </details>
          ))}
          {!shown.length && <p className="fc-faq__empty">{t('blocks.fantasia.no_results', ar ? 'لا توجد نتائج مطابقة، جرّب كلمة أخرى.' : 'No matching results, try another keyword.')}</p>}
        </div>
      </div>
    </div>
  );
}
