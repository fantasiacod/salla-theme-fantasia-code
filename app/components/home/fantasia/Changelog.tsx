import { useState } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { href, lines, pick } from '../../../lib/fantasia';
import { rows, str, type BlockProps } from './shared';

const TYPES: Record<string, [string, string]> = {
  new: ['ميزة جديدة', 'New'],
  improve: ['تحسين', 'Improvement'],
  fix: ['إصلاح', 'Fix'],
  security: ['أمني', 'Security'],
};

/** `home.changelog`: the latest releases as a timeline, older ones behind "show older". */
export function Changelog({ data }: BlockProps) {
  const { t, locale } = useTranslation();
  const ar = locale === 'ar';
  const [all, setAll] = useState(false);
  const releases = rows(data.releases);
  if (!releases.length) return null;
  const visible = Math.max(1, Number(data.visible) || 3);
  const shown = all ? releases : releases.slice(0, visible);
  const allLink = href(data.all_link);

  return (
    <div className="container fc-changelog">
      <header className="fc-block__head">
        <div>
          {str(data.title) && (
            <h2 className="fc-block__title"><span className="fc-mono fc-text-accent">git log</span> {str(data.title)}</h2>
          )}
          {str(data.subtitle) && <p className="fc-block__sub">{str(data.subtitle)}</p>}
        </div>
        {allLink && (
          <Link to={allLink} className="fc-link-arrow">
            {t('blocks.fantasia.full_changelog', ar ? 'سجل التحديثات الكامل' : 'Full changelog')} <i className="sicon-arrow-left tq-flip" aria-hidden="true" />
          </Link>
        )}
      </header>
      <ol className="fc-timeline">
        {shown.map((r, i) => {
          const type = TYPES[pick(r.type, 'new')] ? pick(r.type, 'new') : 'new';
          return (
            <li key={i} className={`fc-timeline__item is-${type}`}>
              <span className="fc-timeline__node" aria-hidden="true" />
              <div className="fc-timeline__card">
                <div className="fc-timeline__meta">
                  <span className="fc-timeline__version fc-mono">{str(r.version)}</span>
                  <span className="fc-timeline__type">{t(`blocks.fantasia.release_${type}`, TYPES[type][ar ? 0 : 1])}</span>
                  {str(r.date) && <time className="fc-timeline__date">{str(r.date)}</time>}
                </div>
                {str(r.title) && <h3>{str(r.title)}</h3>}
                {lines(r.notes).length > 0 && (
                  <ul>{lines(r.notes).map((n) => <li key={n}>{n}</li>)}</ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {!all && releases.length > visible && (
        <button type="button" className="fc-btn fc-btn--ghost fc-changelog__more" onClick={() => setAll(true)}>
          <i className="sicon-keyboard_arrow_down" aria-hidden="true" /> {t('blocks.fantasia.show_older', ar ? 'عرض الإصدارات الأقدم' : 'Show older releases')}
        </button>
      )}
    </div>
  );
}
