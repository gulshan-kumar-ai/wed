import { MotionConfig } from 'framer-motion';
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
import MusicToggle from './components/ui/MusicToggle';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { wedding } from './config/wedding';
import { LanguageProvider, useLanguage } from './i18n';
import ShareButton from './components/ui/ShareButton';

function AppContent() {
  useSmoothScroll();
  const { t } = useLanguage();

  return (
      <MotionConfig reducedMotion="user">
      <MusicToggle src={wedding.music.src} volume={wedding.music.volume} />
      <ShareButton wedding={wedding} compact />
      <main className="overflow-x-clip">
        {/* Phase 1 · Temple courtyard → doorway light */}
        <HeroScene wedding={wedding} />
        {/* Phase 2 · Garden courtyard + formal invitation, mandap passage, couples */}
        <GardenCourtyardScene wedding={wedding} />
        <MandapPassage eyebrow={t('meetEyebrow')} title={t('meetTitle')} />
        <CouplesSection wedding={wedding} />
        {/* Phase 3 · Timeline, venues, RSVP */}
        <EventsSection wedding={wedding} />
        <VenuesSection wedding={wedding} />
        <RSVPSection wedding={wedding} />
        {/* Phase 4 · Guest guide, lotus-pond finale with countdown */}
        <GuestGuide wedding={wedding} />
        <FinaleScene wedding={wedding} />
      </main>
      <Footer wedding={wedding} />
      </MotionConfig>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
