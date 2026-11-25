import { motion } from 'framer-motion';
import { useLanguage } from '../../i18n';

/** "Scroll to Enter" cue with a gold bead travelling down a fine line. */
export default function ScrollIndicator({ style, onClick, label }) {
  const { t } = useLanguage();
  const cue = label || t('scroll');
  return (
    <motion.div
      className="absolute inset-x-0 bottom-[max(1.25rem,3svh)] z-30 flex justify-center"
      style={style}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 1 }}
    >
      <button
        type="button"
        onClick={onClick}
        className="group flex flex-col items-center gap-3 rounded-full px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
      >
        <span className="text-halo font-sans text-xs font-semibold uppercase tracking-[0.3em] text-charcoal sm:text-[13px]">
          {cue}
        </span>
        <span className="relative block h-12 w-px overflow-hidden bg-charcoal/20">
          <motion.span
            className="absolute left-[-1px] top-0 h-3 w-[3px] rounded-full bg-gradient-to-b from-gold to-saffron"
            animate={{ y: ['-100%', '400%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
          />
        </span>
      </button>
    </motion.div>
  );
}
