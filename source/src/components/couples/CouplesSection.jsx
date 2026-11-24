import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ArchPortrait from './ArchPortrait';
import GalleryCarousel from './GalleryCarousel';
import Ornament from '../ui/Ornament';
import { brideFormal, brideFull, groomFull } from '../ui/names';

function CoupleToggle({ couples, active, onChange }) {
  return (
    <div role="tablist" aria-label="Choose a couple" className="mx-auto flex w-full max-w-md rounded-full border border-gold/70 bg-ivory p-1.5 shadow-[0_8px_24px_rgba(80,30,10,0.08)]">
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
            <span className="relative">
              {c.groom} <span className="italic opacity-90">&amp;</span> {c.bride}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CouplePanel({ couple, index }) {
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
          <ArchPortrait name={groomFull(couple)} title={couple.groomTitle} role="The Groom" photo={couple.groomPhoto} tone="saffron" className="lg:order-1" />
          <ArchPortrait name={brideFull(couple)} title={couple.brideTitle} role="The Bride" photo={couple.bridePhoto} tone="crimson" className="lg:order-3" />
        </div>

        <div className="text-center lg:order-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-saffron-dark">{couple.tagline}</p>
          <h3 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.4rem)] font-semibold leading-none text-crimson">
            {couple.groom} <span className="gold-foil italic">&amp;</span> {couple.bride}
          </h3>
          <Ornament className="mx-auto mt-5 h-3 w-48" />
          <p className="mx-auto mt-5 max-w-md font-display text-xl leading-relaxed text-charcoal">{couple.story}</p>
          {couple.brideParents && (
            <p className="mt-5 font-sans text-sm text-charcoal-soft">
              {brideFormal(couple)} is the daughter of {couple.brideParents}
              {couple.brideHometown ? `, ${couple.brideHometown}` : ''}.
            </p>
          )}
        </div>
      </div>

      <div className="mt-16">
        <p className="mb-6 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-saffron-dark">
          Moments together · drag or swipe
        </p>
        <GalleryCarousel items={couple.gallery} label={`${couple.groom} and ${couple.bride} photo gallery`} />
      </div>
    </motion.div>
  );
}

/** Warm cream chapter: the twins' story, then a toggle between the two couples. */
export default function CouplesSection({ wedding }) {
  const { couples, twinStory } = wedding;
  const [active, setActive] = useState(0);

  return (
    <section className="relative bg-ivory-deep px-5 pb-28 pt-6 sm:px-8" aria-labelledby="couples-heading">
      <h2 id="couples-heading" className="sr-only">
        Meet the couples
      </h2>
      <div className="mx-auto max-w-6xl">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="block font-display text-6xl leading-none text-gold" aria-hidden="true">
            “
          </span>
          <p className="-mt-4 font-display text-[clamp(1.35rem,2.6vw,1.75rem)] italic leading-relaxed text-charcoal">{twinStory}</p>
          <footer className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-saffron-dark">
            The twins · {couples[0].groom} &amp; {couples[1].groom}
          </footer>
        </motion.blockquote>

        <div className="mt-14">
          <CoupleToggle couples={couples} active={active} onChange={setActive} />
        </div>

        <div className="mt-14">
          <AnimatePresence mode="wait" initial={false}>
            <CouplePanel key={active} couple={couples[active]} index={active} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
