import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../i18n';

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

/**
 * compact: icon-only button that opens the phone's share sheet (or copies the link).
 * inline: with compact, sits in the flow (the quick-nav dock) instead of floating.
 */
export default function ShareButton({ wedding, compact = false, inline = false }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef(null);
  const { t } = useLanguage();
  const first = wedding.couples[0];
  const second = wedding.couples[1];
  const url = typeof window !== 'undefined' ? window.location.href.split('#')[0].split('?')[0] : 'https://gulshan-kumar-ai.github.io/wed/';
  const text = `A Double Royal Union · ${first.groom} & ${first.bride} · ${second.groom} & ${second.bride}\n${wedding.location} · ${wedding.dates}`;

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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
    } catch {
      const field = document.createElement('textarea');
      field.value = `${text}\n${url}`;
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const nativeShare = async () => {
    if (!navigator.share) return copy();
    try {
      await navigator.share({ title: 'A Double Royal Union', text, url });
    } catch (error) {
      if (error?.name !== 'AbortError') setOpen(true);
    }
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noopener,noreferrer');
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  const openInstagram = () => window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');

  const base = 'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-sans text-sm font-medium text-charcoal transition hover:bg-gold-pale focus:outline-none focus-visible:bg-gold-pale';

  return (
    <div ref={wrapRef} className={compact ? (inline ? 'relative' : 'fixed bottom-5 right-4 z-40 sm:hidden') : 'relative inline-block'}>
      <button
        type="button"
        onClick={() => (compact ? nativeShare() : setOpen((value) => !value))}
        aria-expanded={!compact ? open : undefined}
        aria-label={compact && copied ? t('copied') : t('share')}
        className={compact
          ? inline
            ? 'flex h-10 w-10 items-center justify-center rounded-full text-crimson transition hover:bg-gold-pale focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron'
            : 'flex h-12 w-12 items-center justify-center rounded-full border border-gold/70 bg-ivory text-crimson shadow-[0_8px_24px_rgba(44,34,30,0.22)]'
          : 'inline-flex items-center gap-2 rounded-full border border-gold/70 px-5 py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-gold-light transition hover:border-gold-light hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold'}
      >
        {compact && copied ? <CheckIcon /> : <ShareIcon />}
        {!compact && <span>{copied ? t('copied') : t('share')}</span>}
      </button>

      {!compact && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.16 }}
              className="absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-xl border border-gold/60 bg-ivory p-1.5 shadow-[0_18px_40px_rgba(44,34,30,0.28)]"
            >
              <button type="button" className={base} onClick={nativeShare}><span className="text-lg">↗</span>{t('shareNative')}</button>
              <button type="button" className={base} onClick={shareWhatsApp}><span className="font-semibold text-[#25D366]">WA</span>WhatsApp</button>
              <button type="button" className={base} onClick={shareFacebook}><span className="font-semibold text-[#1877F2]">f</span>Facebook</button>
              <button type="button" className={base} onClick={openInstagram}><span className="font-semibold text-[#D62976]">◎</span>Instagram</button>
              <button type="button" className={base} onClick={copy}><span aria-hidden="true">⧉</span>{copied ? t('copied') : t('copyLink')}</button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
