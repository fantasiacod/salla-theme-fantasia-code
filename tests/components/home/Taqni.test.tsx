import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { TaqniBanners } from '../../../app/components/home/taqni/TaqniBanners';
import { TaqniCategories } from '../../../app/components/home/taqni/TaqniCategories';
import { TaqniFeatures } from '../../../app/components/home/taqni/TaqniFeatures';
import { TaqniHero } from '../../../app/components/home/taqni/TaqniHero';
import { selectedIds } from '../../../app/components/home/taqni/TaqniProducts';
import { TaqniBrandColor } from '../../../app/components/layout/TaqniBrandColor';
import { localizedText, TaqniTopbar } from '../../../app/components/layout/TaqniTopbar';

const settings = vi.hoisted(() => ({ current: {} as Record<string, unknown> }));

vi.mock('@salla.sa/twilight-theme-engine/common', () => ({
  Link: ({ to, children, className }: { to: string; children: unknown; className?: string }) => (
    <a href={to} className={className}>
      {children as never}
    </a>
  ),
}));

vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({ locale: 'en', t: (_k: string, fb?: string) => fb ?? _k }),
}));

vi.mock('@salla.sa/twilight-theme-engine/providers', () => ({
  useTwilight: () => ({ theme: { settings: settings.current }, currency: { code: 'SAR' } }),
}));

describe('TaqniHero', () => {
  it('uses the merchant image when set, and the bundled one otherwise', () => {
    const { rerender } = render(<TaqniHero data={{ title: 'T', image: 'https://cdn/x.png' }} />);
    expect(screen.getByRole('img').getAttribute('src')).toBe('https://cdn/x.png');

    rerender(<TaqniHero data={{ title: 'T', image: null }} />);
    expect(screen.getByRole('img').getAttribute('src')).toContain('hero');
  });

  it('hides a button with no text', () => {
    render(<TaqniHero data={{ title: 'T', primary_text: 'Shop', primary_url: '/s' }} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link').getAttribute('href')).toBe('/s');
  });
});

describe('list blocks', () => {
  it('render nothing with no items', () => {
    expect(render(<TaqniCategories data={{}} />).container.firstChild).toBeNull();
    expect(render(<TaqniBanners data={{ banners: [] }} />).container.firstChild).toBeNull();
    expect(render(<TaqniFeatures data={{ items: [] }} />).container.firstChild).toBeNull();
  });

  it('highlights only the first category', () => {
    const { container } = render(<TaqniCategories data={{ items: [{ title: 'A' }, { title: 'B' }] }} />);
    expect(container.querySelectorAll('.tq-cat')).toHaveLength(2);
    expect(container.querySelectorAll('.tq-cat.is-active')).toHaveLength(1);
  });

  it('cycles banner colours every three', () => {
    const banners = [{}, {}, {}, {}].map((_, i) => ({ title: `B${i}` }));
    const { container } = render(<TaqniBanners data={{ banners }} />);
    const cards = container.querySelectorAll('.tq-banner');
    expect(cards[0].className).toContain('tq-banner--blue');
    expect(cards[2].className).toContain('tq-banner--teal');
    expect(cards[3].className).toContain('tq-banner--blue');
  });
});

describe('selectedIds', () => {
  it('reads every shape the products field arrives in', () => {
    expect(selectedIds()).toEqual([]);
    expect(selectedIds([{ id: 1 }, { id: 2 }] as never)).toEqual([1, 2]);
    expect(selectedIds({ source: 'selected', source_value: [3, 4] })).toEqual([3, 4]);
    expect(selectedIds({ source: 'selected', source_value: 5 })).toEqual([5]);
    expect(selectedIds({ source: 'latest', source_value: null })).toEqual([]);
  });
});

describe('TaqniTopbar', () => {
  it('renders nothing when every text is empty', () => {
    settings.current = {};
    expect(render(<TaqniTopbar />).container.firstChild).toBeNull();
  });

  it('shows the welcome line and only the filled features', () => {
    settings.current = { tq_topbar_text: 'Hello', tq_topbar_f1: 'One', tq_topbar_f3: 'Three' };
    render(<TaqniTopbar />);
    expect(screen.getByText('Hello')).toBeTruthy();
    expect(screen.getAllByRole('listitem').map((li) => li.textContent?.trim())).toEqual([
      'One',
      'Three',
    ]);
  });
});

describe('TaqniBrandColor', () => {
  it('applies the theme colour unless the merchant turned it off', () => {
    settings.current = {};
    const on = render(<TaqniBrandColor />);
    expect(on.container.querySelector('style')?.textContent).toContain('#588BAE');
    on.unmount();

    settings.current = { tq_brand_color_enabled: false };
    expect(render(<TaqniBrandColor />).container.querySelector('style')).toBeNull();
  });
});

describe('localizedText', () => {
  it('reads plain text and per-language values, falling back to Arabic', () => {
    expect(localizedText('Hi', 'en')).toBe('Hi');
    expect(localizedText({ ar: 'مرحبا', en: 'Hi' }, 'en')).toBe('Hi');
    expect(localizedText({ ar: 'مرحبا' }, 'en')).toBe('مرحبا');
    expect(localizedText(null, 'en')).toBe('');
  });

  it('shows the visitor language in the bar', () => {
    settings.current = { tq_topbar_text: { ar: 'مرحبا', en: 'Welcome' } };
    render(<TaqniTopbar />);
    expect(screen.getByText('Welcome')).toBeTruthy();
  });
});

describe('locales', () => {
  it('has every Taqni key in both languages', () => {
    for (const lang of ['ar', 'en']) {
      const strings = JSON.parse(readFileSync(`locales/${lang}.json`, 'utf8'));
      for (const key of ['best_sellers', 'view_all', 'add_to_cart']) {
        expect(strings[`blocks.taqni.${key}`]).toBeTruthy();
      }
    }
  });
});

describe('twilight.json', () => {
  const manifest = JSON.parse(readFileSync('twilight.json', 'utf8'));

  it('lets merchants translate the top bar', () => {
    const bar = manifest.settings.filter((s: { id: string }) => s.id.startsWith('tq_topbar_'));
    expect(bar).toHaveLength(5);
    expect(bar.every((s: { multilanguage?: boolean }) => s.multilanguage === true)).toBe(true);
  });

  it('declares the five blocks and the theme name', () => {
    expect(manifest.name.en).toBe('Taqni Fantasia');
    const paths = manifest.components.map((c: { path: string }) => c.path);
    for (const key of ['hero', 'categories', 'banners', 'products', 'features']) {
      expect(paths).toContain(`home.taqni-${key}`);
    }
  });

  it('uses no icon missing from the Salla font', () => {
    expect(JSON.stringify(manifest)).not.toContain('"sicon-tools"');
  });
});
