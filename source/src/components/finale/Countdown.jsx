import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../i18n';
import { formatDay, formatTime } from '../events/calendar';

function remaining(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    done: ms === 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function Unit({ value, label, pad = 2 }) {
  const text = String(value).padStart(pad, '0');
  return (
    <div className="countdown-unit flex min-w-0 flex-col items-center rounded-2xl border border-gold/60 bg-[rgba(18,19,46,0.55)] px-1.5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:px-5 sm:py-4">
      <span className="relative flex h-[1.1em] items-center justify-center overflow-hidden font-display text-[clamp(2rem,8vw,3.75rem)] font-semibold leading-none tabular-nums text-gold-light">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: '-60%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '60%', opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="countdown-label mt-2 max-w-full truncate font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ivory sm:text-[13px] sm:tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}

/** Live Days : Hours : Minutes : Seconds countdown to `target` (ISO date with offset). */
export default function Countdown({ target, arrivedMessage, timeZone = 'Asia/Karachi' }) {
  const [left, setLeft] = useState(() => remaining(target));
  const { t, language } = useLanguage();

  useEffect(() => {
    const id = setInterval(() => setLeft(remaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (left.done) {
    return <p className="font-display text-[clamp(1.6rem,4vw,2.4rem)] italic text-gold-light">{arrivedMessage}</p>;
  }

  const when = `${formatDay(target, timeZone, language)}${t('comma')}${formatTime(target, timeZone, language)}`;

  return (
    <div role="timer" aria-label={t('countdownTo', { date: when })} className="w-full">
      <div className="mx-auto grid max-w-2xl grid-cols-4 gap-2 sm:gap-4" aria-hidden="true">
        <Unit value={left.days} label={t('days')} pad={left.days > 99 ? 3 : 2} />
        <Unit value={left.hours} label={t('hours')} />
        <Unit value={left.minutes} label={t('minutes')} />
        <Unit value={left.seconds} label={t('seconds')} />
      </div>
      <p className="sr-only">{t('countdownLeft', { d: left.days, h: left.hours, m: left.minutes })}</p>
    </div>
  );
}
