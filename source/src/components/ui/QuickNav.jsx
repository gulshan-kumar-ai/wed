import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../i18n';
import { scrollToSection } from '../../hooks/useSmoothScroll';
import { RSVP_EVENT, hasReplied } from '../../guest';
import { useHideOnScroll } from '../../hooks/useHideOnScroll';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const ITEMS = [
  ['invitation', 'navInvite'],
  ['events', 'navEvents'],
  ['venues', 'navVenue'],
];

/** True once this guest has sent an RSVP (on this device). */
function useReplied() {
  const [replied, setReplied] = useState(hasReplied);
  useEffect(() => {
    const update = () => setReplied(hasReplied());
    window.addEventListener(RSVP_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(RSVP_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, []);
  return replied;
}

/** Which section is under the reading line, and whether we are past the hero. */
function useScrollState() {
  const [state, setState] = useState({ past: false, active: null });
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      const invite = document.getElementById('invitation')?.closest('section');
      // The garden section starts underneath the temple walk-in (crossfade); the dock appears once it has faded in
      const past = !!invite && invite.getBoundingClientRect().top <= -window.innerHeight * 0.25;
      let active = null;
      for (const id of ['invitation', 'events', 'venues', 'rsvp']) {
        const el = document.getElementById(id);
        const range = el?.closest('section') ?? el;
        if (!range) continue;
        const r = range.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) active = id;
      }
      setState((s) => (s.past === past && s.active === active ? s : { past, active }));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return state;
}

/** Hide the dock while the guest is typing, so it never sits on top of the phone keyboard. */
function useTyping() {
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const isField = (el) => el?.matches?.('input:not([type=checkbox]):not([type=radio]), textarea, select');
    const onIn = (e) => isField(e.target) && setTyping(true);
    const onOut = (e) => isField(e.target) && setTyping(false);
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);
  return typing;
}

/**
 * Floating dock (Invite · Events · Venue · RSVP) that appears once the guest is
 * past the opening walk-in. RSVP stays a bright pill until they reply. Share,
 * language and music live in the top bar.
 */
export default function QuickNav() {
  const { t } = useLanguage();
  const { past, active } = useScrollState();
  const replied = useReplied();
  const typing = useTyping();
  // A phone held sideways is only ~350 px tall: there the dock steps aside while scrolling down
  const sideways = useMediaQuery('(orientation: landscape) and (max-height: 500px)');
  const navRef = useRef(null);
  const tucked = useHideOnScroll(navRef, sideways);
  const show = past && !typing && !tucked;

  const item = (selected) =>
    `relative min-h-[44px] rounded-full px-3 py-2.5 font-sans text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors sm:px-5 sm:tracking-[0.12em] focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
      selected ? 'bg-gold-pale text-crimson' : 'text-charcoal hover:text-crimson'
    }`;

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.nav
            ref={navRef}
            key="dock"
            aria-label={t('navLabel')}
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-2"
          >
            <div className="pointer-events-auto flex max-w-full items-center gap-0.5 rounded-full border border-gold/70 bg-ivory/95 p-1.5 shadow-[0_10px_30px_rgba(44,34,30,0.22)] sm:gap-1 md:bg-ivory/90 md:backdrop-blur-md">
              {ITEMS.map(([id, key]) => (
                <button key={id} type="button" className={item(active === id)} aria-current={active === id ? 'location' : undefined} onClick={() => scrollToSection(id)}>
                  {t(key)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => scrollToSection('rsvp')}
                aria-current={active === 'rsvp' ? 'location' : undefined}
                className={
                  replied
                    ? `${item(active === 'rsvp')} inline-flex items-center gap-1`
                    : 'min-h-[44px] rounded-full bg-gradient-to-r from-crimson via-crimson-light to-saffron px-4 py-2.5 font-sans text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_6px_16px_rgba(169,50,38,0.35)] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:px-6 sm:tracking-[0.16em]'
                }
              >
                {replied && (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[#1F7A4D]" aria-hidden="true">
                    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {t('navRsvp')}
                {replied && <span className="sr-only"> ({t('navReplied')})</span>}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
