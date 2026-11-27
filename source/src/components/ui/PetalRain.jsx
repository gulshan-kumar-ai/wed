import { useMemo } from 'react';

const PETAL_PATH = 'M5,0 C9,2 10,8 5,16 C0,8 1,2 5,0 Z';
const PETAL_COLORS = ['#E67E22', '#F39C12', '#E05810', '#F4A030', '#CC5500'];
const GOLD = '#D4AF37';

const CSS = `
@keyframes petal-fall {
  0%   { transform: translateY(-90px) translateX(0px) rotate(0deg); opacity: 0; }
  8%   { opacity: 1; }
  50%  { transform: translateY(50vh) translateX(var(--dm)) rotate(var(--sm)); }
  92%  { opacity: 0.55; }
  100% { transform: translateY(112vh) translateX(var(--d)) rotate(var(--s)); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .pf { animation: none !important; opacity: 0 !important; } }
`;

export default function PetalRain() {
  const items = useMemo(() => {
    let seed = 42;
    const r = () => { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed / 0x7fffffff; };

    return Array.from({ length: 24 }, (_, i) => {
      const sparkle = i >= 19;
      const drift = (r() - 0.5) * 200;
      const spin = 200 + r() * 560;
      return {
        id: i,
        sparkle,
        left: r() * 95 + 2.5,
        size: sparkle ? 4 + r() * 3.5 : 9 + r() * 9,
        dur: 9 + r() * 11,
        delay: r() * 18,
        color: sparkle ? GOLD : PETAL_COLORS[Math.floor(r() * PETAL_COLORS.length)],
        d: drift,
        dm: drift * 0.42,
        s: spin,
        sm: spin * 0.42,
      };
    });
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="petal-rain pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" style={{ zIndex: 26 }}>
        {items.map((p) =>
          p.sparkle ? (
            <div
              key={p.id}
              className="pf absolute rounded-full"
              style={{
                left: `${p.left}%`, top: 0,
                width: p.size, height: p.size,
                background: p.color,
                opacity: 0,
                '--d': `${p.d}px`, '--dm': `${p.dm}px`,
                '--s': `${p.s}deg`, '--sm': `${p.sm}deg`,
                animation: `petal-fall ${p.dur}s ${p.delay}s linear infinite`,
                willChange: 'transform, opacity',
              }}
            />
          ) : (
            <svg
              key={p.id}
              className="pf absolute overflow-visible"
              viewBox="0 0 10 16"
              style={{
                left: `${p.left}%`, top: 0,
                width: p.size, height: 'auto',
                opacity: 0,
                '--d': `${p.d}px`, '--dm': `${p.dm}px`,
                '--s': `${p.s}deg`, '--sm': `${p.sm}deg`,
                animation: `petal-fall ${p.dur}s ${p.delay}s linear infinite`,
                willChange: 'transform, opacity',
              }}
            >
              <path d={PETAL_PATH} fill={p.color} />
            </svg>
          )
        )}
      </div>
    </>
  );
}
