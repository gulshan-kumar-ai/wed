import { motion } from 'framer-motion';

/**
 * Golden-hour atmosphere between the temple and the courtyard:
 * - a "veil" of warm mist that softens the temple (fades as you scroll in),
 * - a glowing mist band hugging the horizon,
 * - slow drifting haze clouds.
 */
export default function HazeLayer({ veilStyle, style }) {
  return (
    <motion.div className="pointer-events-none absolute inset-0" style={style} aria-hidden="true">
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(253,242,222,0.4)_0%,rgba(253,242,222,0.26)_55%,rgba(253,242,222,0.08)_78%,rgba(253,242,222,0)_86%)]"
        style={veilStyle}
      />
      {/* Horizon mist band (positioned in artboard units: y ≈ 560–740) */}
      <div
        className="absolute inset-x-[-10%] animate-drift bg-[radial-gradient(ellipse_at_center,rgba(255,244,224,0.85)_0%,rgba(255,244,224,0.35)_45%,rgba(255,244,224,0)_70%)] blur-xl"
        style={{ top: 'calc(100% - var(--u) * 340)', height: 'calc(var(--u) * 180)' }}
      />
      <div
        className="absolute left-[-15%] w-[70%] animate-drift-slow rounded-full bg-[rgba(255,240,215,0.5)] blur-3xl"
        style={{ top: 'calc(100% - var(--u) * 300)', height: 'calc(var(--u) * 90)' }}
      />
      <div
        className="absolute right-[-15%] w-[65%] animate-drift rounded-full bg-[rgba(255,236,205,0.45)] blur-3xl"
        style={{ top: 'calc(100% - var(--u) * 280)', height: 'calc(var(--u) * 80)' }}
      />
    </motion.div>
  );
}
