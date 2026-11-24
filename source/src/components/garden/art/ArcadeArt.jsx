import ArtBoard from '../../layout/ArtBoard';
import { useMemo } from 'react';
import { mehrabPath } from '../../layout/mehrab';
import { seeded } from '../../layout/random';

const WALL_TOP = 250;
const WALL_BOTTOM = 760;
const ARCH_W = 196;
const ARCH_H = 380;
const ARCH_TOP = 318;
const CENTRES = [160, 440, 720, 1000, 1280];
const MARIGOLD = ['#E67E22', '#F4B400', '#F39C12'];

/** Marigold swag between two points, sagging by `sag`. */
function Swag({ x1, x2, y, sag = 34, r = 6 }) {
  const n = Math.max(8, Math.round((x2 - x1) / 13));
  return (
    <g>
      {Array.from({ length: n + 1 }, (_, k) => {
        const t = k / n;
        return (
          <circle
            key={k}
            cx={x1 + (x2 - x1) * t}
            cy={y + Math.sin(t * Math.PI) * sag}
            r={r}
            fill={MARIGOLD[k % 3]}
            stroke="#B85F12"
            strokeOpacity="0.25"
          />
        );
      })}
    </g>
  );
}

const BRACTS = ['#C2185B', '#D63384', '#E0559A', '#B0124F', '#F06BA8'];

/** Bougainvillea spilling over the parapet and trailing down a pilaster. */
function Bougainvillea({ x, seed, length = 230, spread = 70 }) {
  const parts = useMemo(() => {
    const rand = seeded(seed);
    const items = [];
    for (let i = 0; i < 120; i += 1) {
      const t = rand() ** 0.75; // denser near the top
      const y = WALL_TOP - 6 + t * length;
      const w = spread * (1 - t * 0.75);
      const cx = x + (rand() * 2 - 1) * w + Math.sin(t * 6 + seed) * 10;
      if (rand() < 0.35) {
        items.push({ kind: 'leaf', cx, cy: y, rot: rand() * 360, s: 0.8 + rand() * 0.6 });
      } else {
        items.push({ kind: 'bract', cx, cy: y, r: 3 + rand() * 3.4, fill: BRACTS[Math.floor(rand() * BRACTS.length)] });
      }
    }
    return items;
  }, [x, seed, length, spread]);
  return (
    <g>
      <path d={`M${x} ${WALL_TOP - 4} C${x + 14} ${WALL_TOP + length * 0.4} ${x - 12} ${WALL_TOP + length * 0.7} ${x + 4} ${WALL_TOP + length}`} stroke="#5A3B22" strokeWidth="2" fill="none" />
      {parts.map((p, i) =>
        p.kind === 'leaf' ? (
          <ellipse key={i} cx={p.cx} cy={p.cy} rx={5 * p.s} ry={2.6 * p.s} fill={i % 2 ? '#4C7A34' : '#3D6A2B'} transform={`rotate(${p.rot} ${p.cx} ${p.cy})`} />
        ) : (
          <path
            key={i}
            d={`M${p.cx} ${p.cy - p.r} L${p.cx + p.r * 0.9} ${p.cy + p.r * 0.6} L${p.cx - p.r * 0.9} ${p.cy + p.r * 0.6} Z`}
            fill={p.fill}
            strokeLinejoin="round"
            stroke={p.fill}
            strokeWidth={p.r * 0.5}
          />
        ),
      )}
    </g>
  );
}

/**
 * Placeholder: a sandstone garden pavilion wall — a row of scalloped mehrab
 * archways with jaali screens, kangura parapet, marigold swags and
 * bougainvillea spilling over the walls.
 */
