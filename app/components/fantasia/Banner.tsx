import { Link } from '@salla.sa/twilight-theme-engine/common';

export interface BannerProps {
  image: string;
  mobile?: string | null;
  alt?: string;
  url?: string;
  rounded?: boolean;
  zoom?: boolean;
}

/** One responsive banner image (the merchant's own artwork), optionally linked. */
export function Banner({ image, mobile, alt = '', url, rounded = true, zoom = true }: BannerProps) {
  const className = `fc-banner${rounded ? ' is-rounded' : ''}${zoom ? ' is-zoom' : ''}`;
  const picture = (
    <picture>
      {mobile && <source media="(max-width: 639px)" srcSet={mobile} />}
      <img src={image} alt={alt} loading="lazy" decoding="async" />
    </picture>
  );
  if (!url) return <div className={className}>{picture}</div>;
  return (
    <Link to={url} className={className} aria-label={alt || undefined}>
      {picture}
    </Link>
  );
}
