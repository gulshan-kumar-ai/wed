import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { seeded } from '../../layout/random';

const COLORS = ['#A93226', '#C0392B', '#E67E22', '#F4B400'];

/** Slow drift of rose and marigold petals falling across the scene. */
export default function PetalShower({ count = 16 }) {
  const petals = useMemo(() => {
    const rand = seeded(7);
    return Array.from({ length: count }, () => ({
      left: rand() * 100,
      size: 8 + rand() * 10,
      duration: 12 + rand() * 10,
      delay: rand() * 14,
      sway: 20 + rand() * 50,
      spin: (rand() > 0.5 ? 1 : -1) * (180 + rand() * 360),
      color: COLORS[Math.floor(rand() * COLORS.length)],
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((p, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 20 28"
          className="absolute -top-10"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.4 }}
          initial={{ y: '-10vh', x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: '110vh',
            x: [0, p.sway, -p.sway * 0.6, p.sway * 0.4],
            rotate: p.spin,
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M10 1 C17 6 19 16 10 27 C1 16 3 6 10 1 Z" fill={p.color} />
          <path d="M10 4 C11 12 11 18 10 24" stroke="#000" strokeOpacity="0.12" fill="none" />
        </motion.svg>
      ))}
    </div>
  );
}
