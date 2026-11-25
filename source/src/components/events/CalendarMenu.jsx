import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { downloadIcs, googleCalendarUrl } from './calendar';
import { useLanguage } from '../../i18n';

/** "Save to Calendar" button with Google Calendar and .ics (Apple / Outlook) options. */
export default function CalendarMenu({ event }) {
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
    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start font-sans text-sm font-medium text-charcoal transition hover:bg-gold-pale focus:outline-none focus-visible:bg-gold-pale';

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron to-saffron-dark px-5 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_6px_16px_rgba(184,95,18,0.35)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path d="M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM12 11v6M9 14h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {t('saveCalendar')}
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
            className="absolute bottom-full left-1/2 z-30 mb-2 w-64 rounded-xl border border-gold/60 bg-ivory p-1.5 shadow-[0_18px_40px_rgba(44,34,30,0.18)]"
          >
            <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-saffron/15 font-semibold text-saffron-dark">G</span>
              {t('googleCalendar')}
            </a>
            <button
              type="button"
              className={item}
              onClick={() => {
                downloadIcs(event);
                setOpen(false);
              }}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-crimson/10 text-crimson">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              {t('appleOutlook')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
