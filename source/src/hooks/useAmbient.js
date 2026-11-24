import { useInView, useReducedMotion } from 'framer-motion';

/**
 * Whether a scene's ambient loops (flickering diyas, swaying garlands, petals…)
 * should run: only while the scene is on or near the screen, and never when the
 * visitor prefers reduced motion. Infinite Framer Motion loops keep running
 * once started, so scenes remount their art with `key={String(animate)}` to stop them.
 */
export function useAmbient(ref) {
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: '25% 0px 25% 0px' });
  return inView && !reduce;
}
