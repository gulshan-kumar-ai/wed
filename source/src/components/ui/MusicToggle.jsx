import { AnimatePresence, motion } from 'framer-motion';
import { useAudio } from '../../audio';
import { useLanguage } from '../../i18n';

function Bars() {
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
      {[0.6, 1, 0.75, 0.9].map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-crimson"
          initial={{ height: '30%' }}
          animate={{ height: ['30%', `${h * 100}%`, '45%', `${h * 80}%`, '30%'] }}
          transition={{ duration: 1.3 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </span>
  );
}

function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M9 18.5a2.5 2.5 0 1 1-2.5-2.5H9V5.5l10-2v12a2.5 2.5 0 1 1-2.5-2.5H19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Floating ambient-music toggle (top-right). Audio never auto-plays. */
export default function MusicToggle() {
  const { playing, toggle } = useAudio();
  const { t } = useLanguage();

  return (
    <motion.div
      className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.8 }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? t('musicPause') : t('musicPlay')}
        className="group relative flex h-12 items-center gap-2 rounded-full border border-gold/70 bg-ivory/75 pl-[14px] pr-[14px] text-crimson shadow-[0_4px_24px_rgba(169,50,38,0.18)] backdrop-blur-md transition-colors hover:bg-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        {/* A brief invitation to tap, three pulses and then still, never a pulse that runs forever */}
        {!playing && (
          <span
            className="absolute inset-0 animate-ping rounded-full border border-gold/50 [animation-delay:1.6s] [animation-duration:2.6s] [animation-fill-mode:both] [animation-iteration-count:3]"
            aria-hidden="true"
          />
        )}
        <span className="flex h-5 w-5 items-center justify-center">{playing ? <Bars /> : <NoteIcon />}</span>
        <AnimatePresence initial={false}>
          <motion.span
            key={playing ? 'on' : 'off'}
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="hidden overflow-hidden whitespace-nowrap font-sans text-xs font-medium uppercase tracking-[0.18em] text-charcoal sm:inline"
          >
            {playing ? t('musicOn') : t('musicOff')}
          </motion.span>
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
