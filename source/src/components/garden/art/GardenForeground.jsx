import { useMemo } from 'react';
import ArtBoard from '../../layout/ArtBoard';
import { seeded } from '../../layout/random';

const BASE = 900;
const LAWN_TOP = 740;
const VP = { x: 720, y: 640 };
const along = (x0, y) => VP.x + ((x0 - VP.x) * (y - VP.y)) / (LAWN_TOP - VP.y);

const FLOWERS = ['#E67E22', '#F4B400', '#A93226', '#F7F1E3', '#D9467A'];

/** Rounded flowering shrub — unchanged, used for the central path beds. */
function Shrub({ x, y, r, seed }) {
  const parts = useMemo(() => {
    const rand = seeded(seed);
    const blobs = Array.from({ length: 9 }, () => {
      const a = Math.PI + rand() * Math.PI;
      const d = rand() * r * 0.7;
      return { cx: x + Math.cos(a) * d, cy: y + Math.sin(a) * d * 0.7, rr: r * (0.35 + rand() * 0.25) };
    });
    const blooms = Array.from({ length: Math.round(r / 3) }, () => {
      const a = Math.PI + rand() * Math.PI;
      const d = rand() * r * 0.95;
      return {
        cx: x + Math.cos(a) * d,
        cy: y + Math.sin(a) * d * 0.75,
        rr: 3 + rand() * 3,
        fill: FLOWERS[Math.floor(rand() * FLOWERS.length)],
      };
    });
    return { blobs, blooms };
  }, [x, y, r, seed]);
  return (
    <g>
      {parts.blobs.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.rr} fill={i % 2 ? '#4C7A34' : '#3D6A2B'} />
      ))}
      {parts.blooms.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.rr} fill={b.fill} />
      ))}
    </g>
  );
}

/**
 * Royal ceremonial tree — replaces the plain cypress.
 * Features: layered oval canopy in rich jewel greens, ornate gold urn at the
 * base, marigold garland twisting up the trunk, and twinkling golden lights
 * scattered through the foliage.
 */
