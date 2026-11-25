import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LanguageMenu } from '../../i18n';
import ShareButton from './ShareButton';
import MusicToggle from './MusicToggle';

/**
 * Slides out of the way while the guest scrolls down to read, and comes back as
 * soon as they scroll up (or reach the top), like a phone browser's own bars.
 * It stays put while one of its buttons or menus is in use.
 */
function useHideOnScroll(ref) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < 6) return;
      last = y;
      const inUse = ref.current?.contains(document.activeElement) && document.activeElement !== document.body;
      setHidden(delta > 0 && y > 160 && !inUse);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [ref]);
  return hidden;
}

/** Language, share and music, together in the top corner. */
export default function TopBar({ wedding }) {
  const ref = useRef(null);
  const hidden = useHideOnScroll(ref);

  return (
    <motion.div
      ref={ref}
      className="fixed right-3 top-3 z-50 flex items-center gap-2 sm:right-6 sm:top-6"
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
