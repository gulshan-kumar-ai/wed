import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArtLayer from '../layout/ArtLayer';
import GardenBackdrop from './art/GardenBackdrop';
import ArcadeArt from './art/ArcadeArt';
import BalustradeArt from './art/BalustradeArt';
import GardenForeground from './art/GardenForeground';
import Peacock from './art/Peacock';
import Toran from '../hero/art/Toran';
import InvitationCard from '../invitation/InvitationCard';
import { artwork } from '../../config/artwork';
import { useAmbient } from '../../hooks/useAmbient';
import { useReducedMotion } from 'framer-motion';

/*
 * Peacocks are HTML-positioned so they stay on screen on narrow phones, but
 * their perch (half their height) is pinned to the balustrade's top rail at
 * artboard y = 640, i.e. 260 art units up from the bottom.
 */
const peacockBox = {
  '--pw': 'min(calc(var(--u) * 300), 38vw)',
  width: 'var(--pw)',
  bottom: 'calc(var(--u) * 260 - var(--pw) * 0.5)',
};
/* ~600 art units out from centre on desktop; hugs the screen edge on phones. */
const PEACOCK_INSET = 'clamp(-36px, calc(50% - var(--u) * 600), 40%)';

/**
 * Scene 2 — Royal garden courtyard.
 *
 * A sticky backdrop (mehrab arcade, balustrade with peacocks, garden) sits
 * behind the scrolling invitation card. It arrives veiled in ivory so it
 * continues seamlessly from the hero's doorway light, then layers drift at
 * different rates as the card scrolls past.
 */
export default function GardenCourtyardScene({ wedding }) {
  const ref = useRef(null);
  const animate = useAmbient(ref);
  const reduceMotion = useReducedMotion();
  const g = artwork.garden;

  const { scrollYProgress: entry } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const veil = useTransform(entry, [0.25, 1], [1, 0]);
  const arcadeY = useTransform(p, [0, 1], ['3%', '-3%']);
  const railY = useTransform(p, [0, 1], ['7%', '-7%']);
  const groundY = useTransform(p, [0, 1], ['12%', '-12%']);
  const toranY = useTransform(p, [0.15, 0.5], ['0%', '-130%']);
  const dim = useTransform(p, [0.3, 0.45, 0.75, 0.85], [0, 0.18, 0.18, 0]);

  return (
    <section ref={ref} className="relative bg-[#5D7C38]" aria-label="Formal invitation">
      {/* Sticky backdrop */}
      <div className="stage sticky top-0 h-[100svh] w-full overflow-hidden bg-[#5D7C38]">
        <ArtLayer image={g.backdrop}>
          <GardenBackdrop />
        </ArtLayer>
        <ArtLayer image={g.arcade} style={{ y: arcadeY }}>
          <ArcadeArt />
        </ArtLayer>
        <ArtLayer image={g.balustrade} style={{ y: railY }}>
          <BalustradeArt />
        </ArtLayer>
        <motion.div className="pointer-events-none absolute inset-0" style={{ y: railY }} aria-hidden="true">
          <motion.div
            className="absolute"
            style={{ ...peacockBox, left: PEACOCK_INSET }}
            animate={animate && !reduceMotion ? { x: ['0%', '-5%', '5%', '0%'], y: [0, -3, 0, -2, 0] } : undefined}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', times: [0, 0.33, 0.66, 1] }}
          >
            {g.peacock ? <img src={g.peacock} alt="" className="h-auto w-full" /> : <Peacock key={`Peacock-1-${animate}`} className="h-auto w-full" animate={animate} />}
          </motion.div>
          <motion.div
            className="absolute"
            style={{ ...peacockBox, right: PEACOCK_INSET }}
            animate={animate && !reduceMotion ? { x: ['0%', '5%', '-5%', '0%'], y: [0, -2, 0, -3, 0] } : undefined}
            transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.33, 0.66, 1] }}
          >
            {g.peacock ? (
              <img src={g.peacock} alt="" className="h-auto w-full -scale-x-100" />
            ) : (
              <Peacock key={`Peacock-2-${animate}`} className="h-auto w-full" animate={animate} flip />
            )}
          </motion.div>
        </motion.div>
        <ArtLayer image={g.foreground} style={{ y: groundY }}>
          <GardenForeground />
        </ArtLayer>
        <ArtLayer
          image={artwork.toran}
          className="absolute inset-x-0 top-0 h-[clamp(84px,12.5vw,170px)]"
          imageClassName="h-full w-full object-cover object-top"
          style={{ y: toranY }}
        >
          <Toran key={`Toran-3-${animate}`} className="h-full w-full md:drop-shadow-[0_6px_10px_rgba(80,30,10,0.25)]" animate={animate} />
        </ArtLayer>

        {/* Gentle dimming while the card is being read */}
        <motion.div className="absolute inset-0 bg-charcoal" style={{ opacity: dim }} aria-hidden="true" />
        {/* Ivory veil continuing the hero's doorway light */}
        <motion.div className="pointer-events-none absolute inset-0 bg-ivory" style={{ opacity: veil }} aria-hidden="true" />
      </div>

      {/* Scrolling content over the backdrop */}
      <div className="relative z-10 -mt-[100svh] px-4 pb-[22svh] pt-[24svh] sm:px-6 sm:pb-[45svh] sm:pt-[92svh]">
        <div id="invitation">
          <InvitationCard wedding={wedding} />
        </div>
      </div>
    </section>
  );
}
