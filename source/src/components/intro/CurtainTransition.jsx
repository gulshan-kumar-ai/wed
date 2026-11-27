import { motion } from 'framer-motion';
import { OmMedallion } from '../ui/SacredEmblem';

/* Heavy fabric easing — starts fast (the pull of gravity), slows as the curtain
   reaches its resting position off-screen. */
const EASE = [0.76, 0, 0.24, 1];
const DURATION = 1.6;
const DELAY = 0.15; // brief pause so the guest sees the curtain before it parts

/** Repeating vertical stripes that simulate fabric folds on a curtain panel. */
const foldStripes =
  'repeating-linear-gradient(90deg,' +
  'transparent 0px,transparent 20px,' +
  'rgba(0,0,0,0.11) 20px,rgba(0,0,0,0.11) 24px,' +
  'transparent 24px,transparent 46px,' +
  'rgba(0,0,0,0.07) 46px,rgba(0,0,0,0.07) 50px,' +
  'transparent 50px)';

/** Crimson satin-like gradient for one half-panel; `dir` controls which side the
 *  highlight (lighter sheen) falls on — the edge that meets the other curtain. */
const satinGradient = (dir) =>
  dir === 'left'
    ? 'linear-gradient(to right,#3D0808 0%,#7A1515 18%,#A93226 40%,#C0392B 56%,#A93226 72%,#8B1A1A 88%,#5E1010 100%)'
    : 'linear-gradient(to left, #3D0808 0%,#7A1515 18%,#A93226 40%,#C0392B 56%,#A93226 72%,#8B1A1A 88%,#5E1010 100%)';

function Panel({ dir, onDone }) {
  const left = dir === 'left';
  return (
    <motion.div
      className="relative h-full w-1/2 flex-shrink-0 overflow-hidden"
      style={{ background: `${foldStripes}, ${satinGradient(dir)}` }}
      initial={{ x: 0 }}
      animate={{ x: left ? '-100%' : '100%' }}
      transition={{ duration: DURATION, ease: EASE, delay: DELAY }}
      onAnimationComplete={onDone}
    >
      {/* Gold seam at the join edge */}
      <div
        className={`pointer-events-none absolute top-0 h-full w-[3px] bg-gradient-to-b from-gold-dark via-gold-light to-gold-dark ${left ? 'right-0' : 'left-0'}`}
      />
      {/* Subtle inner shadow to give fabric depth */}
      <div
        className={`pointer-events-none absolute inset-y-0 w-16 ${left ? 'left-0 bg-gradient-to-r from-black/20 to-transparent' : 'right-0 bg-gradient-to-l from-black/20 to-transparent'}`}
      />
    </motion.div>
  );
}

/**
 * Royal red curtains that part to reveal the main invitation page.
 * Mounted immediately when the opening gate finishes, then removed once
 * the curtains have slid fully off-screen.
 */
export default function CurtainTransition({ onDone }) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      {/* Pelmet — the decorative top rail the curtains hang from */}
      <div className="absolute inset-x-0 top-0 z-20 h-7 bg-gradient-to-r from-[#2A0D00] via-[#6B4500] to-[#2A0D00]" />
      <div className="absolute inset-x-0 top-7 z-20 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* The two curtain panels */}
      <div className="flex h-full">
        <Panel dir="left" onDone={onDone} />
        <Panel dir="right" />
      </div>

      {/* Om medallion centred at the parting point — fades out as curtains open */}
      <motion.div
        className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2"
        style={{ top: 'clamp(1.25rem, 6vh, 3.5rem)' }}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.5, delay: DELAY + 0.6, ease: 'easeIn' }}
      >
        <OmMedallion className="h-14 w-14 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" />
      </motion.div>
    </div>
  );
}
