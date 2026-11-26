import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { OmMedallion } from '../ui/SacredEmblem';
import Ornament from '../ui/Ornament';
import Toran from '../hero/art/Toran';
import { lockScroll } from '../../hooks/useSmoothScroll';
import { LanguageSwitcher, useLanguage } from '../../i18n';

const EASE = [0.65, 0, 0.35, 1];

/** Brass studs in a neat grid, like the nail heads on an old haveli door. */
function Studs({ cols, rows, className = '' }) {
  return (
    <div className={`grid place-items-center ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }} aria-hidden="true">
      {Array.from({ length: cols * rows }, (_, i) => (
        <span key={i} className="h-2 w-2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#F6E6A6,#B8922C_60%,#7A5C12)] shadow-[0_1px_1px_rgba(0,0,0,0.35)]" />
      ))}
    </div>
  );
}

/** One carved door leaf. `side` is the hinge side. */
function Door({ side, opening, reduce, onDone }) {
  const left = side === 'left';
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute inset-y-0 w-1/2 overflow-hidden ${left ? 'left-0' : 'right-0'}`}
      style={{
        transformOrigin: left ? '0% 50%' : '100% 50%',
        background:
          'radial-gradient(rgba(212,175,55,0.16) 1px, transparent 1.6px) 0 0 / 18px 18px, linear-gradient(180deg, #96291F 0%, #7A1F17 55%, #5E150F 100%)',
        boxShadow: left ? 'inset -10px 0 24px rgba(0,0,0,0.35)' : 'inset 10px 0 24px rgba(0,0,0,0.35)',
      }}
      initial={false}
      animate={opening ? (reduce ? { opacity: 0 } : { rotateY: left ? -108 : 108 }) : { rotateY: 0, opacity: 1 }}
      transition={{ duration: reduce ? 0.6 : 1.7, ease: EASE, delay: reduce ? 0 : 0.35 }}
      onAnimationComplete={() => opening && onDone?.()}
    >
      {/* Gold seam where the leaves meet */}
      <span className={`absolute inset-y-0 w-[3px] bg-gradient-to-b from-gold-dark via-gold-light to-gold-dark ${left ? 'right-0' : 'left-0'}`} />

      {/* Tall arched panel */}
      <div className={`absolute top-[7%] h-[58%] w-[72%] ${left ? 'right-[11%]' : 'left-[11%]'} rounded-t-[999px] border-2 border-gold/70 p-2`}>
        <div className="h-full w-full rounded-t-[999px] border border-gold/40 bg-[radial-gradient(ellipse_at_50%_30%,rgba(230,126,34,0.22),transparent_70%)]" />
      </div>

      {/* Lower panel with brass studs */}
      <div className={`absolute bottom-[6%] h-[22%] w-[72%] ${left ? 'right-[11%]' : 'left-[11%]'} rounded-md border-2 border-gold/70 p-3`}>
        <Studs cols={3} rows={3} className="h-full w-full gap-2" />
      </div>

      {/* Ring handle near the meeting edge */}
      <div className={`absolute top-[66%] flex flex-col items-center ${left ? 'right-[4%]' : 'left-[4%]'}`}>
        <span className="h-3 w-3 rounded-full bg-gold shadow" />
        <span className="-mt-1 h-7 w-7 rounded-full border-[3px] border-gold-light/90 shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
      </div>
    </motion.div>
  );
}

/**
 * Closed temple doors that greet the guest (by name, on a personal link).
 * Tapping "Open the Invitation" swings them open, which is also the gesture
 * browsers require before music may play.
 */
