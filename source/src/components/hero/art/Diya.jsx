import { motion } from 'framer-motion';

/** Gradients used by <DiyaGlyph>. Include once inside the <defs> of any SVG that draws diyas. */
export function DiyaDefs() {
  return (
    <>
      <radialGradient id="diya-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.95" />
        <stop offset="0.35" stopColor="#FFC46B" stopOpacity="0.45" />
        <stop offset="1" stopColor="#FFB04A" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="diya-brass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F1D27A" />
        <stop offset="0.45" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#8C6A1C" />
      </linearGradient>
      <linearGradient id="flame-grad" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#E67E22" />
        <stop offset="0.35" stopColor="#FFB347" />
        <stop offset="0.75" stopColor="#FFE08A" />
        <stop offset="1" stopColor="#FFF6D6" />
      </linearGradient>
    </>
  );
}

/**
 * Brass diya drawn around its base point (0, 0), ~70 units wide.
 * Place with x/y and scale; `seed` desynchronises the flicker between lamps.
 */
export function DiyaGlyph({ x = 0, y = 0, scale = 1, animate = true, seed = 0 }) {
  const dur = 1.1 + ((seed * 37) % 10) / 14;
  const delay = ((seed * 53) % 10) / 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <motion.circle
        cx="27"
        cy="-34"
        r="54"
        fill="url(#diya-glow)"
        animate={animate ? { opacity: [0.7, 1, 0.78, 0.95, 0.7] } : undefined}
        transition={{ duration: dur * 2.2, repeat: Infinity, ease: 'easeInOut', delay }}
      />
      <ellipse cx="0" cy="9" rx="13" ry="3.5" fill="#8C6A1C" />
      <path d="M-30 -14 Q-26 6 0 8 Q24 6 36 -19 Q16 -12 0 -12 Q-16 -12 -30 -14 Z" fill="url(#diya-brass)" />
      <ellipse cx="2" cy="-12.8" rx="24" ry="2.4" fill="#6E4310" opacity="0.85" />
      <path d="M-30 -14 Q-16 -12 0 -12 Q16 -12 36 -19" fill="none" stroke="#FBEFC2" strokeWidth="1.4" />
      <g transform="translate(29 -17)">
        <motion.path
          d="M0 0 C-7 -6 -6 -18 0 -32 C6 -18 7 -6 0 0 Z"
          fill="url(#flame-grad)"
          style={{ originX: 0.5, originY: 1 }}
          animate={
            animate
              ? { scaleY: [1, 1.14, 0.94, 1.08, 1], scaleX: [1, 0.92, 1.04, 0.96, 1], rotate: [-2, 3, -1, 2, -2] }
              : undefined
          }
          transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
        />
        <path d="M0 -2 C-3 -5 -2.5 -10 0 -15 C2.5 -10 3 -5 0 -2 Z" fill="#FFFDF2" />
      </g>
    </g>
  );
}

/** Stand-alone diya as its own SVG, for HTML-positioned placements. */
export default function Diya({ className = '', animate = true, seed = 0 }) {
  return (
    <svg viewBox="-60 -100 150 120" className={className} aria-hidden="true">
      <defs>
        <DiyaDefs />
      </defs>
      <DiyaGlyph animate={animate} seed={seed} />
    </svg>
  );
}
