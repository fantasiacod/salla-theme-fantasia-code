import { isOn, pick } from '../../../lib/fantasia';
import { rows, str, type BlockData, type BlockProps } from './shared';

export const techMarqueeClass = (data: BlockData) =>
  `s-block fc-marquee fc-marquee--${pick(data.style, 'pills')} fc-speed-${pick(data.speed, 'normal')}${data.reverse === true ? ' is-reverse' : ''}${isOn(data.pause_on_hover) ? ' is-pausable' : ''}`;

/** `home.tech-marquee`: an endless strip of supported platforms / tech logos. */
export function TechMarquee({ data }: BlockProps) {
  const items = rows(data.items).filter((i) => str(i.name) || str(i.logo));
  if (!items.length) return null;
  const logos = pick(data.style, 'pills') === 'logos';
  const track = (hidden: boolean) => (
    <ul className="fc-marquee__track" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li className="fc-marquee__item" key={i}>
          {logos && str(item.logo) ? (
            <img src={str(item.logo)} alt={hidden ? '' : str(item.name)} loading="lazy" />
          ) : (
            <>
              {str(item.icon) && <i className={str(item.icon)} aria-hidden="true" />}
              <span>{str(item.name)}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <>
      {str(data.title) && (
        <p className="fc-marquee__title fc-mono">
          <span className="fc-text-accent">//</span> {str(data.title)}
        </p>
      )}
      <div className="fc-marquee__viewport" dir="ltr">
        {track(false)}
        {track(true)}
      </div>
    </>
  );
}
