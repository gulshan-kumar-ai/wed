import { useId } from 'react';
import { motion } from 'framer-motion';

/** Scalloped hem from (x1, y) to (x2, y), going right → left. */
function hem(x1, x2, y, w = 24) {
  const n = Math.max(2, Math.round((x1 - x2) / w));
  const step = (x1 - x2) / n;
  let d = '';
  for (let i = 1; i <= n; i += 1) d += ` Q${x1 - step * (i - 0.5)} ${y + 16} ${x1 - step * i} ${y}`;
  return d;
}

/**
 * Placeholder: ceremonial elephant, side view facing right, with a crimson
 * and gold jhool (caparison), gold forehead plate and anklets.
 * viewBox 420 × 340; feet rest on y ≈ 328.
 */
export default function Elephant({ className = '', flip = false, animate = true }) {
  const uid = useId().replace(/:/g, '');
  const skin = `el-skin-${uid}`;
  const gold = `el-gold-${uid}`;

  return (
    <svg viewBox="0 0 420 340" className={className} style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
      <defs>
        <linearGradient id={skin} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7C7482" />
          <stop offset="1" stopColor="#4B4452" />
        </linearGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E6A6" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#9C7A1E" />
        </linearGradient>
      </defs>

      {/* Stone ghat platform */}
      <rect x="20" y="326" width="390" height="14" rx="3" fill="#4A2E52" />
      <rect x="20" y="326" width="390" height="2" fill="#F2A65A" opacity="0.35" />

      {/* Far legs */}
      <rect x="146" y="200" width="36" height="126" rx="14" fill="#423B48" />
      <rect x="304" y="200" width="34" height="126" rx="14" fill="#423B48" />

      {/* Tail */}
      <path d="M72 150 C58 176 56 206 62 228" stroke="#4B4452" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M58 226 l4 14 l6 -13 z" fill="#2E2933" />

      {/* Body */}
      <path d="M70 150 C70 96 130 70 212 72 C262 73 302 86 322 112 L332 228 C300 246 122 250 92 236 C72 222 66 192 70 150 Z" fill={`url(#${skin})`} />

      {/* Near legs with gold anklets and bells */}
      {[
        [96, 38],
        [262, 38],
      ].map(([x, w]) => (
        <g key={x}>
          <rect x={x} y="196" width={w} height="132" rx="15" fill={`url(#${skin})`} />
          <rect x={x - 2} y="296" width={w + 4} height="7" rx="3" fill={`url(#${gold})`} />
          {[0.2, 0.5, 0.8].map((k) => (
            <circle key={k} cx={x + w * k} cy="307" r="3" fill="#D4AF37" />
          ))}
          <path d={`M${x + 6} 326 q5 -6 10 0 M${x + 18} 326 q5 -6 10 0`} stroke="#B8AFA8" strokeWidth="2" fill="none" />
        </g>
      ))}

      {/* Jhool: crimson caparison with gold border, mandala and tassels */}
      <path d={`M116 80 C168 64 250 64 304 86 L308 204${hem(308, 116, 204)} Z`} fill="#A93226" />
      <path d={`M116 80 C168 64 250 64 304 86 L308 204${hem(308, 116, 204)} Z`} fill="none" stroke={`url(#${gold})`} strokeWidth="6" />
      <path d="M130 96 C176 84 244 84 292 100 L294 188 H132 Z" fill="none" stroke="#F6E6A6" strokeWidth="1.2" strokeDasharray="3 4" />
      <circle cx="212" cy="140" r="30" fill="none" stroke={`url(#${gold})`} strokeWidth="3" />
      <circle cx="212" cy="140" r="18" fill="#7A1F17" stroke="#F6E6A6" strokeWidth="1.2" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={212 + Math.cos((i / 12) * Math.PI * 2) * 30} cy={140 + Math.sin((i / 12) * Math.PI * 2) * 30} r="3" fill="#F6E6A6" />
      ))}
      <circle cx="212" cy="140" r="6" fill="#E67E22" />
      {Array.from({ length: 8 }, (_, i) => {
        const x = 124 + i * 25;
        return (
          <g key={i}>
            <line x1={x} y1="214" x2={x} y2="226" stroke="#D4AF37" strokeWidth="1.5" />
            <circle cx={x} cy="229" r="3.5" fill="#E67E22" />
          </g>
        );
      })}

      {/* Head */}
      <path d="M300 98 C330 70 382 78 394 122 C402 152 394 186 372 202 L330 210 Z" fill={`url(#${skin})`} />
      {/* Ear with painted dots */}
      <path d="M300 102 C268 102 254 138 262 172 C268 202 292 214 318 206 C326 170 322 126 300 102 Z" fill="#5E5764" />
      {Array.from({ length: 7 }, (_, i) => (
        <circle key={i} cx={268 + i * 6} cy={180 + Math.sin(i) * 6} r="2.2" fill="#F4B400" opacity="0.85" />
      ))}

      {/* Trunk, swaying gently, with painted bands */}
      <motion.g
        style={{ originX: 0.3, originY: 0 }}
        animate={animate ? { rotate: [0, -3, 0, 2, 0] } : undefined}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M368 170 C394 208 398 256 390 292 C388 304 398 310 406 300 L412 306 C400 322 376 318 376 296 C382 258 378 218 352 190 Z" fill={`url(#${skin})`} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${376 + i * 3} ${214 + i * 22} q12 2 18 -4`} stroke="#F4B400" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85" />
        ))}
      </motion.g>

      {/* Tusk */}
      <path d="M368 198 C386 212 402 212 412 202 C404 218 382 220 362 206 Z" fill="#F7F0E1" />

      {/* Gold forehead plate (mukhauta) with jewels and tassel */}
      <path d="M326 84 C346 72 380 80 388 104 L378 162 C372 172 360 172 354 162 Z" fill={`url(#${gold})`} />
      <circle cx="362" cy="104" r="6" fill="#A93226" stroke="#F6E6A6" />
      <circle cx="368" cy="128" r="4.5" fill="#1F7A4D" stroke="#F6E6A6" />
      <circle cx="366" cy="150" r="3.5" fill="#A93226" />
      <line x1="366" y1="166" x2="366" y2="180" stroke="#D4AF37" strokeWidth="1.5" />
      <circle cx="366" cy="184" r="4" fill="#E67E22" />

      {/* Eye */}
      <circle cx="350" cy="126" r="3.6" fill="#1B1720" />
      <path d="M344 120 q6 -4 12 0" stroke="#1B1720" strokeWidth="1.4" fill="none" />

      {/* Rim light from the diyas */}
      <path d="M92 236 C122 250 300 246 332 228" stroke="#F2A65A" strokeOpacity="0.35" strokeWidth="2" fill="none" />
    </svg>
  );
}
