import { useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { useElementSize } from '../../hooks/useElementSize';
import { mehrabPath } from '../layout/mehrab';
import { ARCH_BOX, ARCH_OPTS, archMaskUrl, floralTileUrl } from './floralWall';
import Diya from '../hero/art/Diya';
import Ornament from '../ui/Ornament';
import { artwork } from '../../config/artwork';
import { useAmbient } from '../../hooks/useAmbient';

const MARIGOLD = ['#E67E22', '#F4B400', '#F39C12'];

/** Mandap pillar wrapped in a spiral of marigolds and roses, with a gold kalash on top. */
function FloralPillar({ x }) {
  const top = 24;
  const bottom = 300;
  const rings = 16;
  return (
    <g>
      <rect x={x - 9} y={top} width="18" height={bottom - top} fill="#FBF3E2" stroke="#D4AF37" strokeWidth="1" />
      {Array.from({ length: rings }, (_, i) => {
        const y = top + 14 + i * ((bottom - top - 20) / rings);
        return (
          <g key={i}>
            <circle cx={x - 6 + (i % 2) * 12} cy={y} r="4.6" fill={i % 3 === 0 ? '#A93226' : MARIGOLD[i % 3]} />
            <circle cx={x + 6 - (i % 2) * 12} cy={y + 6} r="2.4" fill="#FBF6EA" />
          </g>
        );
      })}
      <rect x={x - 13} y={top - 6} width="26" height="7" fill="#D4AF37" />
      <ellipse cx={x} cy={top - 13} rx="8" ry="7" fill="#D4AF37" />
      <path d={`M${x - 2} ${top - 19} L${x} ${top - 30} L${x + 2} ${top - 19} Z`} fill="#D4AF37" />
    </g>
  );
}

/** Hanging jasmine (mogra) string: small white buds with a crimson rose at the end. */
function JasmineStrand({ x, top, n }) {
  return (
    <g>
      <line x1={x} y1={top - 8} x2={x} y2={top + n * 5} stroke="#7A9445" strokeWidth="0.5" />
      {Array.from({ length: n }, (_, k) => (
        <ellipse key={k} cx={x + (k % 2 ? 0.8 : -0.8)} cy={top + k * 5} rx="2.1" ry="2.6" fill="#FFFDF5" stroke="#E9E1CF" strokeWidth="0.4" />
      ))}
      <circle cx={x} cy={top + n * 5 + 2} r="3" fill="#A93226" />
    </g>
  );
}

/** Gold mehrab outline with marigold and jasmine strings hanging inside the opening. viewBox 200 × 300. */
function ArchTrim({ animate }) {
  const d = mehrabPath(ARCH_BOX.w, ARCH_BOX.h, ARCH_OPTS);
  const outer = mehrabPath(ARCH_BOX.w + 16, ARCH_BOX.h + 8, { ...ARCH_OPTS, x: -8, y: -8 });
  // [x, length, kind]: marigold strings alternate with jasmine
  const strands = [
    [28, 7, 'j'], [44, 9, 'm'], [64, 13, 'j'], [82, 8, 'm'], [100, 16, 'j'],
    [118, 8, 'm'], [136, 13, 'j'], [156, 9, 'm'], [172, 7, 'j'],
  ];
  return (
    <svg viewBox={`0 0 ${ARCH_BOX.w} ${ARCH_BOX.h}`} className="h-full w-full overflow-visible" aria-hidden="true">
      <FloralPillar x={-24} />
      <FloralPillar x={224} />
      <path d={outer} fill="none" stroke="#F6E6A6" strokeWidth="1.2" opacity="0.9" />
      <path d={d} fill="none" stroke="#D4AF37" strokeWidth="3" />
      <path d={d} fill="none" stroke="#FFF3C4" strokeWidth="0.8" />
      {strands.map(([x, n, kind], s) => {
        const top = 30 - Math.abs(100 - x) * 0.2 + Math.abs(100 - x) ** 2 * 0.004;
        return (
          <motion.g
            key={x}
            style={{ originX: 0.5, originY: 0 }}
            animate={animate ? { rotate: [-2, 2, -2] } : undefined}
            transition={{ duration: 3.4 + s * 0.35, repeat: Infinity, ease: 'easeInOut' }}
          >
            {kind === 'j' ? (
              <JasmineStrand x={x} top={top} n={n} />
            ) : (
              <>
                <line x1={x} y1={top - 8} x2={x} y2={top + n * 7} stroke="#7A9445" strokeWidth="0.6" />
                {Array.from({ length: n }, (_, k) => (
                  <circle key={k} cx={x} cy={top + k * 7} r="3.4" fill={MARIGOLD[(k + s) % 3]} />
                ))}
                <circle cx={x} cy={top + n * 7} r="2.6" fill="#A93226" />
              </>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}

/**
 * Scene 3 — passing through a floral mandap archway.
 *
 * A wall of flowers with a scalloped mehrab opening rises into view; once
 * pinned, scrolling zooms through the opening into the warm cream
 * "Meet the Couples" chapter waiting behind it. As the wall clears, the
 * heading rises and the twins' story fades in beneath it, so the chapter
 * opener is a full screen rather than a lone title over empty cream.
 */
export default function MandapPassage({ eyebrow, title, story, storyBy }) {
  const ref = useRef(null);
  const storyRef = useRef(null);
  const animate = useAmbient(ref);
  const { height: storyHeight } = useElementSize(storyRef);
  const storyH = useMotionValue(0);
  useEffect(() => storyH.set(storyHeight), [storyH, storyHeight]);

  const tile = useMemo(() => (artwork.floralWall ? `url("${artwork.floralWall}")` : floralTileUrl()), []);
  const mask = useMemo(() => archMaskUrl(), []);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const wallScale = useTransform(p, [0, 0.8], [1, 7]);
  const wallOpacity = useTransform(p, [0.55, 0.8], [1, 0]);
  const headScale = useTransform(p, [0, 0.7], [0.72, 1]);
  const headY = useTransform(p, [0, 0.7], ['6svh', '0svh']);
  // Lift the heading by half the story's height so heading + story sit centred together
  const groupY = useTransform([p, storyH], ([v, h]) => {
    const k = Math.min(1, Math.max(0, (v - 0.55) / 0.3));
    return -(h / 2) * k * k * (3 - 2 * k);
  });
  const storyOpacity = useTransform(p, [0.62, 0.86], [0, 1]);
  const storyY = useTransform(p, [0.62, 0.86], [24, 0]);

  const holeSize = {
    '--aw': 'min(70vw, 42svh, 400px)',
  };
  const maskLayers = `${mask} center / calc(var(--aw) * 1.2) calc(var(--aw) * 1.74) no-repeat, linear-gradient(#000 0 0)`;

  return (
    <section ref={ref} className="cv-auto relative h-[165svh] bg-ivory-deep sm:h-[240svh]" aria-label={title}>
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-ivory-deep" style={holeSize}>
        {/* Cream chapter waiting beyond the arch */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#FFF8EA_0%,#F6EBDA_60%)]" aria-hidden="true" />
        <motion.div style={{ y: groupY }} className="relative z-0 flex flex-col items-center px-6 text-center">
          <motion.div style={{ scale: headScale, y: headY }} className="flex flex-col items-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-saffron-dark sm:text-[13px]">{eyebrow}</p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,7vw,4.6rem)] font-semibold leading-none text-crimson">{title}</h2>
            <Ornament className="mt-5 h-3 w-56" />
          </motion.div>

          {story && (
            <motion.blockquote
              ref={storyRef}
              style={{ opacity: storyOpacity, y: storyY, x: '-50%' }}
              className="absolute left-1/2 top-full w-[min(40rem,88vw)] pt-[3svh] text-center"
            >
              <span className="block font-display text-5xl leading-none text-gold" aria-hidden="true">
                “
              </span>
              <p className="-mt-3 font-display text-[clamp(1.1rem,min(2.5vw,2.7svh),1.6rem)] italic leading-relaxed text-charcoal">{story}</p>
              {storyBy && (
                <footer className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.24em] text-saffron-dark">{storyBy}</footer>
              )}
            </motion.blockquote>
          )}
        </motion.div>

        {/* Flower wall with the arch cut out, zooming past the viewer */}
        <motion.div
          className="absolute inset-0 z-10 will-change-transform"
          style={{ scale: wallScale, opacity: wallOpacity }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              // Vignette over the flower tile so the wall reads as depth, not wallpaper
              backgroundImage: `radial-gradient(ellipse at center, rgba(44,34,30,0) 25%, rgba(44,34,30,0.38) 100%), ${tile}`,
              backgroundSize: '100% 100%, 120px 120px',
              backgroundPosition: 'center, center',
              WebkitMask: maskLayers,
              WebkitMaskComposite: 'xor',
              mask: maskLayers,
              maskComposite: 'exclude',
            }}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: 'var(--aw)', height: 'calc(var(--aw) * 1.5)' }}>
            <ArchTrim key={`ArchTrim-1-${animate}`} animate={animate} />
            <Diya key={`Diya-2-${animate}`} className="absolute bottom-[-3%] left-[-44%] w-[26%]" animate={animate} seed={2} />
            <Diya key={`Diya-3-${animate}`} className="absolute bottom-[-3%] right-[-44%] w-[26%]" animate={animate} seed={5} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
