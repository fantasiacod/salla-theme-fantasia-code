import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';

/**
 * The merchant's theme settings, or `{}` outside a TwilightProvider (isolated renders such as
 * component tests). `useTwilight` reads a context and then throws when it is missing, so the
 * hook order is the same either way.
 */
export function useThemeSettings(): Record<string, unknown> {
  try {
    const { theme } = useTwilight();
    return (theme?.settings ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}
