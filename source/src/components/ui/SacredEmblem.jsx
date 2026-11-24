/** Hindu sathiya (swastika): upright, right-facing, with four dots. */
export function Swastika({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 50 V12 H86 M50 50 H88 V86 M50 50 V88 H14 M50 50 H12 V14"
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {[
        [31, 31],
        [69, 31],
        [69, 69],
        [31, 69],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill="currentColor" />
      ))}
    </svg>
  );
}

/** Om within a slowly turning gold lotus medallion. */
export function OmMedallion({ className = '' }) {
  const petals = 16;
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Om">
      <defs>
        <radialGradient id="om-core" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stopColor="#FFFBF1" />
          <stop offset="1" stopColor="#F8E3C0" />
        </radialGradient>
        <linearGradient id="om-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E6A6" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#9C7A1E" />
        </linearGradient>
      </defs>
      <g className="animate-spin-slow" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        {Array.from({ length: petals }, (_, i) => (
          <path
            key={i}
            d="M60 4 Q67 14 60 24 Q53 14 60 4 Z"
            fill="url(#om-gold)"
            opacity={i % 2 ? 0.65 : 1}
            transform={`rotate(${(360 / petals) * i} 60 60)`}
          />
        ))}
      </g>
      <circle cx="60" cy="60" r="35" fill="url(#om-core)" stroke="url(#om-gold)" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="30" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="2 3" />
      <text
        x="60"
        y="61"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Noto Serif Devanagari', 'Nirmala UI', serif"
        fontSize="38"
        fontWeight="600"
        fill="#A93226"
      >
        ॐ
      </text>
    </svg>
  );
}

/** Om medallion flanked by sathiyas, joined with fine gold rules. */
export default function SacredEmblem({ om = true, swastika = true, className = '' }) {
  if (!om && !swastika) return null;
  return (
    <div className={`flex items-center justify-center gap-3 sm:gap-4 ${className}`}>
      {swastika && (
        <>
          <Swastika className="h-[clamp(18px,3svh,26px)] w-auto text-crimson" />
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold sm:w-14" />
        </>
      )}
      {om && <OmMedallion className="h-[clamp(56px,9svh,84px)] w-auto drop-shadow-[0_2px_10px_rgba(212,175,55,0.45)]" />}
      {swastika && (
        <>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold sm:w-14" />
          <Swastika className="h-[clamp(18px,3svh,26px)] w-auto text-crimson" />
        </>
      )}
    </div>
  );
}
