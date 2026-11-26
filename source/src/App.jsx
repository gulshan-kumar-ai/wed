import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import HeroScene from './components/hero/HeroScene';
import GardenCourtyardScene from './components/garden/GardenCourtyardScene';
import MandapPassage from './components/mandap/MandapPassage';
import CouplesSection from './components/couples/CouplesSection';
import EventsSection from './components/events/EventsSection';
import VenuesSection from './components/venues/VenuesSection';
import RSVPSection from './components/rsvp/RSVPSection';
import GuestGuide from './components/guide/GuestGuide';
import FinaleScene from './components/finale/FinaleScene';
import Footer from './components/layout/Footer';
import TopBar from './components/ui/TopBar';
import QuickNav from './components/ui/QuickNav';
import OpeningGate from './components/intro/OpeningGate';
import WelcomeBack from './components/intro/WelcomeBack';
import { jumpToY, scrollToSection, useSmoothScroll } from './hooks/useSmoothScroll';
import { wedding } from './config/wedding';
import { localizeWedding } from './config/wedding.i18n';
import { LanguageProvider, useLanguage } from './i18n';
import { AudioProvider, useAudio } from './audio';
import { IntroContext } from './intro';
import { getBoot, markOpened } from './guest';
import { logVisit } from './analytics';

function AppContent() {
  useSmoothScroll();
  const { t, language } = useLanguage();
  const audio = useAudio();
  const boot = getBoot(wedding.rsvp.maxGuests);
  const { guest } = boot;
  // The wedding details in the chosen language (English is the base in wedding.js)
  const w = useMemo(() => localizeWedding(wedding, language), [language]);

  const [gate, setGate] = useState(boot.showGate);
  const [opened, setOpened] = useState(!boot.showGate);
  const [welcome, setWelcome] = useState(boot.returning);
  const pendingHash = useRef(boot.hash);

  // Returning guests (or #section links) start where they need to be, before the first paint
  useLayoutEffect(() => {
    if (boot.showGate) return;
    const target = pendingHash.current ?? (boot.returning ? 'invitation' : null);
    pendingHash.current = null;
    if (target) scrollToSection(target, { immediate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count this visit in the family's Google Sheet (once per visit, only when a Sheet is connected)
  useEffect(() => {
    logVisit({ guest, language });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openInvitation = (withMusic) => {
    if (withMusic && !audio.playing) audio.play();
    markOpened(guest);
    // Behind the closed doors, so the jump is never seen
    const target = pendingHash.current;
    pendingHash.current = null;
    if (target) scrollToSection(target, { immediate: true });
    else jumpToY(0);
    setOpened(true);
  };

  const replay = () => {
    setWelcome(false);
    setOpened(false);
    setGate(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={{ opened, guest }}>
        <TopBar wedding={w} />
        <main className="overflow-x-clip">
          {/* Phase 1 · Temple courtyard → doorway light */}
          <HeroScene wedding={w} />
          {/* Phase 2 · Garden courtyard + formal invitation, mandap passage (with the twins' story), couples */}
          <GardenCourtyardScene wedding={w} />
          <MandapPassage
            eyebrow={t('meetEyebrow')}
            title={t('meetTitle')}
            story={w.twinStory}
            storyBy={`${t('twins')} · ${w.couples[0].groom} & ${w.couples[1].groom}`}
          />
          <CouplesSection wedding={w} />
          {/* Phase 3 · Timeline, venues, RSVP */}
          <EventsSection wedding={w} />
          <VenuesSection wedding={w} />
          <RSVPSection wedding={w} guest={guest} />
          {/* Phase 4 · Guest guide, lotus-pond finale with countdown */}
          <GuestGuide wedding={w} />
          <FinaleScene wedding={w} />
        </main>
        <Footer wedding={w} />
        {!gate && <QuickNav />}
        {welcome && !gate && <WelcomeBack guest={guest} onReplay={replay} />}
        <AnimatePresence>
          {gate && <OpeningGate key="gate" wedding={w} guest={guest} onOpen={openInvitation} onDone={() => setGate(false)} />}
        </AnimatePresence>
      </IntroContext.Provider>
    </MotionConfig>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AudioProvider src={wedding.music.src} volume={wedding.music.volume} title={wedding.music.credit?.title} artist={wedding.music.credit?.artist}>
        <AppContent />
      </AudioProvider>
    </LanguageProvider>
  );
}
