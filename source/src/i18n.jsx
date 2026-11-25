import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
