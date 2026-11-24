import { createContext, useContext, useEffect, useState } from 'react';

const translations = {
  en: {
    musicOn: 'Tradition on', musicOff: 'Music', scroll: 'Scroll to Enter',
    meetEyebrow: 'Two brothers · Two brides', meetTitle: 'Meet the Couples',
    twins: 'The twins', sonOf: 'Son of', with: 'with', daughterOf: 'Daughter of',
    celebrationsEyebrow: 'The celebrations', celebrationsTitle: 'Wedding Festivities',
    celebrationsIntro: 'Three days of rituals, music and blessings in Kunri. All times are Pakistan Standard Time.',
    ceremony: 'Ceremony', date: 'Date', time: 'Time', route: 'Route', venue: 'Venue', muhurat: 'Muhurat', dressCode: 'Dress code',
    saveCalendar: 'Save to Calendar', googleCalendar: 'Google Calendar', appleOutlook: 'Apple / Outlook (.ics)',
    travelling: 'Travelling to Kunri', venuesTitle: 'Venues & Directions', venuesIntro: 'Everything you need to find your way around Kunri, District Umerkot, during the celebrations.',
    directions: 'Get Directions', openMaps: 'Open in Maps', rsvpEyebrow: 'RSVP', rsvpTitle: 'Confirm Your Presence',
    share: 'Share Invitation', shareNative: 'Share', copyLink: 'Copy Link', copied: 'Link Copied',
  },
  ur: {
    musicOn: 'روایتی موسیقی', musicOff: 'موسیقی', scroll: 'ذرا نیچے دیکھیں',
    meetEyebrow: 'دو بھائی · دو دلھنیں', meetTitle: 'جوڑے سے ملیں',
    twins: 'جڑواں بھائی', sonOf: 'فرزندِ', with: 'کے ساتھ', daughterOf: 'دخترِ',
    celebrationsEyebrow: 'جشن', celebrationsTitle: 'شادی کی تقریبات',
    celebrationsIntro: 'کنری میں رسومات، موسیقی اور دعاؤں کے تین دن۔ تمام وقت پاکستان سٹینڈرڈ ٹائم کے مطابق ہے۔',
    ceremony: 'تقریب', date: 'تاریخ', time: 'وقت', route: 'راستہ', venue: 'جگہ', muhurat: 'مہورت', dressCode: 'لباس',
    saveCalendar: 'کیلنڈر میں محفوظ کریں', googleCalendar: 'گوگل کیلنڈر', appleOutlook: 'ایپل / آؤٹ لک (.ics)',
    travelling: 'کنری کا سفر', venuesTitle: 'جگہیں اور راستے', venuesIntro: 'تقاریب کے دوران کنری، ضلع عمرکوٹ میں آنے کے لیے ضروری معلومات۔',
    directions: 'راستہ دیکھیں', openMaps: 'نقشوں میں کھولیں', rsvpEyebrow: 'جواب', rsvpTitle: 'اپنی حاضری کی تصدیق کریں',
    share: 'دعوت نامہ شیئر کریں', shareNative: 'شیئر کریں', copyLink: 'لنک کاپی کریں', copied: 'لنک کاپی ہو گیا',
  },
  sd: {
    musicOn: 'روايتي موسيقي', musicOff: 'موسيقي', scroll: 'هيٺ ڏسو',
    meetEyebrow: 'ٻه ڀائرَ · ٻه ڌيءَ', meetTitle: 'جوڙو ملاقات',
    twins: 'جمڻن ڀائر', sonOf: 'پٽ', with: 'سان', daughterOf: 'ڌِيءَ',
    celebrationsEyebrow: 'جشن', celebrationsTitle: 'شادي جون تقريبون',
    celebrationsIntro: 'کنري ۾ رسمون، موسيقي ۽ دعائون ٽي ڏينهون۔ سڀ وقت پاڪستان اسٽينڊرد ٽائم موجب آهن.',
    ceremony: 'تقريب', date: 'تاريخ', time: 'وقت', route: 'رستو', venue: 'مقام', muhurat: 'مہورت', dressCode: 'لباس',
    saveCalendar: 'ڪلينڊر ۾ محفوظ ڪيو', googleCalendar: 'گوگل ڪلينڊر', appleOutlook: 'ايپل / آئوٽ لک (.ics)',
    travelling: 'کنري جو سفر', venuesTitle: 'مقام ۽ رستا', venuesIntro: 'تقريبن دوران کنري، ضلع عمرڪوٽ وٺي وڃڻ لاءِ ضروري معلومات.',
    directions: 'رستو ڏسو', openMaps: 'نقشي ۾ کوليو', rsvpEyebrow: 'جواب', rsvpTitle: 'پاڻ جي حاضري تصديق ڪريو',
    share: 'دعوت شيئر ڪريو', shareNative: 'شيئر', copyLink: 'لنک نقل ڪريو', copied: 'لنک نقل ٿي ويو',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('wedding-language') || 'en');

  useEffect(() => {
    localStorage.setItem('wedding-language', language);
    document.documentElement.lang = language === 'en' ? 'en' : language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  const value = {
    language,
    languageCode: language,
    setLanguage,
    t: (key) => key === 'languageCode' ? language : translations[language]?.[key] || translations.en[key] || key,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function coupleWeds(t) {
  const language = t('languageCode');
  return language === 'ur' ? 'شادی' : language === 'sd' ? 'شادي' : 'weds';
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const options = [
    ['en', 'EN'],
    ['ur', 'اردو'],
    ['sd', 'سنڌي'],
  ];

  return (
    <div className="inline-flex rounded-full border border-gold/70 bg-ivory/90 p-1 shadow-[0_4px_24px_rgba(169,50,38,0.14)]" aria-label="Language">
      {options.map(([code, label]) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={language === code}
          onClick={() => setLanguage(code)}
          className={`min-w-12 rounded-full px-3 py-2 font-sans text-[11px] font-semibold transition ${language === code ? 'bg-crimson text-white shadow-sm' : 'text-charcoal hover:bg-gold-pale'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
