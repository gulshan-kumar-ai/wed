import { motion } from 'framer-motion';
import SacredEmblem from '../ui/SacredEmblem';
import Ornament from '../ui/Ornament';
import { brideFormal, brideFull, groomFormal, groomFull } from '../ui/names';
import { coupleWeds, useLanguage } from '../../i18n';
import { useIntro } from '../../intro';

const isDevanagari = (s) => /[ऀ-ॿ]/.test(s);

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.35 } },
};

const rise = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
};

/** Honorific (Dr., Engr.) set small before the full name. */
function Name({ title, name }) {
  return (
    <span className="text-halo whitespace-nowrap font-display font-semibold leading-[1.04] text-crimson">
      {title && <span className="mr-[0.22em] text-[0.5em] font-medium text-saffron-dark">{title}</span>}
      {name}
    </span>
  );
}

function Couple({ couple, t }) {
  return (
    <motion.span variants={rise} className="flex flex-col items-center">
      <Name title={couple.groomTitle} name={groomFull(couple)} />
      <span className="text-halo my-[0.04em] font-display text-[0.46em] font-medium italic leading-tight text-saffron-dark">{coupleWeds(t)}</span>
      <Name title={couple.brideTitle} name={brideFull(couple)} />
    </motion.span>
  );
}

/** Emblem, subtitle, the two couples' names, location and dates. */
export default function HeroTitle({ wedding, style }) {
  const { t } = useLanguage();
  const { opened } = useIntro();
  const { invocation, subtitle, couples, location, dates, emblem } = wedding;
  const [first, second] = couples;

  return (
    <motion.div
      style={style}
      className="absolute inset-x-0 top-0 z-20 flex flex-col items-center px-5 pt-[clamp(60px,10svh,112px)] text-center will-change-transform"
    >
      {/* Soft ivory halo keeps text legible over the art */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[8svh] -z-10 h-[66svh] w-[min(980px,130vw)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(253,248,240,0.74)_0%,rgba(253,248,240,0.42)_45%,rgba(253,248,240,0)_70%)]"
      />

      <motion.div variants={container} initial="hidden" animate={opened ? 'show' : 'hidden'} className="flex flex-col items-center">
        <motion.div variants={rise}>
          <SacredEmblem om={emblem.om} swastika={emblem.swastika} />
        </motion.div>

        {invocation && (
          <motion.p
            variants={rise}
            className={`text-halo mt-[1.4svh] text-crimson-dark ${
              isDevanagari(invocation)
                ? 'font-deva text-[clamp(0.8rem,1.9svh,1rem)] tracking-wide'
                : 'font-display text-[clamp(0.95rem,2.3svh,1.2rem)] font-semibold tracking-[0.12em]'
            }`}
            lang={isDevanagari(invocation) ? 'sa' : undefined}
          >
            {invocation}
          </motion.p>
        )}

        <motion.p
          variants={rise}
          className="text-halo mt-[1.6svh] font-sans text-[clamp(0.62rem,1.5svh,0.78rem)] font-semibold uppercase tracking-[0.5em] text-saffron-dark"
        >
          {t('languageCode') === 'ur' ? 'دو شاندار اتحاد' : t('languageCode') === 'sd' ? 'ٻہ شاهي اتحاد' : subtitle}
        </motion.p>

        {/* Full names with honorifics are long, so the size tracks both width and height */}
        <h1 className="mt-[2svh] flex flex-col items-center text-[clamp(1.75rem,min(8.2vw,5.4svh),2.6rem)] lg:flex-row lg:items-center lg:gap-[0.55em] lg:text-[clamp(2.4rem,min(3.9vw,7svh),4.1rem)]">
          <span className="sr-only">
            {groomFormal(first)} weds {brideFormal(first)} and {groomFormal(second)} weds {brideFormal(second)}
          </span>
          <span aria-hidden="true" className="contents">
            <Couple couple={first} t={t} />
            <motion.span
              variants={rise}
              className="gold-foil my-[0.12em] font-display text-[1em] font-medium italic leading-none lg:my-0 lg:text-[1.3em]"
            >
              &amp;
            </motion.span>
            <Couple couple={second} t={t} />
          </span>
        </h1>

        <motion.div variants={rise} className="mt-[2.2svh] flex flex-col items-center">
          <Ornament className="h-3 w-[min(240px,60vw)]" />
          <p className="text-halo mt-[1.4svh] font-display text-[clamp(1.25rem,3.2svh,1.75rem)] font-medium italic text-charcoal">
            {location}
          </p>
          <p className="text-halo mt-1 font-sans text-[clamp(0.66rem,1.6svh,0.82rem)] font-medium uppercase tracking-[0.34em] text-charcoal-soft">
            {dates}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
