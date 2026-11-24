import { useEffect, useState } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { href, isOn, pick } from '../../../lib/fantasia';
import { prefersReducedMotion, rows, str, useOnScreen, type BlockData, type BlockProps } from './shared';

const PROMPT: Record<string, string> = { command: '$', success: '✓', warning: '!', comment: '#', output: '›' };

/** Wrapper classes for the renderer's <section> (layout, background, dark). */
export const devHeroClass = (data: BlockData) => {
  const layout = pick(data.layout, 'split');
  return `s-block fc-hero fc-hero--${layout} fc-bg-${pick(data.background, 'grid')} ${data.dark === true ? 'fc-hero--dark' : 'fc-hero--light'}`;
};

/** `home.dev-hero`: headline, actions, stats and a terminal that types its commands when seen. */
export function DevHero({ data }: BlockProps) {
  const lines = rows(data.lines).map((l) => ({ text: str(l.text), kind: pick(l.kind, 'command') }));
  const stats = rows(data.stats).filter((s) => str(s.value));
  const showTerminal = isOn(data.show_terminal) && lines.length > 0;
  const layout = pick(data.layout, 'split');
  const typing = isOn(data.typing);
  const [ref, seen] = useOnScreen<HTMLDivElement>(0.3);
  // How many lines are shown, and how much of the line being typed.
  const [step, setStep] = useState({ line: typing ? 0 : lines.length, chars: 0 });

  useEffect(() => {
    if (!typing || !seen) return;
    if (prefersReducedMotion()) return setStep({ line: lines.length, chars: 0 });
    if (step.line >= lines.length) return;
    const current = lines[step.line];
    const typed = current.kind === 'command' && step.chars < current.text.length;
    const id = window.setTimeout(
      () => setStep(typed ? { line: step.line, chars: step.chars + 1 } : { line: step.line + 1, chars: 0 }),
      typed ? 30 + Math.random() * 40 : current.kind === 'command' ? 380 : 260
    );
    return () => window.clearTimeout(id);
  }, [typing, seen, step, lines]);

  const primary = href(data.primary_link);
  const secondary = href(data.secondary_link);
  const done = step.line >= lines.length;

  return (
    <>
      <div className="fc-hero__glow" aria-hidden="true" />
      <div className={`container fc-hero__inner${showTerminal && layout === 'split' ? ' has-terminal' : ''}`}>
        <div className="fc-hero__copy">
          {str(data.badge) && (
            <span className="fc-hero__badge">
              <span className="fc-pulse-dot" aria-hidden="true" />
              {str(data.badge)}
            </span>
          )}
          <h2 className="fc-hero__title">
            {str(data.title)} {str(data.highlight) && <span className="fc-gradient-text">{str(data.highlight)}</span>}
          </h2>
          {str(data.description) && <p className="fc-hero__desc">{str(data.description)}</p>}
          <div className="fc-hero__actions">
            {str(data.primary_text) && (
              <Link to={primary || '#'} className="fc-btn fc-btn--primary">
                {str(data.primary_text)} <i className="sicon-arrow-left tq-flip" aria-hidden="true" />
              </Link>
            )}
            {str(data.secondary_text) && (
              <Link to={secondary || '#'} className="fc-btn fc-btn--ghost">
                <i className="sicon-play-circle" aria-hidden="true" /> {str(data.secondary_text)}
              </Link>
            )}
          </div>
          {stats.length > 0 && (
            <dl className="fc-hero__stats">
              {stats.map((s, i) => (
                <div key={i}>
                  <dt className="fc-mono">{str(s.value)}</dt>
                  <dd>{str(s.label)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {showTerminal && (
          <div ref={ref} className={`fc-terminal fc-terminal--${pick(data.terminal_theme, 'midnight')}${done ? ' is-done' : ''}`} dir="ltr">
            <div className="fc-terminal__bar">
              <span className="fc-window__dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="fc-terminal__title">{str(data.terminal_title) || '~/store — zsh'}</span>
            </div>
            {/* The full text stays in the DOM for screen readers; the typing is visual only. */}
            <div className="fc-terminal__body" role="img" aria-label={lines.map((l) => l.text).join('. ')}>
              {lines.map((l, i) => {
                const visible = i < step.line || (i === step.line && l.kind === 'command' && step.chars > 0);
                if (!visible) return null;
                const shown = i === step.line ? l.text.slice(0, step.chars) : l.text;
                return (
                  <div key={i} className={`fc-terminal__line is-${l.kind}${i === step.line ? ' is-typing' : ''}`} aria-hidden="true">
                    <span className="fc-terminal__prompt">{PROMPT[l.kind] ?? '$'}</span>
                    <span className="fc-terminal__text">{shown}</span>
                  </div>
                );
              })}
              <div className="fc-terminal__line is-command" aria-hidden="true">
                <span className="fc-terminal__prompt">$</span>
                <span className="fc-caret" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
