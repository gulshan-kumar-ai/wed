import { useMemo } from 'react';
import ArtBoard from '../../layout/ArtBoard';
import { seeded } from '../../layout/random';
import { DiyaDefs, DiyaGlyph } from './Diya';

/* Perspective: every receding line heads to this vanishing point. */
const VP = { x: 720, y: 640 };
const HORIZON = 700;

/** x on the line from the VP through (x0, HORIZON), evaluated at height y. */
const along = (x0, y) => VP.x + ((x0 - VP.x) * (y - VP.y)) / (HORIZON - VP.y);
/** Perspective scale factor at height y (1 at the bottom of the artboard). */
const depth = (y) => (y - VP.y) / (900 - VP.y);

const CARPET_L = 676;
const CARPET_R = 764;

const carpetPoly = (inset = 0) => {
  const l = CARPET_L + inset;
  const r = CARPET_R - inset;
  return `${along(l, HORIZON)},${HORIZON} ${along(r, HORIZON)},${HORIZON} ${along(r, 900)},900 ${along(l, 900)},900`;
};

/** Placeholder: sandstone courtyard with a white marble pathway, petals and rows of brass diyas. */
export default function CourtyardArt({ animate = true }) {
  const petals = useMemo(() => {
    const rand = seeded(11);
    return Array.from({ length: 90 }, () => {
      const y = HORIZON + 6 + rand() ** 1.4 * 194;
      const spread = rand() * 2 - 1;
      const x = along(720 + spread * 70, y);
      const s = depth(y);
      return {
        x,
        y,
        rx: 2 + s * 5,
        ry: 1 + s * 2.6,
        rot: rand() * 180,
        fill: ['#A93226', '#C0392B', '#E67E22', '#F4B400', '#B8322A'][Math.floor(rand() * 5)],
      };
    });
  }, []);

  const diyaRows = [712, 728, 750, 780, 818, 866];

  return (
    <ArtBoard>
      <defs>
        <DiyaDefs />
        <linearGradient id="floor-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0D1A6" />
          <stop offset="1" stopColor="#D9A577" />
        </linearGradient>
        <clipPath id="marble-clip">
          <polygon points={carpetPoly()} />
        </clipPath>
        <linearGradient id="carpet-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3E6D2" />
          <stop offset="0.4" stopColor="#FCF7EE" />
          <stop offset="1" stopColor="#FFFEFA" />
        </linearGradient>
        <clipPath id="floor-clip">
          <rect x="0" y={HORIZON} width="1440" height={900 - HORIZON} />
        </clipPath>
      </defs>

      {/* Sandstone floor with perspective tiling */}
      <rect x="0" y={HORIZON} width="1440" height={900 - HORIZON} fill="url(#floor-grad)" />
      <g clipPath="url(#floor-clip)" stroke="#B9804F" strokeOpacity="0.3" strokeWidth="1.2">
        {Array.from({ length: 23 }, (_, i) => {
          const x0 = 720 + (i - 11) * 56;
          return <line key={`v${i}`} x1={VP.x} y1={VP.y} x2={along(x0, 900)} y2={900} />;
        })}
        {Array.from({ length: 9 }, (_, i) => {
          const y = HORIZON + 200 * ((i + 1) / 9) ** 1.7;
          return <line key={`h${i}`} x1="0" y1={y} x2="1440" y2={y} />;
        })}
      </g>

      {/* White marble pathway: slab joints, soft grey veining, inlaid gold borders */}
      <polygon points={carpetPoly()} fill="url(#carpet-grad)" />
      <g clipPath="url(#marble-clip)">
        {/* Slab joints, closer together towards the horizon */}
        {Array.from({ length: 9 }, (_, i) => {
          const y = HORIZON + 200 * ((i + 1) / 9) ** 1.7;
          return <line key={`j${i}`} x1="0" y1={y} x2="1440" y2={y} stroke="#CFC6B8" strokeWidth={0.6 + depth(y) * 1.2} />;
        })}
        <line x1={VP.x} y1={VP.y} x2={VP.x} y2="900" stroke="#CFC6B8" strokeWidth="1" />
        {/* Veining */}
        <g fill="none" stroke="#B8B0A4" strokeOpacity="0.45" strokeLinecap="round">
          <path d="M640 900 C660 860 700 850 690 810 C684 786 706 770 702 748" strokeWidth="1.4" />
          <path d="M800 900 C780 870 770 840 790 812 C800 796 770 780 760 760" strokeWidth="1.2" />
          <path d="M560 900 C600 880 610 870 640 872" strokeWidth="1" />
          <path d="M870 860 C840 850 830 835 846 820" strokeWidth="0.9" />
          <path d="M700 735 C712 728 716 720 728 716" strokeWidth="0.6" />
        </g>
      </g>
      <polygon points={carpetPoly(7)} fill="none" stroke="#D4AF37" strokeWidth="1.6" />
      <polygon points={carpetPoly(10)} fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.7" />
      {/* Lotus motifs down the centre line */}
      {[716, 738, 768, 808, 860].map((y) => {
        const s = depth(y);
        return (
          <g key={y} transform={`translate(720 ${y}) scale(${s * 1.6} ${s * 0.6})`} fill="#D4AF37" opacity="0.55">
            <path d="M0 -10 Q5 -2 0 6 Q-5 -2 0 -10 Z" />
            <path d="M0 6 Q-11 2 -13 -6 Q-5 -4 0 6 Z" />
            <path d="M0 6 Q11 2 13 -6 Q5 -4 0 6 Z" />
          </g>
        );
      })}

      {/* Scattered rose & marigold petals */}
      {petals.map((p, i) => (
        <ellipse
          key={i}
          cx={p.x}
          cy={p.y}
          rx={p.rx}
          ry={p.ry}
          fill={p.fill}
          opacity="0.85"
          transform={`rotate(${p.rot} ${p.x} ${p.y})`}
        />
      ))}

      {/* Rows of brass diyas lining the carpet */}
      {diyaRows.map((y, i) => {
        const s = depth(y) * 0.95;
        return (
          <g key={y}>
            <DiyaGlyph x={along(CARPET_L - 26, y) - 10 * s} y={y} scale={s} animate={animate} seed={i * 2} />
            <DiyaGlyph x={along(CARPET_R + 26, y) + 10 * s} y={y} scale={s} animate={animate} seed={i * 2 + 1} />
          </g>
        );
      })}

      {/* Soft shadow where the floor meets the plinth */}
      <rect x="0" y={HORIZON} width="1440" height="6" fill="#8A4A2C" opacity="0.12" />
    </ArtBoard>
  );
}
