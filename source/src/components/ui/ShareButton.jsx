import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../i18n';

/** The invitation's own address, or the published one when the page was opened from a file on disk. */
function shareUrl(siteUrl) {
  const published = `${(import.meta.env.VITE_SITE_URL || siteUrl || '').replace(/\/+$/, '')}/`;
  if (typeof window === 'undefined' || !/^https?:$/.test(window.location.protocol)) return published;
  return `${window.location.origin}${window.location.pathname}`;
}

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path d="M12 16V3m0 0L7 8m5-5l5 5M5 12v7h14v-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    document.execCommand('copy');
    field.remove();
  }
}

/**
 * variant="bar": round icon button in the top bar. On phones it opens the share
 *   sheet straight away; elsewhere a menu drops down below it.
 * variant="footer": labelled button whose menu opens upwards.
 * The menu offers the share sheet (when the device has one), WhatsApp, Facebook,
 * Instagram (copies the link, since Instagram cannot receive one) and Copy link.
 */
export default function ShareButton({ wedding, variant = 'footer' }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(null); // 'copied' | 'instagram'
  const wrapRef = useRef(null);
  const { t } = useLanguage();
  const bar = variant === 'bar';
  const [first, second] = wedding.couples;
  const url = shareUrl(wedding.siteUrl);
  const text = `${wedding.subtitle} · ${first.groom} & ${first.bride} · ${second.groom} & ${second.bride}\n${wedding.location} · ${wedding.dates}`;
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  useEffect(() => {
    if (!note) return undefined;
    const id = window.setTimeout(() => setNote(null), 2600);
    return () => window.clearTimeout(id);
  }, [note]);

  const copy = async (kind = 'copied') => {
    await copyText(`${text}\n${url}`);
    setNote(kind);
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: wedding.subtitle, text, url });
    } catch (error) {
      if (error?.name !== 'AbortError') setOpen(true);
    }
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noopener,noreferrer');
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  const shareInstagram = async () => {
    await copy('instagram');
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  // On a phone the top-bar button goes straight to the share sheet
  const onButton = () => (bar && canShare && window.matchMedia('(pointer: coarse)').matches ? nativeShare() : setOpen((v) => !v));

  const item =
    'flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start font-sans text-sm font-medium text-charcoal transition hover:bg-gold-pale focus:outline-none focus-visible:bg-gold-pale';

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={onButton}
        aria-expanded={open}
        aria-label={bar ? (note === 'copied' ? t('copied') : t('share')) : undefined}
        className={
          bar
            ? 'flex h-12 w-12 items-center justify-center rounded-full border border-gold/70 bg-ivory/95 text-crimson shadow-[0_4px_24px_rgba(169,50,38,0.18)] transition-colors md:bg-ivory/75 md:backdrop-blur-md hover:bg-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron'
            : 'inline-flex min-h-[44px] items-center gap-2 rounded-full border border-gold/70 px-5 py-2.5 font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-light transition hover:border-gold-light hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold'
        }
      >
        {bar && note ? <CheckIcon /> : <ShareIcon />}
        {!bar && <span>{note === 'copied' ? t('copied') : t('share')}</span>}
      </button>

      <AnimatePresence>
        {note === 'instagram' && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: bar ? -4 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute z-30 w-max max-w-[16rem] rounded-lg bg-charcoal/90 px-3 py-2 font-sans text-[13px] text-ivory shadow-lg ${
              bar ? 'right-0 top-full mt-2' : 'left-1/2 top-full mt-2 -translate-x-1/2'
            }`}
          >
            {t('instagramCopied')}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: bar ? -8 : 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: bar ? -8 : 8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className={`absolute z-30 w-64 rounded-xl border border-gold/60 bg-ivory p-1.5 shadow-[0_18px_40px_rgba(44,34,30,0.28)] ${
              bar ? 'right-0 top-full mt-2' : 'bottom-full left-1/2 mb-2 -translate-x-1/2'
            }`}
          >
            {canShare && (
              <button type="button" className={item} onClick={nativeShare}>
                <span className="w-5 text-center text-lg" aria-hidden="true">↗</span>
                {t('shareNative')}
              </button>
            )}
            <button type="button" className={item} onClick={shareWhatsApp}>
              <span className="w-5 text-center font-semibold text-[#1F7A4D]" aria-hidden="true">WA</span>
              WhatsApp
            </button>
            <button type="button" className={item} onClick={shareFacebook}>
              <span className="w-5 text-center font-semibold text-[#1877F2]" aria-hidden="true">f</span>
              Facebook
            </button>
            <button type="button" className={item} onClick={shareInstagram}>
              <span className="w-5 text-center font-semibold text-[#D62976]" aria-hidden="true">◎</span>
              {t('instagram')}
            </button>
            <button type="button" className={item} onClick={() => copy()}>
              <span className="w-5 text-center" aria-hidden="true">⧉</span>
              {note === 'copied' ? t('copied') : t('copyLink')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
