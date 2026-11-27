import { useRef, useState } from 'react';
import { useLanguage } from '../../i18n';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';

const embedUrl = (q) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
const directionsUrl = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

function PinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function VenuePanel({ venue }) {
  const { t } = useLanguage();
  return (
    <motion.div
      key={venue.id}
      id={`venue-panel-${venue.id}`}
      role="tabpanel"
      aria-labelledby={`venue-tab-${venue.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="grid overflow-hidden rounded-[1.75rem] border border-gold/70 bg-ivory shadow-[0_24px_60px_rgba(80,30,10,0.14)] lg:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="flex flex-col p-8 sm:p-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.26em] text-saffron-dark">{venue.tab}</p>
        <h3 className="mt-3 font-display text-[2.1rem] font-semibold leading-tight text-crimson">{venue.name}</h3>

        <p className="mt-4 flex items-start gap-3 font-sans text-base font-medium leading-relaxed text-charcoal">
          <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-crimson" />
          {venue.address}
        </p>

        <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
          <a
            href={directionsUrl(venue.mapQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-crimson to-crimson-light px-6 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_8px_20px_rgba(169,50,38,0.3)] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8-8-2z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
            {t('directions')}
          </a>
        </div>
      </div>

      <div className="relative min-h-[320px] border-t border-gold/50 lg:min-h-[480px] lg:border-s lg:border-t-0">
        <iframe
          title={t('mapOf', { name: venue.name })}
          src={embedUrl(venue.mapQuery)}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_6px_rgba(253,248,240,0.9)]" aria-hidden="true" />
      </div>
    </motion.div>
  );
}

/** Tabbed location switcher with address, landmarks, directions and an embedded map. */
export default function VenuesSection({ wedding }) {
  const { venues } = wedding;
  const { t, rtl } = useLanguage();
  const [active, setActive] = useState(0);
  const tabsRef = useRef([]);

  const onKeyDown = (e) => {
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    const dir = e.key === forward ? 1 : e.key === back ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + venues.length) % venues.length;
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section id="venues" className="relative bg-ivory-deep px-5 py-24 sm:px-8 sm:py-28" aria-labelledby="venues-heading">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="venues-heading" eyebrow={t('travelling')} title={t('venuesTitle')} intro={t('venuesIntro')} />

        <div
          role="tablist"
          aria-label={t('locationsAria')}
          onKeyDown={onKeyDown}
          className="mx-auto mt-12 flex max-w-3xl flex-col gap-2 rounded-3xl border border-gold/70 bg-ivory p-2 sm:flex-row sm:rounded-full"
        >
          {venues.map((v, i) => {
            const selected = i === active;
            return (
              <button
                key={v.id}
                ref={(el) => (tabsRef.current[i] = el)}
                id={`venue-tab-${v.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`venue-panel-${v.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative flex-1 rounded-full px-4 py-3 font-sans text-sm font-semibold tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                  selected ? 'text-white' : 'text-charcoal hover:text-crimson'
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="venue-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-saffron to-saffron-dark shadow-md"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{v.tab}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait" initial={false}>
            <VenuePanel key={venues[active].id} venue={venues[active]} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
