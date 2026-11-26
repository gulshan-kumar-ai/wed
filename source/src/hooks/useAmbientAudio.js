import { useCallback, useEffect, useRef, useState } from 'react';

const FADE_MS = 1200;
const DRONE_VOLUME = 0.32;

/**
 * Background music that behaves on phones.
 *
 * · Music only starts from a tap (the opening doors or the music button), and
 *   everything that makes sound is started synchronously inside that tap,
 *   because iPhones refuse sound that starts later.
 * · The recording at `src` plays through an <audio> element, which iPhones play
 *   even with the ring/silent switch on. The file itself is mastered soft,
 *   because iPhones ignore volume changes from web pages; elsewhere it fades.
 * · If the file is missing or cannot play, a gentle synthesized tanpura drone
 *   takes over, through an AudioContext that was unlocked in the same tap.
 * · Music pauses while the guest is in another app or tab (e.g. sending their
 *   RSVP on WhatsApp) and carries on when they come back.
 */
export function useAmbientAudio({ src, volume = 0.8, title, artist }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const ctxRef = useRef(null);
  const droneRef = useRef(null);
  const modeRef = useRef(src ? 'file' : 'drone');
  const wantRef = useRef(false); // the guest has asked for music
  const fadeRef = useRef(null);
  const volumeWorks = useRef(null);

  /** iPhones always report volume 1 and ignore changes; there we skip fades. */
  const canSetVolume = (audio) => {
    if (volumeWorks.current == null) {
      const before = audio.volume;
      audio.volume = 0.5;
      volumeWorks.current = Math.abs(audio.volume - 0.5) < 0.01;
      audio.volume = before;
    }
    return volumeWorks.current;
  };

  const fadeTo = (audio, target, done) => {
    clearInterval(fadeRef.current);
    if (!canSetVolume(audio)) {
      done?.();
      return;
    }
    const start = audio.volume;
    const t0 = performance.now();
    fadeRef.current = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / FADE_MS);
      audio.volume = start + (target - start) * k;
      if (k >= 1) {
        clearInterval(fadeRef.current);
        done?.();
      }
    }, 30);
  };

  /** Create/resume the AudioContext. Only works on iPhone when called inside a tap. */
  const unlockContext = () => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!ctxRef.current) ctxRef.current = new Ctx();
    if (ctxRef.current.state !== 'running') ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  };

  const startDrone = () => {
    const ctx = unlockContext();
    if (!ctx) return false;
    modeRef.current = 'drone';
    if (!droneRef.current) droneRef.current = createTanpuraDrone(ctx, DRONE_VOLUME);
    droneRef.current.start();
    return true;
  };

  /** Call straight from a tap handler (no await before it). */
  const play = useCallback(() => {
    wantRef.current = true;
    try {
      // iOS 16.4+: treat this as media playback, so the silent switch doesn't mute it
      if (navigator.audioSession) navigator.audioSession.type = 'playback';
    } catch {
      /* not supported */
    }

    if (modeRef.current === 'file') {
      if (!audioRef.current) {
        const audio = new Audio(src);
        audio.loop = true;
        audio.preload = 'auto';
        audioRef.current = audio;
      }
      const audio = audioRef.current;
      const ctx = unlockContext(); // kept ready in case the file cannot play
      if (canSetVolume(audio)) audio.volume = 0;
      setPlaying(true);
      Promise.resolve(audio.play())
        .then(() => {
          fadeTo(audio, volume);
          if (ctx && !droneRef.current) ctx.suspend().catch(() => {});
        })
        .catch((err) => {
          if (err?.name === 'AbortError') return; // paused again before it started
          if (err?.name === 'NotAllowedError') {
            wantRef.current = false;
            setPlaying(false);
            return;
          }
          // Missing or unsupported file: use the drone from now on
          audioRef.current = null;
          if (!startDrone()) {
            wantRef.current = false;
            setPlaying(false);
          }
        });
      return;
    }

    if (startDrone()) setPlaying(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, volume]);

  const pause = useCallback(() => {
    wantRef.current = false;
    setPlaying(false);
    const audio = audioRef.current;
    if (audio && !audio.paused) fadeTo(audio, 0, () => audio.pause());
    droneRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause]);

  // Quiet while the guest is in another app or tab; carry on when they return
  useEffect(() => {
    const onVisibility = () => {
      if (!wantRef.current) return;
      const audio = audioRef.current;
      if (document.hidden) {
        clearInterval(fadeRef.current);
        audio?.pause();
        droneRef.current?.stop();
        ctxRef.current?.suspend().catch(() => {});
        return;
      }
      if (modeRef.current === 'file' && audio) {
        audio.play().catch(() => {
          wantRef.current = false;
          setPlaying(false);
        });
      } else if (droneRef.current) {
        ctxRef.current?.resume().catch(() => {});
        droneRef.current.start();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Track name on the lock screen / Android media notification, with play & pause buttons
  useEffect(() => {
    if (!('mediaSession' in navigator) || !title || typeof window.MediaMetadata !== 'function') return;
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({ title, artist, album: 'Pamoora wedding invitation' });
      navigator.mediaSession.setActionHandler('play', play);
      navigator.mediaSession.setActionHandler('pause', pause);
    } catch {
      /* not supported */
    }
  }, [title, artist, play, pause]);

  // A read-only status for checking the music in tests and from the browser console
  useEffect(() => {
    window.__pamooraMusic = () => ({
      mode: modeRef.current,
      wanted: wantRef.current,
      filePaused: audioRef.current ? audioRef.current.paused : null,
      fileTime: audioRef.current ? audioRef.current.currentTime : null,
      context: ctxRef.current ? ctxRef.current.state : null,
    });
    return () => {
      delete window.__pamooraMusic;
    };
  }, []);

  useEffect(
    () => () => {
      clearInterval(fadeRef.current);
      audioRef.current?.pause();
      droneRef.current?.dispose();
      ctxRef.current?.close().catch(() => {});
    },
    [],
  );

  return { playing, play, pause, toggle };
}

/* ── Synthesized tanpura drone (the fallback) ─────────────────────────────── */

function createTanpuraDrone(ctx, volume) {
  const master = ctx.createGain();
  master.gain.value = 0;

  // A little space: feedback delay into a gentle low-pass.
  const delay = ctx.createDelay(1.5);
  delay.delayTime.value = 0.42;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.35;
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 2200;

  master.connect(tone);
  tone.connect(ctx.destination);
  master.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(tone);

  const SA = 138.59; // C#3, a warm tanpura tonic
  const cycle = [SA * 0.75, SA, SA, SA * 0.5]; // Pa (lower), Sa, Sa, Sa (lower)
  const PLUCK_GAP = 1.05;

  // A simple, unhurried Kafi/Bhairavi-leaning pentatonic phrase.
  const melody = [SA * 2, SA * 2.25, SA * 2.5, SA * 2.25, SA * 2, SA * 1.5, SA * 1.6875, SA * 1.5];
  const melodyGap = 2.4;

  const pluck = (freq, when) => {
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, when);
    env.gain.exponentialRampToValueAtTime(0.105, when + 0.03);
    env.gain.exponentialRampToValueAtTime(0.0001, when + 4.6);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 6;
    // The "jawari" buzz: a sweeping resonant filter.
    filter.frequency.setValueAtTime(3200, when);
    filter.frequency.exponentialRampToValueAtTime(700, when + 3.5);

    [0, 4, -5].forEach((detune) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      osc.connect(filter);
      osc.start(when);
      osc.stop(when + 4.8);
    });

    filter.connect(env);
    env.connect(master);
  };

  let step = 0;
  let melodyStep = 0;
  let nextTime = 0;
  let nextMelodyTime = 0;
  let timer = null;

  const playMelodyNote = (freq, when) => {
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, when);
    env.gain.exponentialRampToValueAtTime(0.022, when + 0.18);
    env.gain.exponentialRampToValueAtTime(0.008, when + 0.85);
    env.gain.exponentialRampToValueAtTime(0.0001, when + 1.55);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, when);
    filter.frequency.exponentialRampToValueAtTime(950, when + 1.4);

    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, when);
    oscillator.detune.setValueAtTime(2, when);

    oscillator.connect(filter);
    filter.connect(env);
    env.connect(master);
    oscillator.start(when);
    oscillator.stop(when + 1.6);
  };

  const schedule = () => {
    while (nextTime < ctx.currentTime + 0.4) {
      pluck(cycle[step % cycle.length], nextTime);
      nextTime += PLUCK_GAP + (step % cycle.length === 3 ? 0.6 : 0);
      step += 1;
    }

    while (nextMelodyTime < ctx.currentTime + 0.8) {
      const phrasePause = melodyStep % melody.length === 0;
      playMelodyNote(melody[melodyStep % melody.length], nextMelodyTime + (phrasePause ? 0.35 : 0));
      nextMelodyTime += melodyGap + (phrasePause ? 0.9 : 0);
      melodyStep += 1;
    }
  };

  return {
    start() {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(volume * 0.9, now + FADE_MS / 1000);
      nextTime = now + 0.05;
      nextMelodyTime = now + 1.2;
      clearInterval(timer);
      timer = setInterval(schedule, 120);
      schedule();
    },
    stop() {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + FADE_MS / 1000);
      clearInterval(timer);
    },
    dispose() {
      clearInterval(timer);
      master.disconnect();
    },
  };
}
