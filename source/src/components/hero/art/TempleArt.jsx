import { useId } from 'react';
import { motion } from 'framer-motion';
import ArtBoard from '../../layout/ArtBoard';

/* Palette for the golden-hour temple silhouette */
const STONE_TOP = '#C97A5B';
const STONE_BOTTOM = '#A84A30';
const STONE_DEEP = '#8A3523';
const RIM = '#F5D38C';

/** Saffron double-pennant dhwaja that ripples in the breeze. */
function Flag({ x, y, size = 1, animate, delay = 0 }) {
  const poleH = 46 * size;
  const fw = 38 * size;
  const fh = 30 * size;
  const top = y - poleH;
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={top} stroke="#6B3A1E" strokeWidth={2 * size} strokeLinecap="round" />
      <motion.path
        d={`M${x} ${top} L${x + fw} ${top + fh * 0.24} L${x + fw * 0.34} ${top + fh * 0.5} L${x + fw * 0.92} ${top + fh * 0.78} L${x} ${top + fh} Z`}
        fill="url(#flag-grad)"
        style={{ originX: 0, originY: 0.5 }}
        animate={animate ? { skewY: [0, -7, 3, -4, 0], scaleX: [1, 0.9, 1, 0.94, 1] } : undefined}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay }}
      />
      <circle cx={x} cy={top - 2 * size} r={2.6 * size} fill={RIM} />
    </g>
  );
}

/** Kalash finial: neck, ribbed amalaka disc, pot and point. Returns the top y. */
function Finial({ cx, y, hw }) {
  const aw = hw * 0.52;
  const ah = Math.max(7, hw * 0.13);
  const neckH = ah * 0.7;
  const amalakaY = y - neckH - ah / 2;
  const potY = amalakaY - ah / 2 - ah * 0.9;
  const ribs = 9;
  return (
    <g>
      <rect x={cx - aw * 0.55} y={y - neckH} width={aw * 1.1} height={neckH} fill={STONE_DEEP} />
      <ellipse cx={cx} cy={amalakaY} rx={aw} ry={ah / 2} fill={STONE_TOP} stroke={RIM} strokeWidth="1" strokeOpacity="0.6" />
      {Array.from({ length: ribs }, (_, i) => {
        const rx = cx - aw + ((i + 1) * (2 * aw)) / (ribs + 1);
        return <line key={i} x1={rx} y1={amalakaY - ah / 2 + 1} x2={rx} y2={amalakaY + ah / 2 - 1} stroke={STONE_DEEP} strokeOpacity="0.45" />;
      })}
      <ellipse cx={cx} cy={potY} rx={ah * 0.75} ry={ah * 0.85} fill="url(#gold-grad)" />
      <path d={`M${cx - ah * 0.25} ${potY - ah * 0.7} L${cx} ${potY - ah * 2} L${cx + ah * 0.25} ${potY - ah * 0.7} Z`} fill="url(#gold-grad)" />
    </g>
  );
}

const finialTop = (y, hw) => {
  const ah = Math.max(7, hw * 0.13);
  return y - ah * 0.7 - ah / 2 - ah / 2 - ah * 0.9 - ah * 2;
};

