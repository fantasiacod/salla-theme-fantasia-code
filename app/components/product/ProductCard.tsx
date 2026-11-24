import { useEffect, useMemo, useRef, useState, type ComponentProps } from 'react';
import { createPortal } from 'react-dom';
import { ProductCard as EngineProductCard } from '@salla.sa/twilight-theme-engine/product';
import { useWishlist } from '@salla.sa/twilight-theme-engine/hooks/useWishlist';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { registerNativeBookingHook } from '../../lib/nativeBooking';
import { withImageFallback } from '../../lib/productImage';
import { WishlistHeartButton } from './WishlistHeartButton';
import { useThemeSettings } from '../../hooks/useThemeSettings';

/** Fantasia Code: how a software product is delivered, shown above the card title. */
const DELIVERY: Record<string, { icon: string; tKey: string; ar: string; en: string }> = {
  digital: { icon: 'sicon-download', tKey: 'blocks.fantasia.instant_download', ar: 'تحميل فوري', en: 'Instant download' },
  codes: { icon: 'sicon-key', tKey: 'blocks.fantasia.license_key_delivery', ar: 'مفتاح ترخيص فوري', en: 'Instant license key' },
  service: { icon: 'sicon-headphones', tKey: 'blocks.fantasia.dev_service', ar: 'خدمة برمجية', en: 'Dev service' },
};

/** `~/codes/kood-deploy-pro`: the monospace "path" in the card's window bar. */
export function cardPath(type: string | undefined, name: string | undefined): string {
  const slug = String(name ?? '').trim().toLowerCase().replace(/\s+/g, '-').slice(0, 24);
  return `~/${type || 'product'}/${slug}`;
}

type ProductCardProps = ComponentProps<typeof EngineProductCard>;

/**
 * Thin wrapper over the engine `ProductCard`.
 *
 * After mount (and whenever the lazily-hydrated bits appear):
 *  - sets `display: none` inline on a vertical card's own image-corner
 *    wishlist button (a plain style mutation on an existing node — safe,
 *    unlike moving it; see below), and portals a theme-owned wishlist button
 *    into `.s-product-card-content-footer` instead. Hiding it inline rather
 *    than only through `04-components/product.scss` keeps this component
 *    correct on its own — that stylesheet's rule hides it too, from the
 *    first paint.
 *  - The engine's button is a React-owned node; physically moving it there
 *    with `appendChild` (the previous approach) left React still tracking it
 *    as a child of the image container, so on unmount (e.g. navigating away)
 *    React tried to `removeChild` it from a parent it was no longer inside,
 *    throwing `NotFoundError`. A portal keeps this button fully React-managed
 *    at its real DOM location instead.
 *  - sets `loader-position="center"` on the add-to-cart button (grid + list).
 * A product with no photo shows the theme's placeholder, as the Twig card does
 * (the engine `Image` renders nothing without a `src`).
 * Inside the Salla app, a booking product's "Book now" fires `mobile::booking.open`
 * instead of opening the booking page (`lib/nativeBooking.ts`).
 * Styling: `04-components/product.scss`.
 */
export function ProductCard(props: ProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [footerEl, setFooterEl] = useState<HTMLElement | null>(null);
  const [mainEl, setMainEl] = useState<HTMLElement | null>(null);
  const fcSettings = useThemeSettings();
  const windowBar = fcSettings.card_window_bar !== false;
  const showDelivery = fcSettings.card_delivery_badge !== false;
  const delivery = showDelivery ? DELIVERY[String(props.product.type ?? '')] : undefined;
  const path = windowBar ? cardPath(props.product.type, props.product.name) : '';
  const { product, isPlaceholder } = useMemo(
    () => withImageFallback(props.product),
    [props.product]
  );

  useEffect(() => {
    registerNativeBookingHook();
    const root = ref.current;
    if (!root) return;

    const sync = () => {
      root.querySelectorAll<HTMLElement>('salla-add-product-button').forEach((el) => {
        // engine ships the card button fill="outline"; make it solid + centre its spinner
        el.setAttribute('fill', 'solid');
        el.setAttribute('loader-position', 'center');
      });

      // Fantasia Code: the window bar reads its text from this attribute (06-fantasia/_card.scss).
      const card = root.querySelector<HTMLElement>('.s-product-card-entry');
      if (card) {
        if (path) card.setAttribute('data-fc-path', path);
        else card.removeAttribute('data-fc-path');
      }
      setMainEl(root.querySelector<HTMLElement>('.s-product-card-content-main'));

      const vertical = root.querySelector<HTMLElement>('.s-product-card-vertical');
      if (!vertical) return;

      const originalWishlistBtn = vertical.querySelector<HTMLElement>(
        '.s-product-card-image .s-product-card-wishlist-btn'
      );
      if (originalWishlistBtn) originalWishlistBtn.style.display = 'none';

      setFooterEl(vertical.querySelector<HTMLElement>('.s-product-card-content-footer'));
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [path]);

  return (
    <div
      ref={ref}
      style={{ display: 'contents' }}
      data-image-placeholder={isPlaceholder ? 'true' : undefined}
    >
      <EngineProductCard {...props} product={product} />
      {mainEl && delivery && createPortal(<DeliveryBadge {...delivery} />, mainEl)}
      {footerEl &&
        createPortal(
          // List responses send the id as a numeric string; the wishlist holds numbers.
          <FooterWishlistButton productId={Number(props.product.id)} />,
          footerEl
        )}
    </div>
  );
}

/** Same button the engine renders for `horizontal`/`fullImage` layouts
 * (`ProductCardContent`, theme-engine) — reused here for `vertical`, which
 * the engine only ever places in the image corner. */
function FooterWishlistButton({ productId }: { productId: number }) {
  const { t } = useTranslation();
  const wishlist = useWishlist();
  const inWishlist = wishlist.has(productId);

  return (
    <WishlistHeartButton
      productId={productId}
      ariaLabel={t('pages.wishlist.toggle', 'Add or remove to wishlist')}
      pressed={inWishlist}
      className={`s-product-card-wishlist-btn animated ${inWishlist ? 's-product-card-wishlist-added pulse-anime' : 'not-added un-favorited'}`}
      onClick={() => wishlist.toggle(productId)}
    />
  );
}

function DeliveryBadge({ icon, tKey, ar, en }: { icon: string; tKey: string; ar: string; en: string }) {
  const { t, locale } = useTranslation();
  return (
    <span className="fc-card-delivery">
      <i className={icon} aria-hidden="true" />
      {t(tKey, locale === 'ar' ? ar : en)}
    </span>
  );
}
