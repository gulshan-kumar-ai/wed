import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArtLayer from '../layout/ArtLayer';
import SkyArt from './art/SkyArt';
import DistantArt from './art/DistantArt';
import TempleArt from './art/TempleArt';
import CourtyardArt from './art/CourtyardArt';
import FloralUrn from './art/FloralUrn';
import Toran from './art/Toran';
import Diya from './art/Diya';
import PetalShower from './art/PetalShower';
import HazeLayer from './layers/HazeLayer';
import HeroTitle from './HeroTitle';
import ScrollIndicator from '../ui/ScrollIndicator';
import { artwork } from '../../config/artwork';
import { scrollToY } from '../../hooks/useSmoothScroll';
import { useAmbient } from '../../hooks/useAmbient';
import { useIsSmallScreen } from '../../hooks/useMediaQuery';

/*
 * The camera dollies towards the temple doorway as you scroll.
 * Zoom origin = bottom-centre of the front steps (artboard x 720, y 700),
 * i.e. 200 art units up from the bottom edge. `--u` is set by `.stage`.
 */
const DOOR_ORIGIN = '50% calc(100% - var(--u) * 200)';
/* Doorway centre once the temple has zoomed in, for the light-burst overlay. */
const DOOR_GLOW_AT = '50% calc(100% - var(--u) * 460)';

/**
 * Scene 1 — Royal temple courtyard at golden hour.
 *
 * Section is 260svh tall; its inner stage is sticky for the first 160svh so the
 * scroll drives a layered parallax "walk-in", ending in a burst of doorway
 * light that hands off to the next (ivory) scene.
 *
 * Depth rates, back → front:
 *   sky 1.12× · horizon 1.5× · temple 3.2× · courtyard 3.6× · urns/toran exit the frame
 */
