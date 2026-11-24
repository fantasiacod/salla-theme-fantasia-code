/** A platform chip with its OS logo (Windows, macOS/iOS, Linux, Android, Web), else a computer icon. */
export function PlatformChip({ name }: { name: string }) {
  const n = name.toLowerCase();
  let icon = <i className="sicon-computer" aria-hidden="true" />;
  if (/win|ويندوز/.test(n)) {
    icon = (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M3 5.5 10.5 4.5v7H3zm0 13 7.5 1v-7H3zm8.5 1.1L21 21v-8.5h-9.5zm0-15.2v7.1H21V3z" />
      </svg>
    );
  } else if (/mac|ios|apple|ماك|آبل/.test(n)) {
    icon = (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.1.8c1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.7 1.3-2.7s-2.3-.9-2.3-4.1zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z" />
      </svg>
    );
  } else if (/linux|لينكس|ubuntu/.test(n)) {
    icon = <i className="sicon-terminal" aria-hidden="true" />;
  } else if (/android|أندرويد|اندرويد/.test(n)) {
    icon = <i className="sicon-android" aria-hidden="true" />;
  } else if (/web|ويب|browser|متصفح/.test(n)) {
    icon = <i className="sicon-world" aria-hidden="true" />;
  }
  return (
    <span className="fc-platform" title={name}>
      {icon}
      <span>{name}</span>
    </span>
  );
}
