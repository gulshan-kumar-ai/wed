/**
 * Minimalist gold line-art Ganesha: mukut (crown), broad ears, tilak,
 * single tusk and the trunk curling to his left. viewBox 100 × 100.
 * Swap via `artwork.ganesha` for a commissioned emblem.
 */
export default function GaneshaEmblem({ className = '', image = null }) {
  if (image) return <img src={image} alt="Lord Ganesha" className={className} />;
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Lord Ganesha">
      <defs>
        <linearGradient id="ganesha-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9CF7A" />
          <stop offset="0.5" stopColor="#C9A13A" />
          <stop offset="1" stopColor="#9C7A1E" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#ganesha-gold)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Halo */}
        <circle cx="50" cy="44" r="40" strokeWidth="1" strokeDasharray="1.5 3.5" />
        {/* Mukut */}
        <path d="M37 30 L39.5 19 L45 14 L50 7 L55 14 L60.5 19 L63 30" />
        <path d="M35.5 30 H64.5" />
        <path d="M41 24 H59" strokeWidth="1.4" />
        {/* Ears */}
        <path d="M37 33 C21 25 11 38 16 52 C19 61 30 62 39 55" />
        <path d="M63 33 C79 25 89 38 84 52 C81 61 70 62 61 55" />
        <path d="M33 38 C25 37 21 44 24 50" strokeWidth="1.3" />
        <path d="M67 38 C75 37 79 44 76 50" strokeWidth="1.3" />
        {/* Face */}
        <path d="M37 31 C35 42 37 50 42 55" />
        <path d="M63 31 C65 42 63 50 58 55" />
        {/* Eyes */}
        <path d="M41.5 39 Q44.5 37 47.5 39" />
        <path d="M52.5 39 Q55.5 37 58.5 39" />
        {/* Trunk curling to Ganesha's left (viewer's right) */}
        <path d="M47 42 C45 56 45 68 50 76 C55 84 65 85 67 78 C68.5 73 63 71 61.5 75" strokeWidth="2.8" />
        <path d="M53 42 C53 52 54 60 57 66" strokeWidth="1.6" />
        {/* Tusk */}
        <path d="M43 55 Q38 60 41 66" />
        {/* Modak & lotus seat */}
        <path d="M30 86 Q50 80 70 86" strokeWidth="1.6" />
        <path d="M38 90 Q50 85 62 90" strokeWidth="1.2" />
      </g>
      {/* Tilak */}
      <path d="M50 26 v6" stroke="#A93226" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="35" r="1.4" fill="#A93226" />
      <circle cx="50" cy="7" r="2" fill="#C9A13A" />
    </svg>
  );
}