export default function ArcadeArt() {
  const arch = (cx) => mehrabPath(ARCH_W, ARCH_H, { x: cx - ARCH_W / 2, y: ARCH_TOP, lobes: 4 });
  const archOuter = (cx) =>
    mehrabPath(ARCH_W + 28, ARCH_H + 20, { x: cx - ARCH_W / 2 - 14, y: ARCH_TOP - 20, lobes: 4 });

  return (
    <ArtBoard>
      <defs>
        <linearGradient id="arc-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E7CC" />
          <stop offset="1" stopColor="#E8CFA6" />
        </linearGradient>
        <linearGradient id="arc-void" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2C48E" />
          <stop offset="0.6" stopColor="#F8DDB4" />
          <stop offset="1" stopColor="#E9C590" />
        </linearGradient>
        <pattern id="jaali" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="none" stroke="#D9B98A" strokeWidth="2" />
          <circle cx="8" cy="8" r="1.6" fill="#D9B98A" />
        </pattern>
      </defs>

      {/* Wall */}
      <rect x="0" y={WALL_TOP} width="1440" height={WALL_BOTTOM - WALL_TOP} fill="url(#arc-wall)" />

      {/* Parapet with kangura merlons */}
      <rect x="0" y={WALL_TOP - 4} width="1440" height="22" fill="#E2C493" />
      <rect x="0" y={WALL_TOP + 16} width="1440" height="3" fill="#A93226" opacity="0.55" />
      <rect x="0" y={WALL_TOP + 20} width="1440" height="2" fill="#D4AF37" />
      {Array.from({ length: 52 }, (_, i) => (
        <path key={i} d={`M${i * 28} ${WALL_TOP - 4} q14 -22 28 0 Z`} fill="#EBD3A8" />
      ))}

      {/* Arches */}
      {CENTRES.map((cx) => (
        <g key={cx}>
          {/* raised frame + spandrel medallions */}
          <path d={archOuter(cx)} fill="#EFD9B2" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx={cx - 98} cy={ARCH_TOP + 18} r="9" fill="none" stroke="#C8A15E" strokeWidth="1.5" />
          <circle cx={cx + 98} cy={ARCH_TOP + 18} r="9" fill="none" stroke="#C8A15E" strokeWidth="1.5" />
          <circle cx={cx - 98} cy={ARCH_TOP + 18} r="3" fill="#A93226" opacity="0.7" />
          <circle cx={cx + 98} cy={ARCH_TOP + 18} r="3" fill="#A93226" opacity="0.7" />
          {/* opening with jaali screen in its crown */}
          <path d={arch(cx)} fill="url(#arc-void)" />
          <clipPath id={`arch-clip-${cx}`}>
            <path d={arch(cx)} />
          </clipPath>
          <g clipPath={`url(#arch-clip-${cx})`}>
            <rect x={cx - ARCH_W / 2} y={ARCH_TOP} width={ARCH_W} height={ARCH_H * 0.34} fill="url(#jaali)" opacity="0.85" />
            <rect x={cx - ARCH_W / 2} y={ARCH_TOP + ARCH_H * 0.34} width={ARCH_W} height="4" fill="#D9B98A" />
          </g>
          <path d={arch(cx)} fill="none" stroke="#D4AF37" strokeWidth="2.5" />
          {/* pilaster capitals */}
          <rect x={cx - ARCH_W / 2 - 16} y={ARCH_TOP + ARCH_H * 0.36 - 4} width="18" height="8" fill="#C8A15E" />
          <rect x={cx + ARCH_W / 2 - 2} y={ARCH_TOP + ARCH_H * 0.36 - 4} width="18" height="8" fill="#C8A15E" />
        </g>
      ))}

      {/* Marigold swags hung between the arch crowns */}
      {CENTRES.slice(0, -1).map((cx, i) => (
        <Swag key={cx} x1={cx + 20} x2={CENTRES[i + 1] - 20} y={ARCH_TOP - 8} />
      ))}
      <Swag x1={-60} x2={CENTRES[0] - 20} y={ARCH_TOP - 8} />
      <Swag x1={CENTRES[4] + 20} x2={1500} y={ARCH_TOP - 8} />

      {/* Bougainvillea over the parapet, trailing down between the arches */}
      {[20, 300, 580, 860, 1140, 1420].map((x, i) => (
        <Bougainvillea key={x} x={x} seed={50 + i} length={i % 2 ? 250 : 200} spread={i === 0 || i === 5 ? 90 : 64} />
      ))}
      {/* Low blooms along the parapet line */}
      {[160, 440, 720, 1000, 1280].map((x, i) => (
        <Bougainvillea key={`p${x}`} x={x} seed={80 + i} length={34} spread={110} />
      ))}

      {/* Plinth band */}
      <rect x="0" y={WALL_BOTTOM - 22} width="1440" height="22" fill="#DDBF8C" />
      <rect x="0" y={WALL_BOTTOM - 22} width="1440" height="2" fill="#D4AF37" opacity="0.7" />
    </ArtBoard>
  );
}
