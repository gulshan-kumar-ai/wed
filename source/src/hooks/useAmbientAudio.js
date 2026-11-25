import { useCallback, useEffect, useRef, useState } from 'react';

const FADE_MS = 1200;

/**
 * Ambient music with graceful fallback.
 *
 * 1. Tries to play the audio file at `src` (loop, soft fade-in).
 * 2. If the file is missing or blocked, plays a gentle synthesized
 *    tanpura-style drone (Pa–Sa–Sa–Sa) via the Web Audio API.
 *
 * Playback only ever starts from a user gesture (the toggle), never on load.
 */
export function useAmbientAudio({ src, volume = 0.45 }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const droneRef = useRef(null);
  const fadeRef = useRef(null);

  const fadeTo = (audio, target, onDone) => {
    clearInterval(fadeRef.current);
    const start = audio.volume;
    const t0 = performance.now();
    fadeRef.current = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / FADE_MS);
      audio.volume = start + (target - start) * k;
      if (k >= 1) {
        clearInterval(fadeRef.current);
        onDone?.();
      }
    }, 30);
  };

  const play = useCallback(async () => {
    if (!droneRef.current) {
      if (!audioRef.current) {
        const audio = new Audio(src);
        audio.loop = true;
        audio.preload = 'auto';
        audioRef.current = audio;
      }
      const audio = audioRef.current;
      try {
        audio.volume = 0;
        await audio.play();
        fadeTo(audio, volume);
        setPlaying(true);
        return;
      } catch {
        // File missing or unsupported: switch to the synthesized drone for good.
        audioRef.current = null;
        droneRef.current = createTanpuraDrone(volume);
      }
    }
    droneRef.current.start();
    setPlaying(true);
  }, [src, volume]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      fadeTo(audio, 0, () => audio.pause());
    }
    droneRef.current?.stop();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause]);

  useEffect(
    () => () => {
      clearInterval(fadeRef.current);
      audioRef.current?.pause();
      droneRef.current?.dispose();
    },
    [],
  );

  return { playing, play, pause, toggle };
}

/* ── Synthesized tanpura drone ─────────────────────────────────────────── */

function createTanpuraDrone(volume) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();

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
  // It is synthesized locally, so it has no licensing or download dependency.
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
      ctx.resume();
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
      ctx.close();
    },
  };
}