export default function HeroScene({ wedding }) {
  const ref = useRef(null);
  const animate = useAmbient(ref);
  const small = useIsSmallScreen();
  // Loops inside the full-screen SVG layers force those layers to be redrawn every
  // frame while they are also being zoomed. On phones, keep them still and let the
  // small pieces (urn diyas, toran, petals) carry the ambient motion.
  const animateBig = animate && !small;

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Typography & cues
  const titleOpacity = useTransform(p, [0, 0.2], [1, 0]);
  const titleY = useTransform(p, [0, 0.3], [0, -140]);
  const titleScale = useTransform(p, [0, 0.3], [1, 0.94]);
  const cueOpacity = useTransform(p, [0, 0.05], [1, 0]);

  // Depth layers
  const skyY = useTransform(p, [0, 1], ['0%', '9%']);
  const skyScale = useTransform(p, [0, 1], [1, 1.12]);
  const distantScale = useTransform(p, [0, 1], [1, 1.5]);
  const templeScale = useTransform(p, [0, 1], [1, 3.2]);
  const veilOpacity = useTransform(p, [0, 0.35], [1, 0]);
  const hazeScale = useTransform(p, [0, 1], [1, 2.2]);
  const hazeOpacity = useTransform(p, [0.55, 0.85], [1, 0.3]);
  const floorScale = useTransform(p, [0, 1], [1, 3.6]);

  // Foreground framing pieces slide out of shot
  const urnLeftX = useTransform(p, [0, 0.8], ['0%', '-95%']);
  const urnRightX = useTransform(p, [0, 0.8], ['0%', '95%']);
  const urnY = useTransform(p, [0, 0.8], ['0%', '28%']);
  const urnScale = useTransform(p, [0, 0.8], [1, 1.7]);
  const toranY = useTransform(p, [0, 0.4], ['0%', '-140%']);
  const petalOpacity = useTransform(p, [0, 0.6], [1, 0]);

  // Doorway light → ivory hand-off to the next scene. On phones the light fills the
  // screen a little sooner and the invitation card rises straight out of it, so
  // there is no empty white screen between the two scenes.
  const glowOpacity = useTransform(p, small ? [0.4, 0.74] : [0.45, 0.82], [0, 1]);
  const whiteout = useTransform(p, small ? [0.7, 0.86] : [0.8, 0.97], [0, 1]);

  const enter = () => {
    const el = ref.current;
    if (el) scrollToY(el.offsetTop + el.offsetHeight - window.innerHeight);
  };

  const urnRightImage = artwork.urnRight ?? artwork.urnLeft;

  return (
    <section ref={ref} className="cv-auto relative h-[185svh] bg-[#D9A577] sm:h-[260svh]" aria-label="Wedding invitation">
      <div className="stage sticky top-0 h-[100svh] w-full overflow-hidden bg-ivory">
        {/* 1 · Sky */}
        <ArtLayer image={artwork.sky} style={{ y: skyY, scale: skyScale, transformOrigin: '50% 100%' }}>
          <SkyArt key={`SkyArt-1-${animateBig}`} animate={animateBig} />
        </ArtLayer>

        {/* 2 · Distant horizon */}
        <ArtLayer image={artwork.distant} style={{ scale: distantScale, transformOrigin: DOOR_ORIGIN }}>
          <DistantArt />
        </ArtLayer>

        {/* 3 · Temple */}
        <ArtLayer image={artwork.temple} style={{ scale: templeScale, transformOrigin: DOOR_ORIGIN }}>
          <TempleArt key={`TempleArt-2-${animateBig}`} animate={animateBig} />
        </ArtLayer>

        {/* 4 · Mist */}
        <HazeLayer
          veilStyle={{ opacity: veilOpacity }}
          style={{ scale: hazeScale, opacity: hazeOpacity, transformOrigin: DOOR_ORIGIN }}
        />

        {/* 5 · Courtyard floor, carpet, diya rows */}
        <ArtLayer image={artwork.courtyard} style={{ scale: floorScale, transformOrigin: DOOR_ORIGIN }}>
          <CourtyardArt key={`CourtyardArt-3-${animateBig}`} animate={animateBig} />
        </ArtLayer>

        {/* 6 · Foreground urns with brass diyas */}
        <ArtLayer
          image={artwork.urnLeft}
          className="absolute bottom-[-2svh] left-[-6vw] w-[clamp(120px,22vw,340px)] sm:left-[1vw]"
          imageClassName="h-auto w-full"
          style={{ x: urnLeftX, y: urnY, scale: urnScale, transformOrigin: '0% 100%' }}
        >
          <FloralUrn key={`FloralUrn-4-${animate}`} className="h-auto w-full md:drop-shadow-[0_18px_30px_rgba(80,30,10,0.35)]" seed={3} animate={animate} />
          <Diya key={`Diya-5-${animate}`} className="absolute bottom-[2%] right-[-38%] hidden w-[44%] md:block" animate={animate} seed={4} />
        </ArtLayer>
        <ArtLayer
          image={urnRightImage}
          className="absolute bottom-[-2svh] right-[-6vw] w-[clamp(120px,22vw,340px)] sm:right-[1vw]"
          imageClassName={`h-auto w-full ${artwork.urnRight ? '' : '-scale-x-100'}`}
          style={{ x: urnRightX, y: urnY, scale: urnScale, transformOrigin: '100% 100%' }}
        >
          <FloralUrn key={`FloralUrn-6-${animate}`} className="h-auto w-full -scale-x-100 md:drop-shadow-[0_18px_30px_rgba(80,30,10,0.35)]" seed={5} animate={animate} />
          <Diya key={`Diya-7-${animate}`} className="absolute bottom-[2%] left-[-38%] hidden w-[44%] md:block" animate={animate} seed={9} />
        </ArtLayer>

        {/* 7 · Toran garland framing the top edge */}
        <ArtLayer
          image={artwork.toran}
          className="absolute inset-x-0 top-0 z-10 h-[clamp(84px,12.5vw,170px)]"
          imageClassName="h-full w-full object-cover object-top"
          style={{ y: toranY }}
        >
          <Toran key={`Toran-8-${animate}`} className="h-full w-full md:drop-shadow-[0_6px_10px_rgba(80,30,10,0.25)]" animate={animate} />
        </ArtLayer>

        {animate && (
          <motion.div className="absolute inset-0 z-10" style={{ opacity: petalOpacity }}>
            <PetalShower count={small ? 8 : 16} />
          </motion.div>
        )}

        {/* Typography overlay */}
        <HeroTitle wedding={wedding} style={{ opacity: titleOpacity, y: titleY, scale: titleScale }} />

        <ScrollIndicator style={{ opacity: cueOpacity }} onClick={enter} />

        {/* Light pouring from the doorway, then fade to ivory */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40"
          style={{
            opacity: glowOpacity,
            background: `radial-gradient(circle at ${DOOR_GLOW_AT}, rgba(255,246,218,0.95) 0%, rgba(255,226,160,0.55) 18%, rgba(253,248,240,0) 55%)`,
          }}
        />
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-40 bg-ivory" style={{ opacity: whiteout }} />
      </div>
    </section>
  );
}
