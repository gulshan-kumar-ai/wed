import { createContext, useContext } from 'react';
import { useAmbientAudio } from './hooks/useAmbientAudio';

const AudioCtx = createContext(null);

/** One ambient-music player for the whole page, so the opening doors and the toggle share it. */
export function AudioProvider({ src, volume, title, artist, children }) {
  const audio = useAmbientAudio({ src, volume, title, artist });
  return <AudioCtx.Provider value={audio}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
