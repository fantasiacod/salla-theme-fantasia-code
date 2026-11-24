import { useState } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { href, isOn, lines } from '../../../lib/fantasia';
import { rows, str, type BlockProps } from './shared';

/** `home.pricing-plans`: license plans with a monthly / yearly switch and one highlighted plan. */
export function PricingPlans({ data }: BlockProps) {
  const { t, locale } = useTranslation();
  const ar = locale === 'ar';
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const plans = rows(data.plans);
  if (!plans.length) return null;
  const toggle = isOn(data.billing_toggle);
  const monthly = str(data.monthly_label) || t('blocks.fantasia.monthly', ar ? 'شهري' : 'Monthly');
  const yearly = str(data.yearly_label) || t('blocks.fantasia.yearly', ar ? 'سنوي' : 'Yearly');

  return (
    <div className="container fc-pricing">
      <header className="fc-block__head fc-block__head--center">
        <div>
          {str(data.title) && <h2 className="fc-block__title">{str(data.title)}</h2>}
          {str(data.subtitle) && <p className="fc-block__sub">{str(data.subtitle)}</p>}
        </div>
        {toggle && (
          <div className="fc-billing" role="group">
            <button type="button" aria-pressed={period === 'monthly'} className={period === 'monthly' ? 'is-active' : ''} onClick={() => setPeriod('monthly')}>
              {monthly}
            </button>
            <button type="button" aria-pressed={period === 'yearly'} className={period === 'yearly' ? 'is-active' : ''} onClick={() => setPeriod('yearly')}>
              {yearly} {str(data.yearly_badge) && <em>{str(data.yearly_badge)}</em>}
            </button>
          </div>
        )}
      </header>
      <div className={`fc-pricing__grid fc-pricing__grid--${plans.length}`}>
        {plans.map((plan, i) => {
          const featured = plan.featured === true;
          const price = period === 'yearly' && str(plan.yearly_price) ? str(plan.yearly_price) : str(plan.monthly_price);
          const link = href(plan.button_link);
          return (
            <article key={i} className={`fc-plan${featured ? ' is-featured' : ''}`}>
              {featured && <span className="fc-plan__flag">{str(plan.featured_label) || t('blocks.fantasia.popular', ar ? 'الأكثر طلباً' : 'Most popular')}</span>}
              <h3 className="fc-plan__name">{str(plan.name)}</h3>
              {str(plan.description) && <p className="fc-plan__desc">{str(plan.description)}</p>}
              <div className="fc-plan__price">
                <span key={period} className="fc-plan__amount fc-mono is-flip">{price}</span>
                {str(data.currency) && <span className="fc-plan__currency">{str(data.currency)}</span>}
                {toggle && str(plan.yearly_price) && <span className="fc-plan__per">/ {period === 'yearly' ? yearly : monthly}</span>}
              </div>
              {str(plan.period_note) && <p className="fc-plan__note">{str(plan.period_note)}</p>}
              <ul className="fc-plan__features">
                {lines(plan.features).map((f) =>
                  f.startsWith('-') ? (
                    <li key={f} className="is-off"><i className="sicon-cancel" aria-hidden="true" /><span>{f.slice(1).trim()}</span></li>
                  ) : (
                    <li key={f}><i className="sicon-check" aria-hidden="true" /><span>{f}</span></li>
                  )
                )}
              </ul>
              {str(plan.button_text) && (
                <Link to={link || '#'} className={`fc-btn ${featured ? 'fc-btn--primary' : 'fc-btn--outline'} w-full`}>
                  {str(plan.button_text)}
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
