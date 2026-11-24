import { Link } from '@salla.sa/twilight-theme-engine/common';
import { href, pick } from '../../../lib/fantasia';
import { str, useCopy, type BlockProps } from './shared';

/** `home.cta-terminal`: a call to action with a one-click copyable install command. */
export function CtaTerminal({ data }: BlockProps) {
  const { label, copied, copy } = useCopy();
  const link = href(data.button_link);
  const command = str(data.command);
  return (
    <div className="container">
      <div className={`fc-cta fc-cta--${pick(data.background, 'gradient')}`}>
        <div className="fc-cta__copy">
          {str(data.title) && <h2>{str(data.title)}</h2>}
          {str(data.description) && <p>{str(data.description)}</p>}
        </div>
        <div className="fc-cta__actions">
          {command && (
            <button type="button" className={`fc-cta__cmd${copied ? ' is-copied' : ''}`} dir="ltr" onClick={() => copy(command)} aria-label={`${label}: ${command}`}>
              <span className="fc-text-accent">$</span>
              <code>{command}</code>
              <i className="sicon-swap-fill" aria-hidden="true" />
              <em>{label}</em>
            </button>
          )}
          {str(data.button_text) && (
            <Link to={link || '#'} className="fc-btn fc-btn--light">{str(data.button_text)}</Link>
          )}
        </div>
      </div>
    </div>
  );
}
