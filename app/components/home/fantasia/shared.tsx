import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';

/** Every Fantasia home block receives the merchant's fields as `data`. */
export type BlockData = Record<string, unknown>;
export type BlockProps = { data: BlockData };

/** A collection field: always an array of plain objects. */
export const rows = (raw: unknown): Record<string, unknown>[] =>
  Array.isArray(raw) ? raw.filter((r): r is Record<string, unknown> => !!r && typeof r === 'object') : [];

export const str = (raw: unknown): string => (typeof raw === 'string' ? raw : typeof raw === 'number' ? String(raw) : '');

/** Becomes true once the element is on screen (and stays true). */
export function useOnScreen<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === 'undefined') return setSeen(true);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);
  return [ref, seen] as const;
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Copy to the clipboard, with a textarea fallback for older browsers. */
export async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value });
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

/** A "Copy" label that says "Copied ✓" for a moment after `copy()`. */
export function useCopy() {
  const { t, locale } = useTranslation();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(id);
  }, [copied]);
  const ar = locale === 'ar';
  return {
    copied,
    label: copied ? t('blocks.fantasia.copied', ar ? 'تم النسخ ✓' : 'Copied ✓') : t('blocks.fantasia.copy', ar ? 'نسخ' : 'Copy'),
    copy: async (value: string) => {
      await copyText(value);
      setCopied(true);
    },
  };
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const RULES: [string, RegExp][] = [
  ['c', /(\/\/[^\n]*|#(?!include)[^\n]*|\/\*[\s\S]*?\*\/)/y],
  ['s', /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/y],
  ['k', /\b(import|from|export|const|let|var|function|return|await|async|new|class|use|def|if|else|for|while|public|private|echo|require|package|func|fn|true|false|null|None|self|this)\b/y],
  ['n', /\b(\d+(?:\.\d+)?)\b/y],
  ['v', /(\$[a-zA-Z_]\w*)/y],
  ['f', /([a-zA-Z_]\w*)(?=\()/y],
];

/**
 * A tiny syntax highlighter for the merchant's snippets. Every character is HTML-escaped
 * before any markup is added, so the result is safe to set as HTML.
 */
export function highlightCode(source: string, withLines: boolean): string {
  let out = '';
  let i = 0;
  outer: while (i < source.length) {
    for (const [cls, re] of RULES) {
      re.lastIndex = i;
      const m = re.exec(source);
      if (m && m.index === i && m[0].length) {
        out += `<span class="tk-${cls}">${escapeHtml(m[0])}</span>`;
        i += m[0].length;
        continue outer;
      }
    }
    out += escapeHtml(source[i]);
    i += 1;
  }
  return withLines ? out.split('\n').map((l) => `<span class="fc-ln">${l || ' '}</span>`).join('\n') : out;
}
