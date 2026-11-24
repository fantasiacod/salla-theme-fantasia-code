import { describe, it, expect } from 'vitest';
import {
  findDemoLink,
  href,
  isOn,
  lines,
  modeBootScript,
  parseSmartTags,
  pick,
  sectionKind,
  splitDescription,
  text,
} from '../../app/lib/fantasia';
import { cardPath } from '../../app/components/product/ProductCard';
import { highlightCode } from '../../app/components/home/fantasia/shared';

describe('settings helpers', () => {
  it('pick reads a dropdown in every shape the dashboard sends', () => {
    expect(pick('grid')).toBe('grid');
    expect(pick(['list'])).toBe('list');
    expect(pick([{ value: 'dark' }])).toBe('dark');
    expect(pick(undefined, 'light')).toBe('light');
    expect(pick('', 'light')).toBe('light');
  });

  it('text reads a multilanguage value for the locale, falling back to Arabic', () => {
    expect(text({ ar: 'مرحبا', en: 'Hi' }, 'en')).toBe('Hi');
    expect(text({ ar: 'مرحبا' }, 'en')).toBe('مرحبا');
    expect(text('plain')).toBe('plain');
    expect(text(null)).toBe('');
  });

  it('href treats empty and "#" as no link', () => {
    expect(href('#')).toBe('');
    expect(href(null)).toBe('');
    expect(href('/offers')).toBe('/offers');
    expect(href([{ url: 'https://x.test' }])).toBe('https://x.test');
  });

  it('isOn is true unless the merchant turned it off', () => {
    expect(isOn(undefined)).toBe(true);
    expect(isOn(true)).toBe(true);
    expect(isOn(false)).toBe(false);
  });

  it('lines splits a textarea and drops blank lines', () => {
    expect(lines('a\n\n  b \n')).toEqual(['a', 'b']);
  });
});

describe('parseSmartTags', () => {
  const tags = [
    'version:3.2.1',
    'platform:Windows',
    'منصة:ماك',
    'license:مدى الحياة',
    'lang:React',
    'demo:demo.example.com',
    'docs:https://docs.example.com',
    'نشر',
    'weird:',
  ].map((name) => ({ name, url: '/tags/x' }));

  it('turns key:value tags into specs and keeps the rest as plain tags', () => {
    const out = parseSmartTags(tags);
    expect(out.version).toBe('3.2.1');
    expect(out.platforms).toEqual(['Windows', 'ماك']);
    expect(out.license).toBe('مدى الحياة');
    expect(out.stack).toEqual(['React']);
    expect(out.demo).toBe('https://demo.example.com');
    expect(out.docs).toBe('https://docs.example.com');
    expect(out.plain.map((t) => t.name)).toEqual(['نشر', 'weird:']);
  });

  it('handles a product without tags', () => {
    expect(parseSmartTags(undefined).plain).toEqual([]);
  });
});

describe('splitDescription (smart tabs)', () => {
  const html =
    '<p>Intro text</p><h2>المميزات</h2><ul><li>One</li></ul><h3>متطلبات التشغيل</h3><p>4GB</p><h2>سجل التحديثات</h2><p>v1</p>';

  it('splits at headings, keeping the intro as an untitled overview', () => {
    const sections = splitDescription(html);
    expect(sections.map((s) => s.title)).toEqual([null, 'المميزات', 'متطلبات التشغيل', 'سجل التحديثات']);
    expect(sections.map((s) => s.kind)).toEqual(['generic', 'features', 'requirements', 'changelog']);
    expect(sections[1].html).toContain('<li>One</li>');
    expect(sections[0].html).not.toContain('<h2');
  });

  it('drops an empty overview when the description starts with a heading', () => {
    const sections = splitDescription('<h2>Features</h2><p>x</p>');
    expect(sections).toHaveLength(1);
    expect(sections[0].title).toBe('Features');
  });

  it('only splits at the chosen heading levels', () => {
    expect(splitDescription(html, ['h2']).map((s) => s.title)).toEqual([null, 'المميزات', 'سجل التحديثات']);
  });

  it('keeps a description without headings as one overview', () => {
    expect(splitDescription('<p>Only text</p>')).toEqual([{ title: null, html: '<p>Only text</p>', kind: 'generic' }]);
    expect(splitDescription('')).toEqual([]);
  });

  it('recognises section kinds in Arabic and English', () => {
    expect(sectionKind('System requirements')).toBe('requirements');
    expect(sectionKind('طريقة التثبيت')).toBe('install');
    expect(sectionKind('Something else')).toBe('generic');
  });
});

describe('findDemoLink', () => {
  it('finds a "live demo" link written in the description', () => {
    expect(findDemoLink('<p><a href="https://x.test/demo">جرّب التجربة المباشرة</a></p>')).toBe('https://x.test/demo');
    expect(findDemoLink('<a href="https://x.test">Contact</a>')).toBeUndefined();
  });
});

describe('modeBootScript', () => {
  it('only accepts known defaults', () => {
    expect(modeBootScript('dark')).toContain("var d='dark'");
    expect(modeBootScript('evil\'; alert(1); \'' as never)).toContain("var d='light'");
  });
});

describe('cardPath', () => {
  it('builds the window-bar path from type and name', () => {
    expect(cardPath('codes', 'Kood Deploy Pro')).toBe('~/codes/kood-deploy-pro');
    expect(cardPath(undefined, '')).toBe('~/product/');
  });
});

describe('highlightCode', () => {
  it('escapes HTML before adding its own markup', () => {
    const out = highlightCode('<img src=x onerror=alert(1)>', false);
    expect(out).not.toContain('<img');
    expect(out).toContain('&lt;img');
  });

  it('colours keywords and strings, and numbers lines on request', () => {
    const out = highlightCode("const a = 'x';\nreturn 1", true);
    expect(out).toContain('<span class="tk-k">const</span>');
    expect(out).toContain('<span class="tk-s">&#39;x&#39;</span>'.replace('&#39;x&#39;', "'x'"));
    expect(out.split('class="fc-ln"').length - 1).toBe(2);
  });
});
