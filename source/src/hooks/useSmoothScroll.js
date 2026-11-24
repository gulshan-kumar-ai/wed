import { useEffect } from 'react';
import Lenis from 'lenis';

let instance = null;

/** Scroll to a y-position (px) using Lenis when active, native scroll otherwise. */
export function scrollToY(y, duration = 2.6) {
  if (instance) instance.scrollTo(y, { duration });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

/**
 * Inertial smooth scrolling for the whole page.
 * Lenis drives native window scroll, so Framer Motion's useScroll keeps working.
 * Skipped when the visitor prefers reduced motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });
    instance = lenis;

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      instance = null;
    };
  }, []);
}
