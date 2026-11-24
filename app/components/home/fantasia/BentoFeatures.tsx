import type { CSSProperties } from 'react';
import { pick } from '../../../lib/fantasia';
import { rows, str, type BlockProps } from './shared';

/** `home.bento-features`: an asymmetric grid of feature cards, optional code per card. */
export function BentoFeatures({ data }: BlockProps) {
  const items = rows(data.items);
  if (!items.length) return null;
  return (
    <div className="container fc-bento">
      <header className="fc-block__head fc-block__head--center">
        <div>
          {str(data.title) && <h2 className="fc-block__title">{str(data.title)}</h2>}
          {str(data.subtitle) && <p className="fc-block__sub">{str(data.subtitle)}</p>}
        </div>
      </header>
      <div className="fc-bento__grid">
        {items.map((item, i) => (
          <article
            key={i}
            className={`fc-bento__card is-${pick(item.size, 'normal')}`}
            style={str(item.accent) ? ({ '--card-accent': str(item.accent) } as CSSProperties) : undefined}
          >
            <span className="fc-bento__icon"><i className={str(item.icon) || 'sicon-star2'} aria-hidden="true" /></span>
            <h3>{str(item.title)}</h3>
            {str(item.text) && <p>{str(item.text)}</p>}
            {str(item.code) && (
              <pre className="fc-bento__code" dir="ltr"><code>{str(item.code)}</code></pre>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
