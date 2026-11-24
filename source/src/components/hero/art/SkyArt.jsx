import { motion } from 'framer-motion';
import ArtBoard from '../../layout/ArtBoard';
import { useIsSmallScreen } from '../../../hooks/useMediaQuery';

const SUN = { x: 720, y: 300 };

/** Placeholder: warm misty golden-hour sky with sun, rays, clouds and birds. */
export default function SkyArt({ animate = true }) {
  const drift = animate && !useIsSmallScreen();
  return (
    <ArtBoard>
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EFA877" />
          <stop offset="0.28" stopColor="#F6C590" />
          <stop offset="0.55" stopColor="#FADDB0" />
          <stop offset="0.78" stopColor="#FDEBCD" />
          <stop offset="1" stopColor="#FFF4E2" />
        </linearGradient>
        <radialGradient id="sun-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF9E8" stopOpacity="1" />
          <stop offset="0.18" stopColor="#FFEFC4" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#FBD38D" stopOpacity="0.45" />
          <stop offset="1" stopColor="#F6C590" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ray-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF6D8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFF6D8" stopOpacity="0" />
        </linearGradient>
        <filter id="cloud-blur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      <rect width="1440" height="900" fill="url(#sky-grad)" />

      {/* Slow-turning sun rays */}
      <g opacity="0.22">
        {animate && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${SUN.x} ${SUN.y}`}
            to={`360 ${SUN.x} ${SUN.y}`}
            dur="240s"
            repeatCount="indefinite"
          />
        )}
        {Array.from({ length: 18 }, (_, i) => (
          <path
            key={i}
            d={`M${SUN.x - 9} ${SUN.y} L${SUN.x} ${SUN.y - 760} L${SUN.x + 9} ${SUN.y} Z`}
            fill="url(#ray-grad)"
            transform={`rotate(${i * 20} ${SUN.x} ${SUN.y})`}
          />
        ))}
      </g>

      {/* Sun + halo */}
      <circle cx={SUN.x} cy={SUN.y} r="420" fill="url(#sun-glow)" />
      <circle cx={SUN.x} cy={SUN.y} r="62" fill="#FFF8E6" opacity="0.9" />

      {/* Soft clouds */}
      <g filter="url(#cloud-blur)" fill="#FFF3E0">
        <motion.g
          animate={drift ? { x: [0, 60, 0] } : undefined}
          transition={{ duration: 60, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ellipse cx="220" cy="190" rx="220" ry="28" opacity="0.7" />
          <ellipse cx="330" cy="230" rx="160" ry="20" opacity="0.55" />
          <ellipse cx="1180" cy="160" rx="240" ry="26" opacity="0.65" />
        </motion.g>
        <motion.g
          animate={drift ? { x: [0, -50, 0] } : undefined}
          transition={{ duration: 75, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ellipse cx="1080" cy="250" rx="200" ry="18" opacity="0.6" />
          <ellipse cx="120" cy="330" rx="200" ry="16" opacity="0.5" />
          <ellipse cx="1320" cy="340" rx="180" ry="16" opacity="0.5" />
        </motion.g>
      </g>

      {/* Birds crossing the sky */}
      {animate && (
        <motion.g
          initial={{ x: -160 }}
          animate={{ x: 1640 }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear', delay: 2 }}
          stroke="#7A3B2A"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.45"
        >
          {[
            [0, 140, 1],
            [28, 128, 0.8],
            [52, 150, 0.7],
            [-30, 160, 0.6],
          ].map(([x, y, s], i) => (
            <motion.path
              key={i}
              d={`M${x - 10 * s} ${y} q${5 * s} ${-6 * s} ${10 * s} 0 q${5 * s} ${-6 * s} ${10 * s} 0`}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.6 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </motion.g>
      )}
    </ArtBoard>
  );
}
