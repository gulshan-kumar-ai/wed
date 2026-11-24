/** Fine gold divider with a central lotus-diamond motif. */
export default function Ornament({ className = '' }) {
  return (
    <svg viewBox="0 0 240 16" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="orn-l" x1="0" x2="1">
          <stop offset="0" stopColor="#D4AF37" stopOpacity="0" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
        <linearGradient id="orn-r" x1="1" x2="0">
          <stop offset="0" stopColor="#D4AF37" stopOpacity="0" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      <line x1="0" y1="8" x2="100" y2="8" stroke="url(#orn-l)" strokeWidth="1" />
      <line x1="140" y1="8" x2="240" y2="8" stroke="url(#orn-r)" strokeWidth="1" />
      <circle cx="104" cy="8" r="1.6" fill="#D4AF37" />
      <circle cx="136" cy="8" r="1.6" fill="#D4AF37" />
      <path d="M120 1 L127 8 L120 15 L113 8 Z" fill="none" stroke="#D4AF37" strokeWidth="1.2" />
      <path d="M120 4.5 L123.5 8 L120 11.5 L116.5 8 Z" fill="#A93226" />
    </svg>
  );
}