/** Curvilinear Nagara-style shikhara tower with horizontal bhumi bands. */
function Shikhara({ cx, baseY, hw, h, flag, animate, flagDelay }) {
  const clipId = `shikhara-${useId().replace(/:/g, '')}`;
  const topY = baseY - h;
  const d = `M${cx - hw} ${baseY}
    C${cx - hw} ${baseY - h * 0.55} ${cx - hw * 0.55} ${baseY - h * 0.95} ${cx - hw * 0.36} ${topY}
    L${cx + hw * 0.36} ${topY}
    C${cx + hw * 0.55} ${baseY - h * 0.95} ${cx + hw} ${baseY - h * 0.55} ${cx + hw} ${baseY} Z`;
  const bands = Math.max(5, Math.round(h / 26));
  return (
    <g>
      <clipPath id={clipId}>
        <path d={d} />
      </clipPath>
      <path d={d} fill="url(#stone-grad)" />
      <g clipPath={`url(#${clipId})`}>
        {/* Central projecting ratha */}
        <rect x={cx - hw * 0.2} y={topY} width={hw * 0.4} height={h} fill="#FFE2B8" opacity="0.13" />
        <rect x={cx - hw * 0.62} y={topY} width={hw * 0.06} height={h} fill={STONE_DEEP} opacity="0.35" />
        <rect x={cx + hw * 0.56} y={topY} width={hw * 0.06} height={h} fill={STONE_DEEP} opacity="0.35" />
        {Array.from({ length: bands }, (_, i) => {
          const y = baseY - ((i + 1) * h) / (bands + 1);
          return (
            <g key={i}>
              <rect x={cx - hw} y={y} width={hw * 2} height={2.2} fill={STONE_DEEP} opacity="0.42" />
              <rect x={cx - hw} y={y + 2.2} width={hw * 2} height={1} fill={RIM} opacity="0.35" />
            </g>
          );
        })}
        {/* Sun-side rim light */}
        <path d={d} fill="none" stroke={RIM} strokeWidth="3" opacity="0.55" />
      </g>
      <Finial cx={cx} y={topY} hw={hw} />
      {flag && <Flag x={cx} y={finialTop(topY, hw) + 2} size={flag} animate={animate} delay={flagDelay} />}
    </g>
  );
}

/** Stepped pyramidal (phamsana) mandapa roof. */
function TieredRoof({ cx, baseY, width, tiers = 5, tierH = 17 }) {
  return (
    <g>
      {Array.from({ length: tiers }, (_, i) => {
        const w = width - i * (width / (tiers + 1.4));
        const y = baseY - (i + 1) * tierH;
        return (
          <g key={i}>
            <path
              d={`M${cx - w / 2} ${y + tierH} L${cx - w / 2 + 10} ${y} L${cx + w / 2 - 10} ${y} L${cx + w / 2} ${y + tierH} Z`}
              fill="url(#stone-grad)"
            />
            <rect x={cx - w / 2} y={y + tierH - 3} width={w} height="3" fill={STONE_DEEP} opacity="0.5" />
            <rect x={cx - w / 2 + 10} y={y} width={w - 20} height="1.5" fill={RIM} opacity="0.45" />
          </g>
        );
      })}
    </g>
  );
}

function Chhatri({ cx, baseY, w = 56 }) {
  const pillarH = w * 0.9;
  const top = baseY - pillarH;
  return (
    <g>
      <rect x={cx - w / 2} y={top - 6} width={w} height="6" fill={STONE_DEEP} />
      {[-0.4, 0, 0.4].map((k) => (
        <rect key={k} x={cx + k * w - 3} y={top} width="6" height={pillarH} fill="url(#stone-grad)" />
      ))}
      <path d={`M${cx - w / 2 - 4} ${top - 6} Q${cx} ${top - w * 0.95} ${cx + w / 2 + 4} ${top - 6} Z`} fill="url(#stone-grad)" />
      <path d={`M${cx - w / 2 - 4} ${top - 6} Q${cx} ${top - w * 0.95} ${cx + w / 2 + 4} ${top - 6}`} fill="none" stroke={RIM} strokeOpacity="0.5" strokeWidth="1.5" />
      <ellipse cx={cx} cy={top - w * 0.52} rx="4" ry="5" fill="url(#gold-grad)" />
    </g>
  );
}

function Pillar({ x, top, bottom, w = 14 }) {
  return (
    <g>
      <rect x={x - w / 2 - 3} y={top} width={w + 6} height="7" fill={STONE_DEEP} />
      <rect x={x - w / 2} y={top + 7} width={w} height={bottom - top - 14} fill="url(#stone-grad)" />
      <rect x={x - w / 2 + 2} y={top + 7} width="2" height={bottom - top - 14} fill={RIM} opacity="0.35" />
      <rect x={x - w / 2 - 3} y={bottom - 7} width={w + 6} height="7" fill={STONE_DEEP} />
    </g>
  );
}

/**
 * Placeholder: grand Hindu temple silhouette at golden hour.
 * Doorway bottom-centre sits at (720, 640) on the plinth; steps descend to the
 * courtyard horizon at y = 700.
 */
