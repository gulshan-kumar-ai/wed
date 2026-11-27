import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArtLayer from '../layout/ArtLayer';
import DuskSkyArt from './art/DuskSkyArt';
import PavilionPondArt from './art/PavilionPondArt';
import LotusForegroundArt from './art/LotusForegroundArt';
import Elephant from './art/Elephant';
import Countdown from './Countdown';
import Ornament from '../ui/Ornament';
import ShareButton from '../ui/ShareButton';
import { OmMedallion, Swastika } from '../ui/SacredEmblem';
import { useAmbient } from '../../hooks/useAmbient';
import { useIsSmallScreen } from '../../hooks/useMediaQuery';
import { useLanguage } from '../../i18n';
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
  const small = useIsSmallScreen();
  const animateBig = animate && !small;
  const f = artwork.finale;
  const { finale, couples, footer } = wedding;
  const { t } = useLanguage();

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
        <DuskSkyArt key={`DuskSkyArt-1-${animateBig}`} animate={animateBig} />
      </ArtLayer>
      {/* Pavilion, pond and lotuses sit lower than the sky so the countdown has open sky above them */}
      <div className="absolute inset-x-0 bottom-0 top-[20%]">
        <ArtLayer image={f.pavilion} style={{ y: pondY }}>
          <PavilionPondArt key={`PavilionPondArt-2-${animate}`} animate={animate} />
        </ArtLayer>
        <ArtLayer image={f.foreground} style={{ y: lotusY }}>
          <LotusForegroundArt key={`LotusForegroundArt-3-${animateBig}`} animate={animateBig} />
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

      {/* Closing blessing + couple names + share — all in one screen */}
      <motion.div style={{ opacity: textOpacity }} className="absolute inset-x-0 bottom-[calc(34vw*0.81+0.25rem)] z-10 flex justify-center px-4 lg:bottom-[max(1rem,3svh)] short:bottom-4">
        <div className="flex flex-col items-center rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(18,19,46,0.85)_0%,rgba(18,19,46,0.6)_60%,rgba(18,19,46,0)_100%)] px-10 py-4 text-center">
          <Ornament className="h-2.5 w-36" />
          <p className="mt-2 font-display text-base italic text-ivory/90 sm:text-lg">{finale.regards}</p>
          <p className="mt-0.5 font-display text-[clamp(1.3rem,3.2vw,2rem)] font-semibold text-gold-light">{finale.family}</p>

          <div className="mt-3 h-px w-28 bg-gold/30" />

          <div className="mt-3 flex items-center gap-3">
            <Swastika className="h-3 w-3 text-gold/70" />
            <OmMedallion className="h-8 w-8" />
            <Swastika className="h-3 w-3 text-gold/70" />
          </div>
          <p dir="ltr" className="mt-2 font-display text-[clamp(1rem,2.4vw,1.4rem)] font-semibold text-gold-light">
            {couples[0].groom} &amp; {couples[0].bride}{' '}
            <span className="text-ivory/50">·</span>{' '}
            {couples[1].groom} &amp; {couples[1].bride}
          </p>
          {footer?.hashtag && (
            <p dir="ltr" className="mt-1 font-sans text-xs font-semibold tracking-[0.18em] text-saffron-light">
              {footer.hashtag}
            </p>
          )}
          <div className="mt-3">
            <ShareButton wedding={wedding} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
