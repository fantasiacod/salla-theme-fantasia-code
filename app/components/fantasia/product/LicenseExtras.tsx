import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { text } from '../../../lib/fantasia';

/** Under the add-to-cart form: live demo / documentation buttons and the "what you get" list. */
export function LicenseExtras({ demo, docs }: { demo?: string; docs?: string }) {
  const { t, locale } = useTranslation();
  const { theme } = useTwilight();
  const s = (theme?.settings ?? {}) as Record<string, unknown>;
  const ar = locale === 'ar';
  const defaults = ar
    ? ['تسليم فوري بعد الدفع', 'تحديثات مجانية', 'دعم فني من مطوّرين']
    : ['Instant delivery after payment', 'Free updates', 'Support from developers'];
  const guarantees =
    s.guarantees_enabled === false
      ? []
      : [1, 2, 3, 4]
          .map((i) => (s[`guarantee_${i}`] === undefined ? (defaults[i - 1] ?? '') : text(s[`guarantee_${i}`], locale)))
          .filter(Boolean);

  if (!demo && !docs && !guarantees.length) return null;
  return (
    <div className="fc-license-extras" data-testid="fc-license-extras">
      {(demo || docs) && (
        <div className="fc-buybox__links">
          {demo && (
            <a href={demo} target="_blank" rel="noopener noreferrer" className="fc-ghost-btn">
              <i className="sicon-play-circle" aria-hidden="true" /> {t('blocks.fantasia.live_demo', ar ? 'تجربة مباشرة' : 'Live demo')}
            </a>
          )}
          {docs && (
            <a href={docs} target="_blank" rel="noopener noreferrer" className="fc-ghost-btn">
              <i className="sicon-book-open" aria-hidden="true" /> {t('blocks.fantasia.documentation', ar ? 'التوثيق' : 'Documentation')}
            </a>
          )}
        </div>
      )}
      {guarantees.length > 0 && (
        <ul className="fc-guarantees">
          {guarantees.map((g) => (
            <li key={g}>
              <i className="sicon-check" aria-hidden="true" />
              <span>{g}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
