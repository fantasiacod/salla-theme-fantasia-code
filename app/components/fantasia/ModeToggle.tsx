import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { MODE_STORAGE_KEY } from '../../lib/fantasia';

/**
 * Day / night switch in the header. The class it flips (`fc-dark` on <html>) is also set
 * before first paint by the boot script in `app/routes/__root.tsx`, so a reload keeps the choice.
 * Hidden by CSS on pages without night styles (cart, account).
 */
export function ModeToggle() {
  const { t } = useTranslation();
  const label = t('blocks.fantasia.toggle_mode', 'Day / night mode');

  const toggle = () => {
    const root = document.documentElement;
    const dark = !root.classList.contains('fc-dark');
    root.classList.add('fc-mode-switching');
    root.classList.toggle('fc-dark', dark);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      // private mode: the choice lasts for this page only
    }
    window.setTimeout(() => root.classList.remove('fc-mode-switching'), 350);
  };

  return (
    <button type="button" className="header-action fc-mode-toggle" onClick={toggle} aria-label={label} title={label}>
      <svg className="fc-mode-toggle__moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg className="fc-mode-toggle__sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
