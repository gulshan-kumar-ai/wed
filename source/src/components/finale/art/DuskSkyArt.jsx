import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ArtBoard from '../../layout/ArtBoard';
import { seeded } from '../../layout/random';

/** Placeholder: twilight sky with stars, crescent moon and rising sky lanterns. */
export default function DuskSkyArt({ animate = true }) {
  const stars = useMemo(() => {
    const rand = seeded(31);
    return Array.from({ length: 70 }, () => ({
      x: rand() * 1440,
      y: rand() ** 1.6 * 380,
      r: 0.6 + rand() * 1.5,
      d: (2 + rand() * 4).toFixed(1),
      delay: (rand() * 4).toFixed(1),
    }));
  }, []);

  const lanterns = [
    [260, 0], [430, 6], [1010, 3], [1180, 9], [1320, 12],
  ];

  return (
    <ArtBoard>
      <defs>
        <linearGradient id="dusk-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12132E" />
          <stop offset="0.32" stopColor="#2A2350" />
          <stop offset="0.55" stopColor="#5E3462" />
          <stop offset="0.68" stopColor="#B65A5C" />
          <stop offset="0.76" stopColor="#F0985C" />
          <stop offset="1" stopColor="#F7B26E" />
        </linearGradient>
        <radialGradient id="dusk-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFC27A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFC27A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lantern-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD98A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFB04A" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#dusk-sky)" />
      <ellipse cx="720" cy="700" rx="760" ry="200" fill="url(#dusk-glow)" />

      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#FFF6DE"
          className={animate ? 'animate-twinkle' : undefined}
          style={{ animationDuration: `${s.d}s`, animationDelay: `${s.delay}s` }}
        />
      ))}

      {/* Crescent moon */}
      <circle cx="1190" cy="120" r="34" fill="#FFF3D1" />
      <circle cx="1206" cy="110" r="30" fill="#1A1838" />
      <circle cx="1190" cy="120" r="70" fill="#FFF3D1" opacity="0.06" />

      {/* Sky lanterns drifting upward */}
      {lanterns.map(([x, delay], i) => (
        <motion.g
          key={x}
          initial={{ y: 180, opacity: 0 }}
          animate={animate ? { y: [180, -220], opacity: [0, 1, 1, 0] } : { y: -40 + i * 30, opacity: 0.9 }}
          transition={{ duration: 26 + i * 4, delay, repeat: Infinity, ease: 'linear', opacity: { duration: 26 + i * 4, delay, repeat: Infinity, times: [0, 0.12, 0.8, 1] } }}
        >
          <g transform={`translate(${x} 260)`}>
            <circle r="22" fill="url(#lantern-glow)" />
            <path d="M-6 -8 h12 l2 14 h-16 z" fill="#FFB75E" />
            <rect x="-5" y="6" width="10" height="2" fill="#E67E22" />
          </g>
        </motion.g>
      ))}
    </ArtBoard>
  );
}
