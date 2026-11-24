import { motion } from 'framer-motion';
import ArtBoard from '../../layout/ArtBoard';
import { mehrabPath } from '../../layout/mehrab';

export const WATERLINE = 660;
/* The pavilion was drawn for a waterline at 600; it is shifted down to sit on the new one. */
const SHIFT = WATERLINE - 600;
const STONE = '#3B2444';
const STONE_DARK = '#2A1A33';
const RIM = '#F2A65A';

function Tower({ cx, baseY, hw, h }) {
  const top = baseY - h;
  const d = `M${cx - hw} ${baseY} C${cx - hw} ${baseY - h * 0.55} ${cx - hw * 0.55} ${baseY - h * 0.95} ${cx - hw * 0.34} ${top} L${cx + hw * 0.34} ${top} C${cx + hw * 0.55} ${baseY - h * 0.95} ${cx + hw} ${baseY - h * 0.55} ${cx + hw} ${baseY} Z`;
  // Upright and reflected copies share identical clip definitions, so a shared id is safe.
  const clipId = `pv-tower-${cx}`;
  return (
    <g>
      <clipPath id={clipId}>
        <path d={d} />
      </clipPath>
      <path d={d} fill="url(#pv-stone)" />
      <g clipPath={`url(#${clipId})`}>
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={cx - hw} y={baseY - ((i + 1) * h) / 7} width={hw * 2} height="2" fill={STONE_DARK} opacity="0.6" />
        ))}
      </g>
      <path d={d} fill="none" stroke={RIM} strokeOpacity="0.35" strokeWidth="2" />
      <ellipse cx={cx} cy={top - 6} rx={hw * 0.45} ry="7" fill={STONE} />
      <ellipse cx={cx} cy={top - 20} rx="7" ry="9" fill="#E3B04B" />
      <line x1={cx} y1={top - 28} x2={cx} y2={top - 70} stroke="#C9A13A" strokeWidth="2" />
      <path d={`M${cx} ${top - 70} l30 7 l-20 6 l20 7 l-30 6 z`} fill="#E67E22" />
    </g>
  );
}

function Chhatri({ cx, baseY, w }) {
  const top = baseY - w * 0.85;
  return (
    <g>
      {[-0.38, 0, 0.38].map((k) => (
        <rect key={k} x={cx + k * w - 3} y={top} width="6" height={baseY - top} fill={STONE} />
      ))}
      <rect x={cx - w / 2 - 4} y={top - 6} width={w + 8} height="6" fill={STONE_DARK} />
      <path d={`M${cx - w / 2} ${top - 6} Q${cx} ${top - w * 0.95} ${cx + w / 2} ${top - 6} Z`} fill="url(#pv-stone)" />
      <circle cx={cx} cy={top - w * 0.55} r="4" fill="#E3B04B" />
      <rect x={cx - w / 2 + 3} y={top} width={w - 6} height={baseY - top} fill="url(#pv-glow)" opacity="0.55" />
    </g>
  );
}

/** The lit pavilion, drawn once upright and once mirrored as its reflection. */
function Pavilion({ twinkle }) {
  const openings = [560, 640, 720, 800, 880];
  const lights = [];
  for (let x = 508; x <= 932; x += 14) lights.push([x, 418]);
  for (let x = 330; x <= 1110; x += 18) lights.push([x, 558]);

  return (
    <g transform={`translate(0 ${SHIFT})`}>
      {/* Side shrines */}
      {[400, 1040].map((cx) => (
        <g key={cx}>
          <rect x={cx - 46} y="500" width="92" height="60" fill={STONE} />
          <path d={mehrabPath(34, 50, { x: cx - 17, y: 508, lobes: 3 })} fill="url(#pv-glow)" />
          <Tower cx={cx} baseY={500} hw={40} h={96} />
        </g>
      ))}

      {/* Main pavilion */}
      <rect x="520" y="430" width="400" height="92" fill={STONE} />
      {openings.map((cx) => (
        <path key={cx} d={mehrabPath(56, 84, { x: cx - 28, y: 436, lobes: 3 })} fill="url(#pv-glow)" />
      ))}
      <rect x="500" y="418" width="440" height="14" fill={STONE_DARK} />
      <path d="M490 432 L500 418 H940 L950 432 Z" fill={STONE} />
      <Chhatri cx={556} baseY={418} w={50} />
      <Chhatri cx={884} baseY={418} w={50} />
      <Tower cx={720} baseY={418} hw={74} h={140} />

      {/* Plinth & ghat steps down to the water */}
      <rect x="500" y="522" width="440" height="16" fill={STONE_DARK} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={320 - i * 12} y={540 + i * 15} width={800 + i * 24} height="15" fill={i % 2 ? '#4A2E52' : '#55355D'} />
      ))}

      {/* Fairy lights along cornice and ghat */}
      {lights.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2.2"
          fill="#FFE29A"
          className={twinkle ? 'animate-twinkle' : undefined}
          style={{ animationDuration: `${2 + (i % 5) * 0.6}s`, animationDelay: `${(i % 7) * 0.3}s` }}
        />
      ))}
    </g>
  );
}

