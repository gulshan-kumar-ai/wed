import { useId, useMemo } from 'react';
import { motion } from 'framer-motion';
import { seeded } from '../../layout/random';

const MARIGOLD = ['#E67E22', '#F39C12', '#F4B400'];

function Marigold({ x, y, r, color }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} />
      <circle cx={x} cy={y} r={r * 0.68} fill={color} stroke="#B85F12" strokeOpacity="0.35" strokeWidth={r * 0.12} />
      <circle cx={x - r * 0.25} cy={y - r * 0.25} r={r * 0.3} fill="#FFE29A" opacity="0.55" />
    </g>
  );
}

function Rose({ x, y, r }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#A93226" />
      <circle cx={x + r * 0.08} cy={y - r * 0.05} r={r * 0.66} fill="none" stroke="#7A1F17" strokeWidth={r * 0.14} />
      <circle cx={x} cy={y} r={r * 0.3} fill="#7A1F17" />
      <circle cx={x - r * 0.35} cy={y - r * 0.4} r={r * 0.22} fill="#D05A4A" opacity="0.6" />
    </g>
  );
}

/**
 * Placeholder: polished brass urn overflowing with marigolds, roses and
 * mango leaves, with marigold strands hanging from the rim. viewBox 320 × 480.
 */
export default function FloralUrn({ className = '', seed = 3, animate = true }) {
  const uid = useId().replace(/:/g, '');
  const brass = `urn-brass-${uid}`;
  const shine = `urn-shine-${uid}`;

  const blooms = useMemo(() => {
    const rand = seeded(seed);
    const items = [];
    // Leaves fanning out behind the flowers
    for (let i = 0; i < 14; i += 1) {
      const a = -Math.PI + (i / 13) * Math.PI;
      items.push({
        kind: 'leaf',
        x: 160 + Math.cos(a) * 104,
        y: 262 + Math.sin(a) * 108,
        rot: (a * 180) / Math.PI + 90,
        len: 46 + rand() * 18,
      });
    }
    // Dome of flowers
    for (let i = 0; i < 46; i += 1) {
      const a = -Math.PI + rand() * Math.PI;
      const rr = Math.sqrt(rand());
      const x = 160 + Math.cos(a) * rr * 120;
      const y = 282 + Math.sin(a) * rr * 120;
      const isRose = rand() < 0.26;
      items.push({
        kind: isRose ? 'rose' : 'marigold',
        x,
        y,
        r: isRose ? 11 + rand() * 4 : 13 + rand() * 6,
        color: MARIGOLD[Math.floor(rand() * 3)],
      });
    }
    items.sort((p, q) => (p.kind === 'leaf' ? -1 : q.kind === 'leaf' ? 1 : p.y - q.y));
    return items;
  }, [seed]);

  return (
    <svg viewBox="0 0 320 480" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={brass} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7A5A14" />
          <stop offset="0.3" stopColor="#D4AF37" />
          <stop offset="0.48" stopColor="#F8E8A8" />
          <stop offset="0.65" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#6E5010" />
        </linearGradient>
        <linearGradient id={shine} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Foliage + flowers */}
      {blooms.map((b, i) => {
        if (b.kind === 'leaf') {
          return (
            <path
              key={i}
              d={`M0 0 Q${b.len * 0.28} ${-b.len * 0.5} 0 ${-b.len} Q${-b.len * 0.28} ${-b.len * 0.5} 0 0 Z`}
              transform={`translate(${b.x} ${b.y}) rotate(${b.rot})`}
              fill={i % 2 ? '#5E7A3A' : '#46612A'}
            />
          );
        }
        return b.kind === 'rose' ? (
          <Rose key={i} x={b.x} y={b.y} r={b.r} />
        ) : (
          <Marigold key={i} x={b.x} y={b.y} r={b.r} color={b.color} />
        );
      })}

      {/* Urn: rim, bowl, stem, foot */}
      <ellipse cx="160" cy="292" rx="96" ry="12" fill={`url(#${brass})`} />
      <path
        d="M76 296 C66 350 96 404 160 410 C224 404 254 350 244 296 Z"
        fill={`url(#${brass})`}
      />
      <path d="M90 312 C88 350 110 384 140 396" fill="none" stroke={`url(#${shine})`} strokeWidth="7" strokeLinecap="round" />
      <path d="M84 334 H236" stroke="#8C6A1C" strokeWidth="3" opacity="0.55" />
      <path d="M90 350 H230" stroke="#F6E6A6" strokeWidth="1.5" opacity="0.6" />
      <rect x="138" y="408" width="44" height="26" fill={`url(#${brass})`} />
      <path d="M104 470 Q110 438 160 434 Q210 438 216 470 Z" fill={`url(#${brass})`} />
      <ellipse cx="160" cy="472" rx="62" ry="7" fill="#6E5010" />

      {/* Hanging marigold strands from the rim */}
      {[96, 160, 224].map((x, s) => (
        <motion.g
          key={x}
          style={{ originX: 0.5, originY: 0 }}
          animate={animate ? { rotate: [-2, 2, -2] } : undefined}
          transition={{ duration: 4 + s, repeat: Infinity, ease: 'easeInOut' }}
        >
          {Array.from({ length: s === 1 ? 4 : 6 }, (_, k) => (
            <Marigold key={k} x={x} y={300 + k * 13} r={6.5} color={MARIGOLD[(k + s) % 3]} />
          ))}
        </motion.g>
      ))}
    </svg>
  );
}
