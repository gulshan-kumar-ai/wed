import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../i18n';

/**
 * Small note for a returning guest, who now lands on the invitation card:
 * it greets them and offers to replay the doors and the walk-in.
 */
export default function WelcomeBack({ guest, onReplay }) {
  const { t } = useLanguage();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setShow(false), 7000);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.5 } }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed inset-x-0 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+4.25rem)] z-40 flex justify-center px-4"
        >
          <div className="flex max-w-full items-center gap-3 rounded-full border border-gold/60 bg-charcoal/95 py-1.5 pl-4 pr-1.5 text-ivory shadow-[0_10px_30px_rgba(44,34,30,0.3)] md:bg-charcoal/90 md:backdrop-blur-md">
            <span className="min-w-0 truncate font-display text-base italic">
              {t('welcomeBack')}
              {guest ? `, ${guest.to}` : ''}
            </span>
            <button
              type="button"
              onClick={() => {
                setShow(false);
                onReplay();
              }}
              className="min-h-[44px] shrink-0 rounded-full bg-ivory px-3.5 py-2 font-sans text-[12px] font-semibold text-crimson transition hover:bg-gold-pale focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {t('replayEntrance')} ↑
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
