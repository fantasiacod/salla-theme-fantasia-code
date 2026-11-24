import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';

const FEATURE_ICONS = ['sicon-cloud-upload', 'sicon-lock', 'sicon-flash', 'sicon-whatsapp'];

/** A multilanguage setting: plain text, or one value per language. */
export function localizedText(value: unknown, locale: string): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const perLanguage = value as Record<string, unknown>;
    const text = perLanguage[locale] ?? perLanguage.ar ?? perLanguage.en;
    return typeof text === 'string' ? text : '';
  }
  return '';
}

/**
 * The dark bar above the header: a welcome line, then four store promises on `lg+`.
 * Texts come from the `tq_topbar_*` settings; an emptied setting hides its piece.
 * Registered in the `header:start` slot (`app/hooks/index.tsx`).
 */
export function TaqniTopbar() {
  const { theme } = useTwilight();
  const { locale } = useTranslation();
  const settings = (theme?.settings ?? {}) as Record<string, unknown>;
  const text = (id: string) => localizedText(settings[id], locale);

  const welcome = text('tq_topbar_text');
  const features = FEATURE_ICONS.map((icon, index) => ({
    icon,
    label: text(`tq_topbar_f${index + 1}`),
  })).filter((feature) => feature.label);

  if (!welcome && !features.length) return null;

  return (
    <div className="tq-topbar" data-testid="taqni-topbar">
      <div className="container tq-topbar__row">
        {welcome && (
          <div className="tq-topbar__welcome">
            <i className="sicon-check-circle2" aria-hidden="true" />
            <span>{welcome}</span>
          </div>
        )}
        {features.length > 0 && (
          <ul className="tq-topbar__features">
            {features.map((feature) => (
              <li key={feature.icon}>
                <i className={feature.icon} aria-hidden="true" /> {feature.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
