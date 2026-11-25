import { motion } from 'framer-motion';
import { LanguageMenu } from '../../i18n';
import ShareButton from './ShareButton';
import MusicToggle from './MusicToggle';

/**
 * The controls that stay on screen: language, share and music, together in the
 * top corner where they never sit on top of the invitation's content.
 */
export default function TopBar({ wedding }) {
  return (
    <motion.div
      className="fixed right-3 top-3 z-50 flex items-center gap-2 sm:right-6 sm:top-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.8 }}
    >
      <LanguageMenu />
      <ShareButton wedding={wedding} variant="bar" />
      <MusicToggle />
    </motion.div>
  );
}