/** Placeholder: temple pavilion on a ghat, lit at dusk, mirrored in a still lotus pond. */
export default function PavilionPondArt({ animate = true }) {
  return (
    <ArtBoard>
      <defs>
        <linearGradient id="pv-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#56355F" />
          <stop offset="1" stopColor={STONE} />
        </linearGradient>
        <linearGradient id="pv-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF0C2" />
          <stop offset="0.6" stopColor="#FFC46B" />
          <stop offset="1" stopColor="#E9853F" />
        </linearGradient>
        <linearGradient id="pond" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3D2D5A" />
          <stop offset="1" stopColor="#151027" />
        </linearGradient>
        <linearGradient id="reflect-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="reflect-mask">
          <rect x="0" y={WATERLINE} width="1440" height="360" fill="url(#reflect-fade)" />
        </mask>
        <radialGradient id="light-column" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFC46B" stopOpacity="0.45" />
          <stop offset="1" stopColor="#FFC46B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Far tree line on both banks */}
      <g transform={`translate(0 ${SHIFT})`}>
      <path
        d="M0 600 V540 q20 -26 40 -6 q18 -30 44 -10 q22 -22 40 4 q26 -26 50 0 q14 -18 34 2 q24 -14 42 8 q16 -10 30 10 V600 Z"
        fill="#1E1630"
      />
      <path
        d="M1440 600 V536 q-22 -28 -44 -6 q-18 -30 -44 -8 q-20 -24 -40 4 q-24 -24 -50 2 q-16 -18 -34 2 q-22 -14 -42 8 q-16 -10 -30 10 V600 Z"
        fill="#1E1630"
      />
      </g>

      {/* Pond */}
      <rect x="0" y={WATERLINE} width="1440" height={900 - WATERLINE} fill="url(#pond)" />

      {/* Reflection: mirrored about the waterline, fading with depth */}
      <g mask="url(#reflect-mask)">
        <g transform={`translate(0 ${WATERLINE * 2}) scale(1 -1)`}>
          <Pavilion twinkle={false} />
        </g>
      </g>
      <ellipse cx="720" cy={WATERLINE + 90} rx="220" ry="110" fill="url(#light-column)" />

      {/* Shimmer lines across the water */}
      <motion.g
        animate={animate ? { x: [0, 14, 0] } : undefined}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        stroke="#FFD9A0"
        strokeLinecap="round"
        opacity="0.35"
      >
        {Array.from({ length: 18 }, (_, i) => {
          const y = WATERLINE + 14 + i * 13;
          const w = 30 + ((i * 37) % 70);
          const x = 600 + ((i * 53) % 240) - w / 2;
          return <line key={i} x1={x} y1={y} x2={x + w} y2={y} strokeWidth={1 + (i % 3) * 0.5} />;
        })}
      </motion.g>

      <Pavilion twinkle={animate} />
      <rect x="0" y={WATERLINE - 1} width="1440" height="2" fill="#F0985C" opacity="0.35" />
    </ArtBoard>
  );
}
