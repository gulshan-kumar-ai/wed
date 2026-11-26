import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { downloadIcs, googleCalendarUrl } from './calendar';
import { useLanguage } from '../../i18n';

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      d="M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8 12h2M14 12h2M8 16h2M14 16h2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * The one calendar button, below the ceremonies. Its menu offers a single .ics file with every
 * ceremony (Apple Calendar, Outlook, Samsung and most phones), then a Google Calendar link per
 * ceremony, because Google Calendar can only add one event per link.
 *   events: [{ id, title, start, end, details, location, tentative, short, day }]
 */
export default function CalendarMenu({ events, label, fileName, calendarName }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const menuId = useId();
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const item =
    'flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start font-sans text-sm font-medium text-charcoal transition hover:bg-gold-pale focus:outline-none focus-visible:bg-gold-pale';

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-gradient-to-r from-saffron to-saffron-dark px-6 py-3.5 font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(184,95,18,0.3)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:text-sm"
      >
        <CalendarIcon />
        {label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            style={{ x: '-50%' }}
            className="absolute bottom-full left-1/2 z-30 mb-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-gold/60 bg-ivory p-1.5 text-start shadow-[0_18px_40px_rgba(44,34,30,0.2)]"
          >
            <button
              type="button"
              className={item}
              onClick={() => {
                downloadIcs(events, fileName, calendarName);
                setOpen(false);
              }}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-crimson/10 text-crimson">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {t('calAllFile', { n: events.length })}
            </button>
            <p className="px-3 pb-1 pt-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-crimson">{t('calGoogleHeading')}</p>
            {events.map((e) => (
              <a key={e.id} href={googleCalendarUrl(e)} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-saffron/15 font-semibold text-saffron-dark">G</span>
                <span className="min-w-0 flex-1">{e.short}</span>
                <span className="shrink-0 text-xs text-charcoal-soft">{e.day}</span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
