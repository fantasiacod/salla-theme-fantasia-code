import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';

/** Air Force blue, and shades of it for hover states and for text on white (5.4:1). */
const PRIMARY = '#588BAE';
const PRIMARY_DARK = '#3E6F91';
const PRIMARY_LIGHT = '#7BA5C2';

/**
 * Applies the theme's own colour over the store's, on by default. The engine writes the
 * store's colour as CSS variables on `<html>`, so these need `!important`. A merchant who
 * prefers their store colour turns off the `tq_brand_color_enabled` setting.
 */
export function TaqniBrandColor() {
  const { theme } = useTwilight();
  const settings = (theme?.settings ?? {}) as Record<string, unknown>;
  if (settings.tq_brand_color_enabled === false) return null;

  return (
    <style>{`:root {
  --color-primary: ${PRIMARY} !important;
  --color-primary-dark: ${PRIMARY_DARK} !important;
  --color-primary-light: ${PRIMARY_LIGHT} !important;
  --color-primary-reverse: #ffffff !important;
}`}</style>
  );
}