function RoyalTree({ x, h, w = 80 }) {
  const trunkTop = BASE - h * 0.36;
  const foliageTop = BASE - h;
  const fHeight = trunkTop - foliageTop; // positive: how tall the canopy is

  /* Five foliage tiers — widest and darkest at bottom, narrowest and lightest at crown. */
  const tiers = [
    { yFrac: 0.86, rxF: 0.92, ryF: 0.28, fill: '#154D13' },
    { yFrac: 0.63, rxF: 0.76, ryF: 0.29, fill: '#1A6618' },
    { yFrac: 0.42, rxF: 0.60, ryF: 0.29, fill: '#20801C' },
    { yFrac: 0.22, rxF: 0.44, ryF: 0.26, fill: '#279820' },
    { yFrac: 0.07, rxF: 0.28, ryF: 0.20, fill: '#30B028' },
  ];

  /* Golden string-light positions scattered across the canopy. */
  const lights = [
    [-0.42, 0.78], [0.38, 0.82], [-0.22, 0.60], [0.54, 0.65],
    [-0.56, 0.48], [0.22, 0.46], [-0.32, 0.32], [0.44, 0.34],
    [-0.10, 0.18], [0.16, 0.20], [0.62, 0.72], [-0.60, 0.70],
    [0.00, 0.09], [-0.42, 0.38], [0.30, 0.56], [-0.18, 0.84],
  ].map(([ox, yFrac]) => ({
    cx: x + ox * w,
    cy: trunkTop + (foliageTop - trunkTop) * yFrac,
  }));

  /* Marigold garland dot positions along the trunk. */
  const garlandPts = Array.from({ length: 8 }, (_, i) => {
    const t = i / 7;
    return {
      gx: x + Math.sin(t * Math.PI * 1.6) * 9,
      gy: (BASE - 30) - t * ((BASE - 30) - trunkTop),
    };
  });

  return (
    <g>
      {/* ── Ornate gold urn at the base ─────────────────────────── */}
      {/* Urn body */}
      <path
        d={`M${x - 22},${BASE - 24} Q${x - 26},${BASE - 8} ${x - 17},${BASE - 2} L${x + 17},${BASE - 2} Q${x + 26},${BASE - 8} ${x + 22},${BASE - 24}`}
        fill="#B8922C"
      />
      {/* Urn top rim */}
      <ellipse cx={x} cy={BASE - 24} rx={22} ry={8} fill="#C9A848" />
      {/* Urn rim highlight */}
      <path
        d={`M${x - 22},${BASE - 24} Q${x},${BASE - 34} ${x + 22},${BASE - 24}`}
        fill="none" stroke="#E8D060" strokeWidth="1.8"
      />
      {/* Urn decorative band */}
      <path
        d={`M${x - 20},${BASE - 16} Q${x},${BASE - 20} ${x + 20},${BASE - 16}`}
        fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeOpacity="0.7"
      />
      {/* Urn base */}
      <ellipse cx={x} cy={BASE - 2} rx={17} ry={5} fill="#9A7620" />

      {/* ── Trunk ───────────────────────────────────────────────── */}
      <path
        d={`M${x - 8},${BASE - 28}
            C${x - 10},${(BASE - 28 + trunkTop) / 2 + 15} ${x - 7},${trunkTop + 18} ${x - 5},${trunkTop}
            L${x + 5},${trunkTop}
            C${x + 7},${trunkTop + 18} ${x + 10},${(BASE - 28 + trunkTop) / 2 + 15} ${x + 8},${BASE - 28}
            Z`}
        fill="url(#gf-trunk)"
      />
      {/* Trunk highlight streak */}
      <path
        d={`M${x - 2},${BASE - 30} C${x - 3},${(BASE - 30 + trunkTop) / 2} ${x - 2},${trunkTop + 10} ${x - 1},${trunkTop}`}
        fill="none" stroke="#8B6020" strokeWidth="2" opacity="0.5"
      />

      {/* ── Layered foliage canopy ───────────────────────────────── */}
      {tiers.map((tier, i) => (
        <ellipse
          key={i}
          cx={x}
          cy={trunkTop + (foliageTop - trunkTop) * tier.yFrac}
          rx={w * tier.rxF}
          ry={fHeight * tier.ryF}
          fill={tier.fill}
        />
      ))}

      {/* Canopy highlight (sunlit side, upper-left) */}
      <ellipse
        cx={x - w * 0.14}
        cy={trunkTop + (foliageTop - trunkTop) * 0.28}
        rx={w * 0.19}
        ry={fHeight * 0.09}
        fill="#42C036"
        fillOpacity="0.40"
      />

      {/* ── Twinkling golden lights ──────────────────────────────── */}
      {lights.map((l, i) => (
        <circle key={i} cx={l.cx} cy={l.cy} r={3.2} fill="#FFD700">
          <animate
            attributeName="fillOpacity"
            values={`${0.45 + (i % 3) * 0.18};1;${0.45 + (i % 3) * 0.18}`}
            dur={`${2.2 + (i % 5) * 0.6}s`}
            begin={`${(i % 7) * 0.35}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* ── Marigold garland twisting up the trunk ───────────────── */}
      <path
        d={`M${x - 6},${BASE - 28}
            C${x + 12},${BASE - 80} ${x - 12},${BASE - 140} ${x + 6},${trunkTop}`}
        fill="none" stroke="#E67E22" strokeWidth="3" strokeLinecap="round" opacity="0.80"
      />
      {garlandPts.map((p, i) => (
        <circle key={i} cx={p.gx} cy={p.gy} r={5.5} fill={i % 2 === 0 ? '#F39C12' : '#E07010'} />
      ))}
    </g>
  );
}

/** Foreground: lawn, sandstone path, lotus channel, flower beds and royal trees. */
export default function GardenForeground() {
  const pathPts = (l, r) =>
    `${along(l, LAWN_TOP)},${LAWN_TOP} ${along(r, LAWN_TOP)},${LAWN_TOP} ${along(r, BASE)},${BASE} ${along(l, BASE)},${BASE}`;

  return (
    <ArtBoard overflowVisible>
      <defs>
        <linearGradient id="gf-lawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8DAA5B" />
          <stop offset="1" stopColor="#5D7C38" />
        </linearGradient>
        <linearGradient id="gf-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFD9D6" />
          <stop offset="1" stopColor="#6FA3A8" />
        </linearGradient>
        {/* Trunk gradient — warm brown with a lighter mid-stripe */}
        <linearGradient id="gf-trunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0"   stopColor="#3D1E06" />
          <stop offset="0.3" stopColor="#7A4010" />
          <stop offset="0.6" stopColor="#9A5818" />
          <stop offset="1"   stopColor="#4A2808" />
        </linearGradient>
      </defs>

      {/* Lawn */}
      <rect x="0" y={LAWN_TOP} width="1440" height={BASE - LAWN_TOP} fill="url(#gf-lawn)" />
      <rect x="-200" y={BASE - 1} width="1840" height="260" fill="#5D7C38" />

      {/* Sandstone path with lotus channel */}
      <polygon points={pathPts(640, 800)} fill="#EAD2A8" />
      <polygon points={pathPts(690, 750)} fill="url(#gf-water)" />
      <polygon points={pathPts(686, 754)} fill="none" stroke="#D4AF37" strokeWidth="1.2" />

      {/* Lotus flowers along the channel */}
      {[760, 800, 856].map((y, i) => {
        const s = (y - VP.y) / (BASE - VP.y);
        return (
          <g key={y} transform={`translate(${720 + (i % 2 ? 8 : -8) * s} ${y}) scale(${s})`}>
            <ellipse rx="16" ry="5" fill="#4E8A3A" />
            <path d="M0 -4 q6 -10 0 -20 q-6 10 0 20 Z" fill="#F2B8C6" />
            <path d="M0 -4 q-12 -4 -12 -14 q8 2 12 14 Z" fill="#E98FA6" />
            <path d="M0 -4 q12 -4 12 -14 q-8 2 -12 14 Z" fill="#E98FA6" />
          </g>
        );
      })}

      {/* Flower beds flanking the path */}
      <Shrub x={560} y={812} r={64} seed={2} />
      <Shrub x={880} y={812} r={64} seed={4} />
      <Shrub x={470} y={880} r={96} seed={6} />
      <Shrub x={970} y={880} r={96} seed={8} />

      {/* ── Royal trees framing the edges (replace plain cypresses) ── */}
      <RoyalTree x={90}   h={470} w={92} />
      <RoyalTree x={250}  h={360} w={74} />
      <RoyalTree x={1350} h={470} w={92} />
      <RoyalTree x={1190} h={360} w={74} />

      {/* Flowering shrubs at the outer base of the trees */}
      <Shrub x={150}  y={890} r={130} seed={10} />
      <Shrub x={1290} y={890} r={130} seed={12} />
    </ArtBoard>
  );
}
