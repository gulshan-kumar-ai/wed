/** Traditional motif icons in gold line + crimson accents. viewBox 64 × 64. */

const base = {
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'url(#motif-gold)',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Gold() {
  return (
    <defs>
      <linearGradient id="motif-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E3C25C" />
        <stop offset="1" stopColor="#9C7A1E" />
      </linearGradient>
    </defs>
  );
}

export function LotusIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <Gold />
      <path d="M32 14 C40 22 40 36 32 46 C24 36 24 22 32 14 Z" fill="#A93226" fillOpacity="0.12" />
      <path d="M32 46 C22 44 15 36 14 26 C22 28 28 34 32 46 Z" />
      <path d="M32 46 C42 44 49 36 50 26 C42 28 36 34 32 46 Z" />
      <path d="M32 46 C20 48 10 44 6 36 C16 34 26 38 32 46 Z" />
      <path d="M32 46 C44 48 54 44 58 36 C48 34 38 38 32 46 Z" />
      <path d="M14 52 H50" />
      <path d="M20 56 H44" strokeWidth="1.4" />
    </svg>
  );
}

export function DholIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <Gold />
      <ellipse cx="14" cy="32" rx="6" ry="15" fill="#A93226" fillOpacity="0.12" />
      <ellipse cx="50" cy="32" rx="6" ry="15" />
      <path d="M14 17 C24 13 40 13 50 17 M14 47 C24 51 40 51 50 47" />
      <path d="M20 17 L28 47 M28 15 L36 49 M36 15 L44 47 M44 16 L22 48" strokeWidth="1.2" />
      <path d="M6 10 L16 22" stroke="#A93226" />
      <path d="M58 8 C52 12 50 18 54 22" stroke="#A93226" />
    </svg>
  );
}

export function MarigoldIcon(props) {
  const petals = 12;
  return (
    <svg {...base} {...props} aria-hidden="true">
      <Gold />
      {Array.from({ length: petals }, (_, i) => (
        <path key={i} d="M32 8 C36 14 36 20 32 24 C28 20 28 14 32 8 Z" transform={`rotate(${(360 / petals) * i} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="8" fill="#E67E22" fillOpacity="0.25" />
      <circle cx="32" cy="32" r="3" fill="#A93226" stroke="none" />
    </svg>
  );
}

export function SacredFireIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <Gold />
      <path d="M32 8 C40 18 44 24 40 32 C44 30 46 26 46 22 C52 30 50 40 44 44 H20 C14 40 12 30 18 22 C18 26 20 30 24 32 C20 24 24 18 32 8 Z" fill="#E67E22" fillOpacity="0.18" />
      <path d="M32 26 C35 31 36 35 34 40 M30 32 C28 35 28 38 30 41" stroke="#A93226" strokeWidth="1.6" />
      <path d="M12 44 H52 L48 50 H16 Z" />
      <path d="M18 50 L14 58 H50 L46 50" />
      <path d="M24 54 H40" strokeWidth="1.2" />
    </svg>
  );
}

export const MOTIFS = {
  lotus: LotusIcon,
  dhol: DholIcon,
  marigold: MarigoldIcon,
  fire: SacredFireIcon,
};