export default function OpeningGate({ wedding, guest, onOpen, onDone }) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const doneRef = useRef(false);
  const buttonRef = useRef(null);
  const [first, second] = wedding.couples;

  useEffect(() => {
    lockScroll(true);
    buttonRef.current?.focus({ preventScroll: true });
    return () => lockScroll(false);
  }, []);

  const open = (withMusic) => {
    if (opening) return;
    setOpening(true);
    onOpen(withMusic);
  };

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className="fixed inset-0 z-[60] overflow-hidden overscroll-none"
      style={{ perspective: '1600px' }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
    >
      <Door side="left" opening={opening} reduce={reduce} onDone={finish} />
      <Door side="right" opening={opening} reduce={reduce} />

      {/* Toran over the doorway */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[clamp(84px,12.5vw,170px)]"
        animate={opening ? { y: '-110%', opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
        aria-hidden="true"
      >
        <Toran className="h-full w-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]" animate={!reduce} />
      </motion.div>

      {/* Greeting (scrolls on very short screens rather than being cut off) */}
      <motion.div
        className="absolute inset-0 z-20 flex flex-col overflow-y-auto overscroll-contain px-5 pb-[3svh] pt-[clamp(72px,12svh,170px)] text-center"
        initial={{ opacity: 0, y: 14 }}
        animate={opening ? { opacity: 0, scale: 1.04 } : { opacity: 1, y: 0 }}
        transition={{ duration: opening ? 0.45 : 1, ease: [0.22, 1, 0.36, 1], delay: opening ? 0 : 0.2 }}
      >
        <div className="m-auto flex w-full max-w-[22rem] flex-col items-center rounded-[2rem] border border-gold/50 bg-[rgba(52,12,9,0.84)] px-5 py-6 shadow-[0_0_0_6px_rgba(52,12,9,0.35),0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-[3px] sm:max-w-md sm:px-10 sm:py-8 lg:max-w-xl lg:px-14 lg:py-10">
          <LanguageSwitcher tone="dark" />

          <OmMedallion className="mt-5 h-[clamp(3.25rem,7svh,4rem)] w-[clamp(3.25rem,7svh,4rem)] drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)] sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
          {wedding.invocation && (
            <p dir="ltr" className="mt-3 font-display text-base font-semibold tracking-[0.12em] text-gold-light sm:text-lg">
              {wedding.invocation}
            </p>
          )}

          <div id="gate-title" className="flex flex-col items-center">
            {guest && (
              <>
                <p className="mt-5 font-display text-xl italic text-gold-light/95 sm:text-2xl lg:text-3xl">{t('gateDear')}</p>
                <p className="mt-1 max-w-[16ch] font-display text-[clamp(2rem,9vw,4rem)] font-semibold leading-[1.1] text-ivory [text-wrap:balance]">
                  <bdi>{guest.to}</bdi>
                  {t('comma').trim()}
                </p>
              </>
            )}
            {t('gateBefore') && (
              <p className={`${guest ? 'mt-4' : 'mt-6'} max-w-xs font-display text-lg leading-snug text-ivory/90 sm:max-w-sm sm:text-xl lg:max-w-md lg:text-2xl`}>
                {t('gateBefore')}
              </p>
            )}

            <p dir="ltr" className="mt-4 font-display text-[clamp(1.5rem,6vw,2.6rem)] font-semibold leading-tight text-gold-light">
              {first.groom} <span className="italic text-saffron-light">&amp;</span> {first.bride}
            </p>
            <p className="font-display text-lg italic text-gold-light/80 lg:text-xl">{t('gateAnd')}</p>
            <p dir="ltr" className="font-display text-[clamp(1.5rem,6vw,2.6rem)] font-semibold leading-tight text-gold-light">
              {second.groom} <span className="italic text-saffron-light">&amp;</span> {second.bride}
            </p>

            {t('gateAfter') && (
              <p className="mt-3 max-w-xs font-display text-lg leading-snug text-ivory/90 sm:max-w-sm sm:text-xl lg:max-w-md lg:text-2xl">{t('gateAfter')}</p>
            )}
          </div>

          <Ornament className="mt-5 h-3 w-44" />
          <p className="mt-3 font-sans text-xs font-semibold uppercase tracking-[0.24em] text-ivory/85 sm:text-[13px]">
            {wedding.location.split(/[,،]/)[0]} · {wedding.dates}
          </p>

          <button
            ref={buttonRef}
            type="button"
            onClick={() => open(true)}
            className="group relative mt-7 inline-flex items-center gap-3 rounded-full bg-ivory px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-crimson shadow-[0_0_0_3px_rgba(212,175,55,0.75),0_14px_34px_rgba(0,0,0,0.45)] transition hover:bg-gold-pale focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-light lg:px-10"
          >
            {!reduce && (
              <span
                className="pointer-events-none absolute inset-0 animate-ping rounded-full border-2 border-gold-light/70 [animation-duration:2.4s] [animation-fill-mode:both] [animation-iteration-count:4]"
                aria-hidden="true"
              />
            )}
            {t('gateOpen')}
          </button>
          <p className="mt-3 font-sans text-[13px] leading-relaxed text-ivory/80">
            <span aria-hidden="true">♪ </span>
            {t('gateMusic')} ·{' '}
            <button
              type="button"
              onClick={() => open(false)}
              className="underline decoration-gold/60 underline-offset-4 hover:text-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-light"
            >
              {t('gateSilent')}
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
