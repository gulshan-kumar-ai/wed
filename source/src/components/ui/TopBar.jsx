import { useRef } from 'react';
import { motion } from 'framer-motion';
import { LanguageMenu } from '../../i18n';
import { useHideOnScroll } from '../../hooks/useHideOnScroll';
import ShareButton from './ShareButton';
import MusicToggle from './MusicToggle';

/**
 * Language, share and music, together in the top corner. Slides out of the way
 * while the guest scrolls down to read and comes back when they scroll up.
 */
export default function TopBar({ wedding }) {
  const ref = useRef(null);
  const hidden = useHideOnScroll(ref);

  return (
    <motion.div
      ref={ref}
      data-topbar
      className="fixed right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] z-50 flex items-center gap-2 sm:right-[max(1.5rem,env(safe-area-inset-right))] sm:top-[max(1.5rem,env(safe-area-inset-top))]"
      initial={{ opacity: 0, y: -10 }}
      animate={hidden ? { opacity: 0, y: -90 } : { opacity: 1, y: 0 }}
      transition={hidden ? { duration: 0.25 } : { duration: 0.35, delay: 0 }}
      style={{ pointerEvents: hidden ? 'none' : 'auto' }}
    >
      <LanguageMenu />
      <ShareButton wedding={wedding} variant="bar" />
      <MusicToggle />
    </motion.div>
  );
}
