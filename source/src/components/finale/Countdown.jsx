import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
    <div className="countdown-unit flex min-w-0 flex-col items-center rounded-2xl border border-gold/60 bg-[rgba(18,19,46,0.55)] px-2 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:px-5 sm:py-4">
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
      <span className="countdown-label mt-2 font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-ivory sm:text-[11px] sm:tracking-[0.28em]">{label}</span>
    </div>
  );
}

/** Live Days : Hours : Minutes : Seconds countdown to `target` (ISO date with offset). */
export default function Countdown({ target, arrivedMessage }) {
  const [t, setT] = useState(() => remaining(target));

  useEffect(() => {
    const id = setInterval(() => setT(remaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (t.done) {
    return <p className="font-display text-[clamp(1.6rem,4vw,2.4rem)] italic text-gold-light">{arrivedMessage}</p>;
  }

  const date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Karachi' }).format(new Date(target));

  return (
    <div role="timer" aria-label={`Countdown to ${date}`} className="w-full">
      <div className="mx-auto grid max-w-2xl grid-cols-4 gap-2 sm:gap-4" aria-hidden="true">
        <Unit value={t.days} label="Days" pad={t.days > 99 ? 3 : 2} />
        <Unit value={t.hours} label="Hours" />
        <Unit value={t.minutes} label="Minutes" />
        <Unit value={t.seconds} label="Seconds" />
      </div>
      <p className="sr-only">
        {t.days} days, {t.hours} hours and {t.minutes} minutes to go.
      </p>
    </div>
  );
}
