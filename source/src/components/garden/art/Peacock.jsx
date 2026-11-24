import { useId } from 'react';
import { motion } from 'framer-motion';

// Train feathers: [angle° (90 = straight down), length]
const FEATHERS = [
  [158, 150], [100, 150], [146, 154], [112, 154], [134, 156], [123, 156],
  [152, 136], [106, 138], [140, 140], [117, 142], [128, 144],
];

function Feather({ angle, len, ids }) {
  return (
    <g transform={`rotate(${angle - 90})`}>
      <path
        d={`M0 0 Q6 ${len * 0.5} 10 ${len * 0.84} Q0 ${len * 1.02} -10 ${len * 0.84} Q-6 ${len * 0.5} 0 0 Z`}
        fill={`url(#${ids.barb})`}
      />
      <path d={`M0 0 L0 ${len * 0.9}`} stroke="#A9C97A" strokeWidth="0.8" opacity="0.7" />
      <g transform={`translate(0 ${len * 0.86})`}>
        <ellipse rx="9.5" ry="11.5" fill="#C9B037" />
        <ellipse rx="7.2" ry="8.8" fill="#16877A" />
        <ellipse rx="4.6" ry="5.8" cy="-0.6" fill="#1D3E8F" />
        <ellipse rx="2.3" ry="3" cy="-1" fill="#0B1640" />
      </g>
    </g>
  );
}

/**
 * Placeholder: Indian peafowl perched on a rail, facing right, train draped
 * down to the left. viewBox 300 × 300; the perch line is at y = 150.
 */
export default function Peacock({ className = '', animate = true, flip = false }) {
  const uid = useId().replace(/:/g, '');
  const ids = { barb: `pk-barb-${uid}`, blue: `pk-blue-${uid}` };

  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <defs>
        <linearGradient id={ids.barb} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2C5E2E" />
          <stop offset="0.7" stopColor="#4E8A3A" />
          <stop offset="1" stopColor="#8DB35A" />
        </linearGradient>
        <linearGradient id={ids.blue} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2F7FD6" />
          <stop offset="0.55" stopColor="#1C55A8" />
          <stop offset="1" stopColor="#0F3470" />
        </linearGradient>
      </defs>

      <g transform="translate(40 0)">
        {/* Train, swaying gently */}
        <motion.g
          style={{ originX: 0, originY: 0 }}
          animate={animate ? { rotate: [0, 1.6, 0, -1, 0] } : undefined}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <g transform="translate(142 132)">
            {FEATHERS.map(([a, l], i) => (
              <Feather key={i} angle={a} len={l} ids={ids} />
            ))}
          </g>
        </motion.g>

        {/* Body */}
        <path d="M134 130 C144 102 182 92 200 110 C212 124 202 148 180 150 C160 152 140 144 134 130 Z" fill={`url(#${ids.blue})`} />
        {/* Wing with barring */}
        <path d="M140 126 C152 104 182 102 192 118 C182 134 158 140 140 126 Z" fill="#C49A5E" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${150 + i * 9} ${112 + i * 1.5} q4 10 0 20`} stroke="#8A6332" strokeWidth="1.6" fill="none" />
        ))}

        {/* Neck + head, with an occasional look-around */}
        <motion.g
          style={{ originX: 0.3, originY: 1 }}
          animate={animate ? { rotate: [0, 0, -6, -6, 0, 0] } : undefined}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', times: [0, 0.4, 0.48, 0.7, 0.78, 1] }}
        >
          <path d="M182 118 C188 96 180 78 189 60 L204 63 C199 80 206 100 202 118 Z" fill={`url(#${ids.blue})`} />
          <circle cx="197" cy="56" r="10.5" fill="#1E56B0" />
          <path d="M206 53 L219 58 L206 61 Z" fill="#9C8A6A" />
          <path d="M189 53 q7 -4 14 0" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M190 61 q6 3 12 0" stroke="#FFFFFF" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.9" />
          <circle cx="200" cy="55" r="1.8" fill="#0B1640" />
          {/* Crest */}
          {[-16, -8, 0, 8, 16].map((d, i) => {
            const x2 = 196 + d * 0.7;
            const y2 = 28 + Math.abs(d) * 0.3;
            return (
              <g key={i}>
                <line x1="196" y1="46" x2={x2} y2={y2} stroke="#1C55A8" strokeWidth="1" />
                <circle cx={x2} cy={y2} r="2.4" fill="#16877A" />
              </g>
            );
          })}
        </motion.g>

        {/* Feet gripping the rail */}
        <path d="M170 148 L168 153 M164 153 h9 M184 148 L185 153 M180 153 h9" stroke="#7F6E52" strokeWidth="2.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}
