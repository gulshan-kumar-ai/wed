import { useMemo } from 'react';
import ArtBoard from '../../layout/ArtBoard';
import { seeded } from '../../layout/random';

const LAWN_TOP = 740;
const VP = { x: 720, y: 640 };
const along = (x0, y) => VP.x + ((x0 - VP.x) * (y - VP.y)) / (LAWN_TOP - VP.y);

const FLOWERS = ['#E67E22', '#F4B400', '#A93226', '#F7F1E3', '#D9467A'];

function Cypress({ x, h, w = 60 }) {
  const base = 900;
  return (
    <g>
      <rect x={x - 5} y={base - 40} width="10" height="40" fill="#5A3B22" />
      <path
        d={`M${x} ${base - h} C${x + w * 0.62} ${base - h * 0.62} ${x + w * 0.55} ${base - 60} ${x} ${base - 30} C${x - w * 0.55} ${base - 60} ${x - w * 0.62} ${base - h * 0.62} ${x} ${base - h} Z`}
        fill="#2F5A2A"
      />
      <path
        d={`M${x} ${base - h + 12} C${x + w * 0.3} ${base - h * 0.6} ${x + w * 0.28} ${base - 80} ${x + 4} ${base - 40}`}
        stroke="#4F7F3A"
        strokeWidth="5"
        fill="none"
        opacity="0.6"
      />
    </g>
  );
}

/** Rounded flowering shrub built from foliage blobs dotted with blooms. */
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

/** Placeholder: lawn with a sandstone path and lotus water channel, flower beds and cypress trees. */
export default function GardenForeground() {
  const pathPts = (l, r) => `${along(l, LAWN_TOP)},${LAWN_TOP} ${along(r, LAWN_TOP)},${LAWN_TOP} ${along(r, 900)},900 ${along(l, 900)},900`;
  return (
    // Draws ~260 units below the artboard so nothing is cut off as the layer drifts up.
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
      </defs>

      <rect x="0" y={LAWN_TOP} width="1440" height={900 - LAWN_TOP} fill="url(#gf-lawn)" />
      <rect x="-200" y="899" width="1840" height="260" fill="#5D7C38" />
      {/* Sandstone path with a central lotus channel */}
      <polygon points={pathPts(640, 800)} fill="#EAD2A8" />
      <polygon points={pathPts(690, 750)} fill="url(#gf-water)" />
      <polygon points={pathPts(686, 754)} fill="none" stroke="#D4AF37" strokeWidth="1.2" />
      {[760, 800, 856].map((y, i) => {
        const s = (y - VP.y) / (900 - VP.y);
        return (
          <g key={y} transform={`translate(${720 + (i % 2 ? 8 : -8) * s} ${y}) scale(${s})`}>
            <ellipse rx="16" ry="5" fill="#4E8A3A" />
            <path d="M0 -4 q6 -10 0 -20 q-6 10 0 20 Z" fill="#F2B8C6" />
            <path d="M0 -4 q-12 -4 -12 -14 q8 2 12 14 Z" fill="#E98FA6" />
            <path d="M0 -4 q12 -4 12 -14 q-8 2 -12 14 Z" fill="#E98FA6" />
          </g>
        );
      })}

      {/* Flower beds hugging the path */}
      <Shrub x={560} y={812} r={64} seed={2} />
      <Shrub x={880} y={812} r={64} seed={4} />
      <Shrub x={470} y={880} r={96} seed={6} />
      <Shrub x={970} y={880} r={96} seed={8} />

      {/* Cypress & shrubs framing the edges */}
      <Cypress x={90} h={470} w={92} />
      <Cypress x={250} h={360} w={74} />
      <Cypress x={1350} h={470} w={92} />
      <Cypress x={1190} h={360} w={74} />
      <Shrub x={150} y={890} r={130} seed={10} />
      <Shrub x={1290} y={890} r={130} seed={12} />
    </ArtBoard>
  );
}
