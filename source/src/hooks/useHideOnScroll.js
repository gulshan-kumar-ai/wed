import { useEffect, useState } from 'react';

/**
 * True while the guest is scrolling down to read (past the first 160 px), false again
 * as soon as they scroll up, like a phone browser's own bars. Never hides a control
 * that is in use (focus inside `ref`).
 */
export function useHideOnScroll(ref, enabled = true) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!enabled) {
      setHidden(false);
      return undefined;
    }
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
  }, [ref, enabled]);
  return hidden;
}