export default function TempleArt({ animate = true }) {
  return (
    <ArtBoard>
      <defs>
        <linearGradient id="stone-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={STONE_TOP} />
          <stop offset="1" stopColor={STONE_BOTTOM} />
        </linearGradient>
        <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E6A6" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#9C7A1E" />
        </linearGradient>
        <linearGradient id="flag-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D9661A" />
          <stop offset="1" stopColor="#F39A3D" />
        </linearGradient>
        <radialGradient id="door-glow" cx="0.5" cy="0.75" r="0.75">
          <stop offset="0" stopColor="#FFF6DA" />
          <stop offset="0.5" stopColor="#FFD98A" />
          <stop offset="1" stopColor="#E9923F" />
        </radialGradient>
        <radialGradient id="door-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE3A3" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFE3A3" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Enclosure (prakara) walls with kangura crenellations */}
      <g>
        <rect x="300" y="596" width="840" height="44" fill="url(#stone-grad)" />
        {Array.from({ length: 30 }, (_, i) => (
          <path key={i} d={`M${304 + i * 28} 596 q10 -14 20 0 Z`} fill="url(#stone-grad)" />
        ))}
        <rect x="300" y="596" width="840" height="2" fill={RIM} opacity="0.4" />
      </g>

      {/* Side shrines */}
      {[440, 1000].map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 62} y="578" width="124" height="62" fill="url(#stone-grad)" />
          <rect x={cx - 14} y="600" width="28" height="40" rx="14" fill={STONE_DEEP} opacity="0.7" />
          <Shikhara cx={cx} baseY={580} hw={56} h={150} flag={0.7} animate={animate} flagDelay={0.6 + i * 0.9} />
        </g>
      ))}

      {/* Main sanctum: flanking urushringas, then main tower */}
      <Shikhara cx={620} baseY={480} hw={62} h={176} />
      <Shikhara cx={820} baseY={480} hw={62} h={176} />
      <rect x="580" y="470" width="280" height="80" fill="url(#stone-grad)" />
      <Shikhara cx={720} baseY={482} hw={124} h={310} flag={1.25} animate={animate} />

      {/* Mandapa roof + corner chhatris */}
      <TieredRoof cx={720} baseY={552} width={400} />
      <Finial cx={720} y={552 - 5 * 17} hw={34} />
      <Chhatri cx={548} baseY={552} />
      <Chhatri cx={892} baseY={552} />

      {/* Mandapa body */}
      <rect x="520" y="546" width="400" height="10" fill={STONE_DEEP} />
      <rect x="530" y="556" width="380" height="84" fill="url(#stone-grad)" />
      {[556, 604, 836, 884].map((x) => (
        <Pillar key={x} x={x} top={556} bottom={640} />
      ))}

      {/* Glowing doorway */}
      <ellipse cx="720" cy="608" rx="110" ry="70" fill="url(#door-halo)" />
      <path d="M680 640 V596 Q680 562 720 560 Q760 562 760 596 V640 Z" fill={STONE_DEEP} />
      <motion.path
        d="M686 640 V598 Q686 568 720 566 Q754 568 754 598 V640 Z"
        fill="url(#door-glow)"
        animate={animate ? { opacity: [0.88, 1, 0.9] } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Tiny marigold toran over the door */}
      {Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        const x = 682 + t * 76;
        const y = 566 + Math.sin(t * Math.PI) * 9;
        return <circle key={i} cx={x} cy={y} r="3.2" fill={i % 2 ? '#F4B400' : '#E67E22'} />;
      })}

      {/* Plinth (jagati) and front steps */}
      <rect x="300" y="640" width="840" height="14" fill={STONE_DEEP} />
      <rect x="300" y="640" width="840" height="2" fill={RIM} opacity="0.5" />
      <rect x="290" y="654" width="860" height="46" fill="url(#stone-grad)" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={668 - i * 10} y={654 + i * 11.5} width={104 + i * 20} height="11.5" fill="#D9997A" />
          <rect x={668 - i * 10} y={654 + i * 11.5} width={104 + i * 20} height="1.5" fill="#FFE7C2" opacity="0.7" />
        </g>
      ))}
    </ArtBoard>
  );
}
