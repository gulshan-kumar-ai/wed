import { motion } from 'framer-motion';

const MARIGOLD = ['#E67E22', '#F4B400', '#F39C12'];

function Bloom({ x, y, r, i }) {
  const c = MARIGOLD[i % 3];
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={c} />
      <circle cx={x} cy={y} r={r * 0.62} fill={c} stroke="#B85F12" strokeOpacity="0.35" strokeWidth={r * 0.14} />
    </g>
  );
}

/**
 * Placeholder: festive toran — mango leaves along a crimson cord with
 * scalloped marigold swags and hanging strands. viewBox 1440 × 180.
 */
export default function Toran({ className = '', animate = true }) {
  const SWAG = 240;
  // Offset so the centre of the screen falls in a swag dip, not on a strand.
  const nodes = Array.from({ length: 8 }, (_, i) => -SWAG / 2 + i * SWAG);

  return (
    <svg viewBox="0 0 1440 180" preserveAspectRatio="xMidYMin slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="leaf-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3F5A24" />
          <stop offset="1" stopColor="#7A9445" />
        </linearGradient>
      </defs>

      {/* Mango leaves */}
      {Array.from({ length: 31 }, (_, i) => {
        const x = i * 48;
        return (
          <path
            key={i}
            d={`M${x} 6 Q${x + 13} 30 ${x} 54 Q${x - 13} 30 ${x} 6 Z`}
            fill="url(#leaf-grad)"
            transform={`rotate(${i % 2 ? 6 : -6} ${x} 6)`}
          />
        );
      })}

      {/* Cord */}
      <rect x="0" y="0" width="1440" height="7" fill="#A93226" />
      <rect x="0" y="6" width="1440" height="2" fill="#D4AF37" />

      {/* Marigold swags */}
      {nodes.slice(0, -1).map((x0) => {
        const n = 16;
        return (
          <g key={x0}>
            {Array.from({ length: n + 1 }, (_, k) => {
              const t = k / n;
              const x = x0 + t * SWAG;
              const y = 12 + Math.sin(t * Math.PI) * 72;
              return <Bloom key={k} x={x} y={y} r={9.5} i={k} />;
            })}
          </g>
        );
      })}

      {/* Hanging strands with brass bells */}
      {nodes.map((x, s) => (
        <motion.g
          key={x}
          style={{ originX: 0.5, originY: 0 }}
          animate={animate ? { rotate: [-2.5, 2.5, -2.5] } : undefined}
          transition={{ duration: 3.6 + (s % 3) * 0.7, repeat: Infinity, ease: 'easeInOut' }}
        >
          {Array.from({ length: 8 }, (_, k) => (
            <Bloom key={k} x={x} y={18 + k * 15} r={8} i={k + s} />
          ))}
          <path d={`M${x - 8} 146 Q${x} 128 ${x + 8} 146 Z`} fill="#D4AF37" />
          <circle cx={x} cy="148" r="2.6" fill="#9C7A1E" />
        </motion.g>
      ))}
    </svg>
  );
}
