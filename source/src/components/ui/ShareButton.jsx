import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../i18n';

/** Where the invitation lives online. Used when the page is opened from a file on disk. */
const PUBLIC_URL = import.meta.env.VITE_SITE_URL || 'https://gulshan-kumar-ai.github.io/wed/';

function shareUrl() {
  if (typeof window === 'undefined' || !/^https?:$/.test(window.location.protocol)) return PUBLIC_URL;
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
 * compact: icon-only button that opens the phone's share sheet (or copies the link).
 * inline: with compact, sits in the flow (the quick-nav dock) instead of floating.
 * Otherwise: a labelled button with a menu (share sheet, WhatsApp, Facebook, Instagram, copy).
 */
export default function ShareButton({ wedding, compact = false, inline = false }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(null); // 'copied' | 'instagram'
  const wrapRef = useRef(null);
  const { t } = useLanguage();
  const [first, second] = wedding.couples;
  const url = shareUrl();
  const text = `${wedding.subtitle} · ${first.groom} & ${first.bride} · ${second.groom} & ${second.bride}\n${wedding.location} · ${wedding.dates}`;

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
    if (!navigator.share) return copy();
    try {
      await navigator.share({ title: wedding.subtitle, text, url });
    } catch (error) {
      if (error?.name !== 'AbortError' && !compact) setOpen(true);
    }
    return undefined;
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noopener,noreferrer');
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  // Instagram has no way to receive a link from a web page, so copy it and say so
  const shareInstagram = async () => {
    await copy('instagram');
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  const base =
    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start font-sans text-sm font-medium text-charcoal transition hover:bg-gold-pale focus:outline-none focus-visible:bg-gold-pale';

  if (compact) {
    return (
      <div className={inline ? 'relative' : 'fixed bottom-5 right-4 z-40 sm:hidden'}>
        <button
          type="button"
          onClick={nativeShare}
          aria-label={note ? t('copied') : t('share')}
          className={
            inline
              ? 'flex h-10 w-10 items-center justify-center rounded-full text-crimson transition hover:bg-gold-pale focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron'
              : 'flex h-12 w-12 items-center justify-center rounded-full border border-gold/70 bg-ivory text-crimson shadow-[0_8px_24px_rgba(44,34,30,0.22)]'
          }
        >
          {note ? <CheckIcon /> : <ShareIcon />}
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-gold/70 px-5 py-2.5 font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-light transition hover:border-gold-light hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <ShareIcon />
        <span>{note === 'copied' ? t('copied') : t('share')}</span>
      </button>

      <p role="status" className="absolute left-1/2 top-full mt-2 w-max max-w-[16rem] -translate-x-1/2 font-sans text-[13px] text-gold-light">
        {note === 'instagram' ? t('instagramCopied') : ''}
      </p>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-xl border border-gold/60 bg-ivory p-1.5 shadow-[0_18px_40px_rgba(44,34,30,0.28)]"
          >
            {typeof navigator !== 'undefined' && navigator.share && (
              <button type="button" className={base} onClick={nativeShare}>
                <span className="w-5 text-center text-lg" aria-hidden="true">↗</span>
                {t('shareNative')}
              </button>
            )}
            <button type="button" className={base} onClick={shareWhatsApp}>
              <span className="w-5 text-center font-semibold text-[#1F7A4D]" aria-hidden="true">WA</span>
              WhatsApp
            </button>
            <button type="button" className={base} onClick={shareFacebook}>
              <span className="w-5 text-center font-semibold text-[#1877F2]" aria-hidden="true">f</span>
              Facebook
            </button>
            <button type="button" className={base} onClick={shareInstagram}>
              <span className="w-5 text-center font-semibold text-[#D62976]" aria-hidden="true">◎</span>
              {t('instagram')}
            </button>
            <button type="button" className={base} onClick={() => copy()}>
              <span className="w-5 text-center" aria-hidden="true">⧉</span>
              {note === 'copied' ? t('copied') : t('copyLink')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
