import { useMemo, useState } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { href, isOn, lines, pick } from '../../../lib/fantasia';
import { highlightCode, rows, str, useCopy, type BlockProps } from './shared';

/** `home.code-snippet`: multi-language code tabs with highlighting and a copy button. */
export function CodeSnippet({ data }: BlockProps) {
  const snippets = rows(data.snippets).filter((s) => str(s.code));
  const [active, setActive] = useState(0);
  const { label, copied, copy } = useCopy();
  const numbers = isOn(data.line_numbers);
  const current = snippets[Math.min(active, Math.max(snippets.length - 1, 0))];
  const html = useMemo(() => (current ? highlightCode(str(current.code), numbers) : ''), [current, numbers]);
  const link = href(data.button_link);

  return (
    <div className={`container fc-codeblock fc-codeblock--${pick(data.position, 'side')}`}>
      <div className="fc-codeblock__copy">
        {str(data.badge) && <span className="fc-eyebrow"><i className="sicon-code" aria-hidden="true" /> {str(data.badge)}</span>}
        {str(data.title) && <h2 className="fc-block__title">{str(data.title)}</h2>}
        {str(data.description) && <p className="fc-block__sub">{str(data.description)}</p>}
        {lines(data.points).length > 0 && (
          <ul className="fc-checklist">
            {lines(data.points).map((p) => (
              <li key={p}><i className="sicon-check" aria-hidden="true" />{p}</li>
            ))}
          </ul>
        )}
        {str(data.button_text) && (
          <Link to={link || '#'} className="fc-btn fc-btn--outline">
            <i className="sicon-book-open" aria-hidden="true" /> {str(data.button_text)}
          </Link>
        )}
      </div>
      {current && (
        <div className={`fc-editor fc-terminal--${pick(data.theme, 'midnight')}${numbers ? ' has-lines' : ''}`} dir="ltr">
          <div className="fc-editor__bar">
            <span className="fc-window__dots" aria-hidden="true"><i /><i /><i /></span>
            <div className="fc-editor__tabs hide-scroll" role="tablist">
              {snippets.map((s, i) => (
                <button key={i} type="button" role="tab" aria-selected={i === active} className={i === active ? 'is-active' : ''} onClick={() => setActive(i)}>
                  {str(s.filename) || str(s.label)}
                </button>
              ))}
            </div>
            <button type="button" className={`fc-editor__copy${copied ? ' is-copied' : ''}`} onClick={() => copy(str(current.code))}>
              <i className="sicon-swap-fill" aria-hidden="true" /><span>{label}</span>
            </button>
          </div>
          {/* highlightCode escapes every character before adding its own spans. */}
          <pre className="fc-editor__code is-active"><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
          <div className="fc-editor__status fc-mono">
            <span>{str(current.label)}</span><span>UTF-8</span><span className="fc-text-accent">● ready</span>
          </div>
        </div>
      )}
    </div>
  );
}
