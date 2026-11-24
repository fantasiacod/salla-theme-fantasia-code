/**
 * Fantasia Code helpers shared by the software-store components.
 * Kept free of React so they can be unit-tested and used on the server.
 */

/** A dropdown value arrives as `'x'`, `['x']` or `[{ value: 'x' }]` — always answer the string. */
export function pick(raw: unknown, fallback = ''): string {
  const first = Array.isArray(raw) ? raw[0] : raw;
  if (typeof first === 'string') return first || fallback;
  if (typeof first === 'number') return String(first);
  const value = (first as { value?: unknown } | undefined)?.value;
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
}

/** A multilanguage text: plain text, or one value per language. */
export function text(raw: unknown, locale = 'ar'): string {
  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const per = raw as Record<string, unknown>;
    const value = per[locale] ?? per.ar ?? per.en;
    return typeof value === 'string' ? value : '';
  }
  return '';
}

/** A link field: a string, or `{ url }` / `[{ url }]` from a variable-list. Empty and '#' mean none. */
export function href(raw: unknown): string {
  const first = Array.isArray(raw) ? raw[0] : raw;
  const value =
    typeof first === 'string' ? first : ((first as { url?: unknown } | undefined)?.url ?? '');
  return typeof value === 'string' && value !== '#' ? value : '';
}

/** A switch that is ON unless the merchant turned it off. */
export const isOn = (raw: unknown) => raw !== false && raw !== 'false' && raw !== 0;

/** Lines of a textarea, trimmed, empty ones dropped. */
export const lines = (raw: unknown) =>
  (typeof raw === 'string' ? raw : '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

export type ColorMode = 'light' | 'dark' | 'auto';

export const MODE_STORAGE_KEY = 'fc::mode';

/**
 * Runs in <head> before the body paints: puts `fc-dark` on <html> when the visitor chose night,
 * or when the merchant's default says so. Night styles only apply on pages that mark
 * `body.fc-dark-capable`, so cart and account pages stay light either way.
 */
export function modeBootScript(defaultMode: ColorMode): string {
  const safe = defaultMode === 'dark' || defaultMode === 'auto' ? defaultMode : 'light';
  return `(function(){try{var s=localStorage.getItem('${MODE_STORAGE_KEY}');var d='${safe}';var m=s||(d==='auto'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):d);if(m==='dark')document.documentElement.classList.add('fc-dark');}catch(e){}})();`;
}

export type SmartTags = {
  version?: string;
  license?: string;
  updated?: string;
  size?: string;
  requires?: string;
  demo?: string;
  docs?: string;
  platforms: string[];
  stack: string[];
  plain: { name: string; url?: string | null }[];
};

const KEYS: Record<string, keyof SmartTags> = {
  version: 'version', v: 'version', 'إصدار': 'version', 'الإصدار': 'version',
  platform: 'platforms', os: 'platforms', 'منصة': 'platforms', 'المنصة': 'platforms', 'نظام': 'platforms',
  license: 'license', licence: 'license', 'ترخيص': 'license', 'الترخيص': 'license',
  updated: 'updated', update: 'updated', 'تحديث': 'updated', 'آخر تحديث': 'updated',
  size: 'size', 'حجم': 'size', 'الحجم': 'size',
  lang: 'stack', stack: 'stack', tech: 'stack', 'لغة': 'stack', 'تقنية': 'stack',
  requires: 'requires', require: 'requires', 'يتطلب': 'requires', 'المتطلبات': 'requires',
  demo: 'demo', preview: 'demo', 'تجربة': 'demo', 'معاينة': 'demo',
  docs: 'docs', documentation: 'docs', 'توثيق': 'docs', 'التوثيق': 'docs',
};

const asUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : `https://${value}`);

/**
 * Smart tags: product tags written `key:value` become specs and buttons
 * (`version:3.2.1`, `platform:Windows`, `demo:https://…`). Others stay plain tags.
 */
