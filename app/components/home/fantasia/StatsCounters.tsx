import { useEffect, useState } from 'react';
import { isOn, pick } from '../../../lib/fantasia';
import { prefersReducedMotion, rows, str, useOnScreen, type BlockProps } from './shared';

function Counter({ value, animate }: { value: number; animate: boolean }) {
  const [ref, seen] = useOnScreen<HTMLSpanElement>(0.4);
  // Starts at the real number (correct without JS / for crawlers), counts up once seen.
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!animate || !seen || prefersReducedMotion()) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1600);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, seen, value]);
  return <span ref={ref}>{shown.toLocaleString('en-US')}</span>;
}

/** `home.stats-counters`: numbers that count up when they come into view. */
export function StatsCounters({ data }: BlockProps) {
  const items = rows(data.items);
  if (!items.length) return null;
  return (
    <div className={`container fc-stats fc-stats--${pick(data.style, 'strip')}`}>
      {str(data.title) && <h2 className="fc-block__title text-center mb-8">{str(data.title)}</h2>}
      <div className="fc-stats__grid">
        {items.map((item, i) => (
          <div className="fc-stats__item" key={i}>
            {str(item.icon) && <i className={`${str(item.icon)} fc-stats__icon`} aria-hidden="true" />}
            <div className="fc-stats__value fc-mono" dir="ltr">
              {str(item.prefix)}
              <Counter value={Number(item.value) || 0} animate={isOn(data.animate)} />
              {str(item.suffix)}
            </div>
            <div className="fc-stats__label">{str(item.label)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
