import { useEffect } from 'react';
import Lenis from 'lenis';

let instance = null;
let locked = false;

/** Scroll to a y-position (px) using Lenis when active, native scroll otherwise. */
export function scrollToY(y, duration = 2.6) {
  if (instance) instance.scrollTo(y, { duration });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

/** Jump to a y-position (px) with no animation, even while scrolling is locked. */
export function jumpToY(y) {
  if (instance) instance.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: 'instant' });
}

/** Page offset of a section by id, or null if it isn't on the page. */
export function sectionY(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  // The invitation card floats over its garden scene: leave a little of the scene above it
  const offset = id === 'invitation' ? window.innerHeight * 0.06 : 0;
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
}

export function scrollToSection(id, { immediate = false } = {}) {
  const y = sectionY(id);
  if (y == null) return;
  if (immediate) jumpToY(y);
  else scrollToY(y, 1.6);
}

/** Freeze page scrolling (used while the opening doors are closed). */
export function lockScroll(lock) {
  locked = lock;
  document.documentElement.style.overflow = lock ? 'hidden' : '';
  document.body.style.overflow = lock ? 'hidden' : '';
  if (instance) {
    if (lock) instance.stop();
    else instance.start();
  }
}

/**
 * Inertial smooth scrolling for the whole page.
 * Lenis drives native window scroll, so Framer Motion's useScroll keeps working.
 * Skipped when the visitor prefers reduced motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const narrowScreen = window.matchMedia('(max-width: 767px)').matches;

    if (reducedMotion || coarsePointer || narrowScreen) return undefined;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });
    instance = lenis;
    if (locked) lenis.stop();

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
