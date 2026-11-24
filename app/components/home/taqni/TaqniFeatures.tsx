interface FeatureItem {
  icon?: string;
  title?: string;
  text?: string;
}

export interface TaqniFeaturesProps {
  data: { items?: FeatureItem[]; [key: string]: unknown };
}

/** `home.taqni-features`: the strip of store promises. */
export function TaqniFeatures({ data }: TaqniFeaturesProps) {
  const items = data.items ?? [];
  if (!items.length) return null;

  return (
    <div className="container">
      <div className="tq-features__grid">
        {items.map((item, index) => (
          <div className="tq-feature" key={index}>
            <i className={item.icon} aria-hidden="true" />
            <div>
              <strong>{item.title}</strong>
              <small>{item.text}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
