import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArtLayer from '../layout/ArtLayer';
import DuskSkyArt from './art/DuskSkyArt';
import PavilionPondArt from './art/PavilionPondArt';
import LotusForegroundArt from './art/LotusForegroundArt';
import Elephant from './art/Elephant';
import Countdown from './Countdown';
import Ornament from '../ui/Ornament';
import { useAmbient } from '../../hooks/useAmbient';
import { artwork } from '../../config/artwork';

/* Elephants stand on the near banks, about 700 art units out from centre on desktop. */
const elephantBox = {
  '--ew': 'min(calc(var(--u) * 400), 34vw)',
  width: 'var(--ew)',
  bottom: '-1%',
};
const ELEPHANT_INSET = 'clamp(-4vw, calc(50% - var(--u) * 720), 6%)';

/**
 * Closing scene — a lit temple pavilion over a lotus pond at dusk, floating
 * diyas, elephants framing the sides, the live countdown and the family blessing.
 */
export default function FinaleScene({ wedding }) {
  const ref = useRef(null);
  const animate = useAmbient(ref);
  const f = artwork.finale;
  const { finale } = wedding;

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const skyY = useTransform(p, [0, 1], ['-6%', '0%']);
  const pondY = useTransform(p, [0, 1], ['5%', '0%']);
  const lotusY = useTransform(p, [0, 1], ['12%', '0%']);
  const leftX = useTransform(p, [0.2, 1], ['-35%', '0%']);
  const rightX = useTransform(p, [0.2, 1], ['35%', '0%']);
  const textY = useTransform(p, [0.3, 1], [40, 0]);
  const textOpacity = useTransform(p, [0.35, 0.75], [0, 1]);

  return (
    <section
      ref={ref}
      className="stage relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[#17122A] sm:min-h-[640px]"
      aria-labelledby="finale-heading"
    >
      <ArtLayer image={f.sky} style={{ y: skyY }}>
        <DuskSkyArt key={`DuskSkyArt-1-${animate}`} animate={animate} />
      </ArtLayer>
      {/* Pavilion, pond and lotuses sit lower than the sky so the countdown has open sky above them */}
      <div className="absolute inset-x-0 bottom-0 top-[20%]">
        <ArtLayer image={f.pavilion} style={{ y: pondY }}>
          <PavilionPondArt key={`PavilionPondArt-2-${animate}`} animate={animate} />
        </ArtLayer>
        <ArtLayer image={f.foreground} style={{ y: lotusY }}>
          <LotusForegroundArt key={`LotusForegroundArt-3-${animate}`} animate={animate} />
        </ArtLayer>
      </div>

      <motion.div className="pointer-events-none absolute" style={{ ...elephantBox, left: ELEPHANT_INSET, x: leftX }} aria-hidden="true">
        {f.elephant ? <img src={f.elephant} alt="" className="h-auto w-full" /> : <Elephant key={`Elephant-4-${animate}`} className="h-auto w-full" animate={animate} />}
      </motion.div>
      <motion.div className="pointer-events-none absolute" style={{ ...elephantBox, right: ELEPHANT_INSET, x: rightX }} aria-hidden="true">
        {f.elephant ? (
          <img src={f.elephant} alt="" className="h-auto w-full -scale-x-100" />
        ) : (
          <Elephant key={`Elephant-5-${animate}`} className="h-auto w-full" animate={animate} flip />
        )}
      </motion.div>

      {/* Countdown overlay over the twilight sky */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-x-0 top-0 z-10 flex flex-col items-center px-4 pt-[max(4.5rem,8svh)] text-center"
      >
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-saffron-light sm:text-[13px]">{finale.eyebrow}</p>
        <h2 id="finale-heading" className="mt-3 max-w-5xl font-display text-[clamp(1.9rem,4.6vw,3.2rem)] font-semibold leading-[1.08] text-ivory">
          {finale.title}
        </h2>
        {finale.subtitle && (
          <p className="mt-2 font-display text-[clamp(1.1rem,2.4vw,1.5rem)] italic text-gold-light">{finale.subtitle}</p>
        )}
        <div className="mt-[clamp(1rem,3svh,2rem)] w-full">
          <Countdown target={finale.countdownTo} arrivedMessage={finale.arrivedMessage} timeZone={wedding.timeZone} />
        </div>
      </motion.div>

      {/* Closing family blessing, floating on the pond */}
      <motion.div style={{ opacity: textOpacity }} className="absolute inset-x-0 bottom-[calc(34vw*0.81+0.5rem)] z-10 flex justify-center px-4 lg:bottom-[max(1.5rem,5svh)]">
        <div className="flex flex-col items-center rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(18,19,46,0.78)_0%,rgba(18,19,46,0.5)_55%,rgba(18,19,46,0)_100%)] px-10 py-5 text-center">
        <Ornament className="h-3 w-44" />
        <p className="mt-3 font-display text-xl italic text-ivory/95 sm:text-2xl">{finale.regards}</p>
        <p className="mt-1 font-display text-[clamp(1.6rem,4vw,2.4rem)] font-semibold text-gold-light">{finale.family}</p>
        </div>
      </motion.div>
    </section>
  );
}
