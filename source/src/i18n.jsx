import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LANGUAGES, strings } from './strings';

const STORAGE_KEY = 'wedding-language';
const CODES = LANGUAGES.map((l) => l.code);

function initialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (CODES.includes(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  // First visit: follow the phone's language if it is Urdu or Sindhi
  const preferred = (navigator.languages || [navigator.language || 'en']).map((l) => l.slice(0, 2).toLowerCase());
  return preferred.find((l) => CODES.includes(l)) ?? 'en';
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage);
  const meta = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* storage unavailable */
    }
    document.documentElement.lang = language;
    document.documentElement.dir = meta.dir;
  }, [language, meta.dir]);

  /** t('key') or t('key', { name: 'Payal' }) for strings with {placeholders}. Falls back to English. */
  const t = useCallback(
    (key, vars) => {
      const s = strings[language]?.[key] ?? strings.en[key] ?? key;
      return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m)) : s;
    },
    [language],
  );

  const value = useMemo(() => ({ language, dir: meta.dir, rtl: meta.dir === 'rtl', setLanguage, t }), [language, meta.dir, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

/** English · اردو · سنڌي. `tone="dark"` for use on the crimson opening doors. */
export function LanguageSwitcher({ tone = 'light', className = '' }) {
  const { language, setLanguage, t } = useLanguage();
  const dark = tone === 'dark';

  return (
    <div
      role="group"
      aria-label={t('languageLabel')}
      className={`inline-flex rounded-full border p-1 ${
        dark ? 'border-gold/60 bg-black/25' : 'border-gold/70 bg-ivory/90 shadow-[0_4px_24px_rgba(169,50,38,0.14)]'
      } ${className}`}
    >
      {LANGUAGES.map(({ code, label }) => {
        const selected = language === code;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={selected}
            onClick={() => setLanguage(code)}
            className={`min-w-[3.5rem] rounded-full px-3.5 py-2 font-sans text-[13px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
              selected
                ? dark
                  ? 'bg-ivory text-crimson shadow-sm'
                  : 'bg-crimson text-white shadow-sm'
                : dark
                  ? 'text-ivory/90 hover:bg-white/10'
                  : 'text-charcoal hover:bg-gold-pale'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Compact language button for the top bar: shows the current language, opens the full list. */
export function LanguageMenu() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const escape = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${t('languageLabel')}: ${current.label}`}
        className="flex h-12 items-center gap-1.5 rounded-full border border-gold/70 bg-ivory/75 px-3.5 text-crimson shadow-[0_4px_24px_rgba(169,50,38,0.18)] backdrop-blur-md transition-colors hover:bg-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
      >
        <GlobeIcon />
        <span lang={current.code} className="font-sans text-[13px] font-semibold text-charcoal">
          {current.short}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full z-30 mt-2 w-44 rounded-xl border border-gold/60 bg-ivory p-1.5 shadow-[0_18px_40px_rgba(44,34,30,0.24)]"
          >
            {LANGUAGES.map(({ code, label }) => {
              const selected = code === language;
              return (
                <li key={code}>
                  <button
                    type="button"
                    lang={code}
                    aria-pressed={selected}
                    onClick={() => {
                      setLanguage(code);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 font-sans text-[15px] font-semibold transition focus:outline-none focus-visible:bg-gold-pale ${
                      selected ? 'bg-crimson/10 text-crimson' : 'text-charcoal hover:bg-gold-pale'
                    }`}
                  >
                    {label}
                    {selected && (
                      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                        <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
