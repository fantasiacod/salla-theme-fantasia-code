import { useQuery } from '@tanstack/react-query';
import { SallaAddProductButton } from '@salla.sa/twilight-components-react/add-product-button';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { product as productApi } from '@salla.sa/twilight-theme-engine/api/product';
import { useMoney } from '@salla.sa/twilight-theme-engine/hooks/useMoney';
import { useWishlist } from '@salla.sa/twilight-theme-engine/hooks/useWishlist';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import type { Product } from '@salla.sa/twilight-theme-engine/types';

/** How many products to show when the merchant picked none (the Twig block's limit). */
const LATEST_LIMIT = 4;
/** The field's `maxLength` in `twilight.json`. */
const SELECTED_LIMIT = 12;

/** The field arrives as a list of products or as a `{ source, source_value }` config. */
type ProductsField = Product[] | { source?: string; source_value?: number | number[] | null };

export interface TaqniProductsProps {
  data: {
    title?: string;
    products?: ProductsField;
    cart_text?: string;
    display_all_text?: string;
    display_all_url?: string | null;
    [key: string]: unknown;
  };
}

export function selectedIds(field?: ProductsField): number[] {
  if (Array.isArray(field)) {
    return field.map((p) => p.id).filter((id): id is number => typeof id === 'number');
  }
  const value = field?.source_value;
  if (Array.isArray(value)) return value;
  return typeof value === 'number' ? [value] : [];
}

function TaqniProductCard({ product, cartText }: { product: Product; cartText: string }) {
  const { t } = useTranslation();
  const { format } = useMoney();
  const { currency } = useTwilight();
  const wishlist = useWishlist();
  const money = (amount: number | string | null) =>
    format(amount ?? undefined, currency?.code ? { currency: currency.code } : undefined);

  return (
    <article className="tq-pcard">
      <div className="tq-pcard__body">
        <Link to={product.url} className="tq-pcard__name">
          {product.name}
        </Link>
        {product.subtitle && <p className="tq-pcard__sub">{product.subtitle}</p>}
        <div className="tq-pcard__price">
          {product.is_on_sale ? (
            <>
              <strong>{money(product.sale_price)}</strong>
              <del>{money(product.regular_price)}</del>
            </>
          ) : (
            <strong>{money(product.price)}</strong>
          )}
        </div>
        <div className="tq-pcard__actions">
          <SallaAddProductButton
            productId={product.id}
            productStatus={product.status}
            productType={product.type}
            width="wide"
          >
            <i className="sicon-shopping-bag" aria-hidden="true" /> <span>{cartText}</span>
          </SallaAddProductButton>
          <button
            type="button"
            className="tq-pcard__wish"
            aria-label={t('pages.wishlist.toggle', 'Add or remove to wishlist')}
            aria-pressed={wishlist.has(product.id)}
            onClick={() => wishlist.toggle(product.id)}
          >
            <i className="sicon-heart" aria-hidden="true" />
          </button>
        </div>
      </div>
      <Link to={product.url} className="tq-pcard__media">
        <img src={product.image?.url} alt={product.image?.alt || product.name} loading="lazy" />
        {!!product.rating?.stars && (
          <span className="tq-pcard__rating">
            <i className="sicon-star2" aria-hidden="true" /> {product.rating.stars}
          </span>
        )}
        {product.promotion_title && (
          <span className="tq-pcard__tag">{product.promotion_title}</span>
        )}
      </Link>
    </article>
  );
}

/**
 * `home.taqni-products`: the merchant's picked products as horizontal cards, or the
 * newest products when none were picked.
 */
export function TaqniProducts({ data }: TaqniProductsProps) {
  const { t } = useTranslation();
  const ids = selectedIds(data.products);

  const { data: result } = useQuery(
    productApi.queries.list(
      ids.length
        ? { source: 'selected', sourceValue: ids, perPage: SELECTED_LIMIT }
        : { source: 'latest', perPage: LATEST_LIMIT }
    )
  );
  const products = result?.items ?? [];
  const displayAll = data.display_all_url;

  if (!products.length) return null;

  return (
    <div className="container">
      <div className="tq-section-head">
        <h2>
          <i className="sicon-fire" aria-hidden="true" />{' '}
          {data.title || t('blocks.taqni.best_sellers', 'Best sellers')}
        </h2>
        {displayAll && displayAll !== '#' && (
          <Link to={displayAll} className="tq-link">
            {data.display_all_text || t('blocks.taqni.view_all', 'View all products')}{' '}
            <i className="sicon-arrow-left tq-flip" aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="tq-products__grid">
        {products.map((item) => (
          <TaqniProductCard
            key={item.id}
            product={item}
            cartText={data.cart_text || t('blocks.taqni.add_to_cart', 'Add to cart')}
          />
        ))}
      </div>
    </div>
  );
}
