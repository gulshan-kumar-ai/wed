import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ArchPortrait from './ArchPortrait';
import GalleryCarousel from './GalleryCarousel';
import Ornament from '../ui/Ornament';
import { brideFormal, brideFull, groomFull } from '../ui/names';
import { useLanguage } from '../../i18n';

function CoupleToggle({ couples, active, onChange }) {
  const { t } = useLanguage();
  return (
    <div role="tablist" aria-label={t('chooseCouple')} className="mx-auto flex w-full max-w-md rounded-full border border-gold/70 bg-ivory p-1.5 shadow-[0_8px_24px_rgba(80,30,10,0.08)]">
      {couples.map((c, i) => {
        const selected = i === active;
        return (
          <button
            key={c.groom}
            type="button"
            role="tab"
            id={`couple-tab-${i}`}
            aria-selected={selected}
            aria-controls="couple-panel"
            onClick={() => onChange(i)}
            className={`relative flex-1 rounded-full px-4 py-3 font-display text-lg font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:text-xl ${
              selected ? 'text-ivory' : 'text-crimson hover:text-crimson-dark'
            }`}
          >
            {selected && (
              <motion.span
                layoutId="couple-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-crimson to-crimson-light shadow-md"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative" dir="ltr">
              {c.groom} <span className="italic opacity-90">&amp;</span> {c.bride}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CouplePanel({ couple, index }) {
  const { t } = useLanguage();
  const photos = couple.gallery.filter((g) => g.src);
  const pair = `${couple.groom} & ${couple.bride}`;

  return (
    <motion.div
      key={couple.groom}
      id="couple-panel"
      role="tabpanel"
      aria-labelledby={`couple-tab-${index}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr_1fr] lg:gap-12">
        <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-5 lg:contents">
          <ArchPortrait
            name={groomFull(couple)}
            title={couple.groomTitle}
            role={t('theGroom')}
            photo={couple.groomPhoto}
            alt={t('portraitOf', { name: groomFull(couple) })}
            tone="saffron"
            className="lg:order-1"
          />
          <ArchPortrait
            name={brideFull(couple)}
            title={couple.brideTitle}
            role={t('theBride')}
            photo={couple.bridePhoto}
            alt={t('portraitOf', { name: brideFull(couple) })}
            tone="crimson"
            className="lg:order-3"
          />
        </div>

        <div className="text-center lg:order-2">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.26em] text-saffron-dark">{couple.tagline}</p>
          <h3 dir="ltr" className="mt-3 font-display text-[clamp(2.4rem,5vw,3.4rem)] font-semibold leading-none text-crimson">
            {couple.groom} <span className="gold-foil italic">&amp;</span> {couple.bride}
          </h3>
          <Ornament className="mx-auto mt-5 h-3 w-48" />
          <p className="mx-auto mt-5 max-w-md font-display text-xl leading-relaxed text-charcoal">{couple.story}</p>
        </div>
      </div>

      {/* The gallery appears once real photos are added in wedding.js */}
      {photos.length > 0 && (
        <div className="mt-16">
          <p className="mb-6 text-center font-sans text-xs font-semibold uppercase tracking-[0.26em] text-saffron-dark">{t('moments')}</p>
          <GalleryCarousel items={photos} label={t('galleryLabel', { couple: pair })} />
        </div>
      )}
    </motion.div>
  );
}

/** Warm cream chapter: a toggle between the two couples, their portraits and story. */
export default function CouplesSection({ wedding }) {
  const { couples } = wedding;
  const [active, setActive] = useState(0);
  const { t } = useLanguage();

  return (
    <section className="relative bg-ivory-deep px-5 pb-24 pt-4 sm:px-8 sm:pb-28" aria-labelledby="couples-heading">
      <h2 id="couples-heading" className="sr-only">
        {t('meetTitle')}
      </h2>
      <div className="mx-auto max-w-6xl">
        <CoupleToggle couples={couples} active={active} onChange={setActive} />

        <div className="mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <CouplePanel key={active} couple={couples[active]} index={active} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
