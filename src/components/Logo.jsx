/**
 * A R T. Gallery brand logo.
 *
 * - `variant="full"` (default) renders the monogram mark + wordmark.
 * - `variant="mark"` renders just the framed "A" monogram (e.g. favicons, tight spaces).
 *
 * The mark uses `currentColor` so it inherits the surrounding text color and
 * works in both light and dark themes.
 */
export function LogoMark({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="A R T. Gallery"
    >
      {/* Gallery frame */}
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="10"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      {/* Stylized "A" */}
      <path
        d="M16 34 L24 14 L32 34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 27 H28.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Spotlight dot */}
      <circle cx="24" cy="9.5" r="1.8" fill="currentColor" />
    </svg>
  );
}

export default function Logo({
  variant = "full",
  size = 30,
  className = "",
  wordClassName = "",
}) {
  if (variant === "mark") {
    return <LogoMark size={size} className={className} />;
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span
        className={`font-black font-serif leading-none tracking-[0.18em] ${wordClassName}`}
      >
        A R T.<span className="font-light tracking-normal"> Gallery</span>
      </span>
    </span>
  );
}
