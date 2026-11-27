import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useElementSize } from '../../hooks/useElementSize';

/* ── Corner ornament ─────────────────────────────────────────────── */
/* Rotated 0°/90°/180°/270° for each corner; `s` = arm length */
function CornerOrnament({ x, y, rotate, s = 46 }) {
  const gold = '#D4AF37';
  const dark = '#6B1010';
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate})`}>
      {/* L-bracket extending along border */}
      <path d={`M${s},0 L0,0 L0,${s}`} stroke={gold} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Leaf accent along horizontal arm */}
      <ellipse cx={s * 0.38} cy="-3.8" rx="6.5" ry="3.4" fill={gold} fillOpacity="0.55"
               transform={`rotate(-12,${s * 0.38},-3.8)`} />
      {/* Leaf accent along vertical arm */}
      <ellipse cx="-3.8" cy={s * 0.38} rx="3.4" ry="6.5" fill={gold} fillOpacity="0.55"
               transform={`rotate(-12,-3.8,${s * 0.38})`} />
      {/* Central jewel */}
      <circle cx="0" cy="0" r="6.5" fill={gold} />
      <circle cx="0" cy="0" r="3.5" fill={dark} />
      <circle cx="0" cy="0" r="1.4" fill={gold} />
    </g>
  );
}

/* ── Responsive gold border overlay ─────────────────────────────── */
function BorderDecoration({ w, h }) {
  const gold = '#D4AF37';
  const inset = 18;
  if (!w || !h) return null;
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
    >
      {/* Outer rule */}
      <rect x={inset} y={inset} width={w - inset * 2} height={h - inset * 2}
            fill="none" stroke={gold} strokeWidth="1.8" />
      {/* Inner rule */}
      <rect x={inset + 7} y={inset + 7}
            width={w - (inset + 7) * 2} height={h - (inset + 7) * 2}
            fill="none" stroke={gold} strokeWidth="0.8" strokeOpacity="0.55" />

      {/* Corner ornaments */}
      <CornerOrnament x={inset}     y={inset}     rotate={0}   />
      <CornerOrnament x={w - inset} y={inset}     rotate={90}  />
      <CornerOrnament x={w - inset} y={h - inset} rotate={180} />
      <CornerOrnament x={inset}     y={h - inset} rotate={270} />
    </svg>
  );
}

/* ── Tassel ──────────────────────────────────────────────────────── */
function Tassel() {
  return (
    <div className="absolute z-30 flex flex-col items-center" style={{ left: '-0.5rem', top: '100%' }}>
      {/* Gold bead / knot */}
      <div className="h-3 w-3 rounded-full"
           style={{ background: 'radial-gradient(circle at 35% 35%, #FFF5A0, #C9960E 60%, #7A5C12)' }} />
      {/* Thin cord */}
      <div className="w-[2.5px] h-5"
           style={{ background: 'linear-gradient(to bottom, #D4AF37, #A93226)' }} />
      {/* Teardrop head */}
      <div className="h-7 w-5 rounded-b-full"
           style={{ background: 'linear-gradient(160deg, #C0392B 0%, #7B1818 100%)',
                    boxShadow: 'inset 1px 1px 4px rgba(255,255,255,0.15)' }} />
      {/* Fringe threads */}
      <div className="flex gap-[1.5px] mt-[1px]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}
               className="h-9 w-[2px] rounded-b-full"
               style={{
                 background: 'linear-gradient(to bottom, #B03020, #7B1818)',
                 transformOrigin: 'top center',
                 transform: `rotate(${(i - 3.5) * 4}deg)`,
               }} />
        ))}
      </div>
    </div>
  );
}

/* ── Top rod ─────────────────────────────────────────────────────── */
function TopRod() {
  /* Cap common style */
  const capStyle = {
    width: '44px', height: '44px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 32% 32%, #FFF5A0, #C9960E 52%, #6B4D00 88%)',
    boxShadow: '2px 3px 10px rgba(0,0,0,0.55), inset -1px -1px 4px rgba(0,0,0,0.25)',
    flexShrink: 0,
  };
  return (
    <div className="relative flex items-center" style={{ height: '28px', marginLeft: '10px', marginRight: '10px' }}>
      {/* Left cap (tassel attaches here) */}
      <div className="relative z-20" style={capStyle}>
        <Tassel />
      </div>

      {/* Rod body */}
      <div className="flex-1" style={{
        height: '20px',
        background: 'linear-gradient(to bottom, #FFF5A0 0%, #D4AF37 22%, #8B6914 52%, #D4AF37 80%, #FDF5B0 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.45), inset 0 1px 3px rgba(255,255,255,0.3)',
      }} />

      {/* Right cap */}
      <div className="relative z-20" style={capStyle} />
    </div>
  );
}

/**
 * Royal red scroll banner — a hanging scroll with a golden cylindrical rod,
 * decorative gold border with corner ornaments, a tassel and a crimson fabric body.
 * Replaces the ivory ScallopedFrame for the invitation card.
 */
export default function ScrollBanner({ children, contentClassName = '' }) {
  const bodyRef = useRef(null);
  const { width: w, height: h } = useElementSize(bodyRef);
  const inView = useInView(bodyRef, { once: true, amount: 0 });

  return (
    <div
      className="relative mx-auto w-full max-w-[520px] lg:max-w-[560px]"
      style={{ filter: 'drop-shadow(0 28px 60px rgba(80,10,10,0.55))' }}
    >
      {/* Rod fades + drops in just before the scroll unfurls */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <TopRod />
      </motion.div>

      {/* Scroll body — clips open from top to bottom, like a scroll unfurling */}
      <motion.div
        ref={bodyRef}
        className="relative overflow-hidden"
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: inView ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: inView ? 0.2 : 0 }}
        style={{
          marginTop: '-2px',
          background: 'radial-gradient(ellipse at 50% 18%, #C53030 0%, #8B1A1A 48%, #5E0F0F 100%)',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.35)',
        }}
      >
        {/* Rolled-up shadow at top — suggests the scroll comes from under the rod */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 z-10"
             style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)' }} />

        {/* Gold ornamental border + corner decorations */}
        <BorderDecoration w={w} h={h} />

        {/* Content */}
        <div className={`relative z-20 ${contentClassName}`}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