export function parseSmartTags(tags: { name?: string | null; url?: string | null }[] = []): SmartTags {
  const out: SmartTags = { platforms: [], stack: [], plain: [] };
  for (const tag of tags) {
    const name = (tag?.name ?? '').trim();
    const at = name.indexOf(':');
    const key = at > 0 ? KEYS[name.slice(0, at).trim().toLowerCase()] : undefined;
    const value = at > 0 ? name.slice(at + 1).trim() : '';
    if (!key || !value) {
      if (name) out.plain.push({ name, url: tag.url });
      continue;
    }
    if (key === 'platforms' || key === 'stack') out[key].push(value);
    else if (key === 'demo' || key === 'docs') out[key] = asUrl(value);
    else if (key !== 'plain') (out as Record<string, unknown>)[key] = value;
  }
  return out;
}

export type DescriptionSection = { title: string | null; html: string; kind: SectionKind };
export type SectionKind = 'features' | 'requirements' | 'changelog' | 'install' | 'license' | 'faq' | 'video' | 'docs' | 'support' | 'generic';

const KIND_PATTERNS: [SectionKind, RegExp][] = [
  ['features', /(feature|مميز|المزايا|خصائص)/i],
  ['requirements', /(require|متطلب|system|النظام|التشغيل)/i],
  ['changelog', /(changelog|update|release|version|تحديث|إصدار|اصدار|سجل)/i],
  ['install', /(install|setup|تثبيت|تنصيب|إعداد|اعداد)/i],
  ['license', /(licen|ترخيص|رخصة)/i],
  ['faq', /(faq|question|أسئلة|اسئلة|سؤال)/i],
  ['video', /(video|فيديو|شرح)/i],
  ['docs', /(doc|توثيق|دليل)/i],
  ['support', /(support|دعم)/i],
];

export const sectionKind = (title: string): SectionKind =>
  KIND_PATTERNS.find(([, re]) => re.test(title))?.[0] ?? 'generic';

export const SECTION_ICONS: Record<SectionKind, string> = {
  features: 'sicon-star2', requirements: 'sicon-computer', changelog: 'sicon-sync', install: 'sicon-download',
  license: 'sicon-key', faq: 'sicon-help', video: 'sicon-play-circle', docs: 'sicon-book-open',
  support: 'sicon-headphones', generic: 'sicon-information',
};

const stripTags = (html: string) =>
  html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/**
 * Smart tabs: split the description HTML at its top-level <h2>/<h3> headings.
 * Works on the server (no DOM). The text before the first heading is the overview (title null).
 */
export function splitDescription(html: string, levels: ('h2' | 'h3')[] = ['h2', 'h3']): DescriptionSection[] {
  const source = html ?? '';
  const re = new RegExp(`<(${levels.join('|')})\\b[^>]*>([\\s\\S]*?)<\\/\\1>`, 'gi');
  const sections: DescriptionSection[] = [];
  let last = 0;
  let current: DescriptionSection = { title: null, html: '', kind: 'generic' };
  let match: RegExpExecArray | null;
  while ((match = re.exec(source))) {
    current.html = source.slice(last, match.index);
    sections.push(current);
    const title = stripTags(match[2]);
    current = { title, html: '', kind: sectionKind(title) };
    last = re.lastIndex;
  }
  current.html = source.slice(last);
  sections.push(current);
  const hasText = (s: DescriptionSection) => stripTags(s.html).length > 0 || /<(img|iframe|video|table)/i.test(s.html);
  return sections.filter((s, i) => s.title !== null || i > 0 || hasText(s)).filter((s) => s.title || hasText(s));
}

/** A "live demo" link the merchant wrote inside the description, when no `demo:` tag was set. */
export function findDemoLink(html: string): string | undefined {
  const re = /<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html ?? ''))) {
    if (/(live demo|demo|preview|تجربة|معاينة|ديمو)/i.test(stripTags(m[2]))) return m[1];
  }
  return undefined;
}
