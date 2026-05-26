"use client";

import { useCallback, useRef, useEffect } from "react";

type SoundType = "taskComplete" | "taskDelete" | "levelUp" | "achievement" | "click" | "hover" | "error" | "success" | "countdown" | "ready" | "battleStart";

type SoundResult = { oscillator: OscillatorNode; gain: GainNode; duration: number };

// Audio context singleton
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
};

// Sound definitions using Web Audio API synthesized tones
const createTaskCompleteSound = (ctx: AudioContext): SoundResult[] => {
  const sounds: SoundResult[] = [];
  const frequencies = [523.25, 659.25, 783.99, 1046.50];
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.2);
    osc.connect(gain);
    sounds.push({ oscillator: osc, gain, duration: 0.4 });
  });
  return sounds;
};

const createTaskDeleteSound = (ctx: AudioContext): SoundResult[] => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(gain);
  return [{ oscillator: osc, gain, duration: 0.15 }];
};

const createLevelUpSound = (ctx: AudioContext): SoundResult[] => {
  const sounds: SoundResult[] = [];
  const notes = [
    { freq: 261.63, time: 0, duration: 0.2 },
    { freq: 329.63, time: 0.15, duration: 0.2 },
    { freq: 392.00, time: 0.3, duration: 0.2 },
    { freq: 523.25, time: 0.45, duration: 0.3 },
    { freq: 659.25, time: 0.6, duration: 0.3 },
    { freq: 783.99, time: 0.75, duration: 0.5 },
    { freq: 1046.50, time: 0.9, duration: 0.6 },
  ];

  notes.forEach(({ freq, time, duration }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
    gain.gain.setValueAtTime(0, ctx.currentTime + time);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + time + 0.02);
    gain.gain.setValueAtTime(0.2, ctx.currentTime + time + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);
    osc.connect(gain);
    sounds.push({ oscillator: osc, gain, duration: time + duration });
  });

  for (let i = 0; i < 5; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2000 + i * 500, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.8);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.85);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
    osc.connect(gain);
    sounds.push({ oscillator: osc, gain, duration: 1.4 });
  }

  return sounds;
};

const createAchievementSound = (ctx: AudioContext): SoundResult[] => {
  const sounds: SoundResult[] = [];
  const chimes = [880, 1108.73, 1318.51, 1760];
  chimes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.1 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.5);
    osc.connect(gain);
    sounds.push({ oscillator: osc, gain, duration: 0.6 + i * 0.1 });
  });
  return sounds;
};

const createClickSound = (ctx: AudioContext): SoundResult[] => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.connect(gain);
  return [{ oscillator: osc, gain, duration: 0.05 }];
};

const createHoverSound = (ctx: AudioContext): SoundResult[] => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  gain.gain.setValueAtTime(0.03, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
  osc.connect(gain);
  return [{ oscillator: osc, gain, duration: 0.03 }];
};

const createErrorSound = (ctx: AudioContext): SoundResult[] => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain);
  return [{ oscillator: osc, gain, duration: 0.2 }];
};

const createSuccessSound = (ctx: AudioContext): SoundResult[] => {
  const sounds: SoundResult[] = [];
  const freqs = [523.25, 659.25];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.1 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.2);
    osc.connect(gain);
    sounds.push({ oscillator: osc, gain, duration: 0.3 + i * 0.1 });
  });
  return sounds;
};

const createCountdownSound = (ctx: AudioContext): SoundResult[] => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain);
  return [{ oscillator: osc, gain, duration: 0.1 }];
};

// Soft soothing entry sound - plays when entering main page
const createReadySound = (ctx: AudioContext): SoundResult[] => {
  const sounds: SoundResult[] = [];
  
  // Soft warm pad chord (C4, E4, G4 - C major)
  const chord = [261.63, 329.63, 392.00];
  chord.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.15 + 0.4);
    gain.gain.setValueAtTime(0.08, ctx.currentTime + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
    osc.connect(gain);
    sounds.push({ oscillator: osc, gain, duration: 2 });
  });
  
  // Gentle rising tone - like a warm breath
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(440, ctx.currentTime + 0.3);
  osc.frequency.linearRampToValueAtTime(523.25, ctx.currentTime + 1.2);
  gain.gain.setValueAtTime(0, ctx.currentTime + 0.3);
  gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.8);
  gain.gain.setValueAtTime(0.06, ctx.currentTime + 1.5);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
  osc.connect(gain);
  sounds.push({ oscillator: osc, gain, duration: 2.5 });
  
  return sounds;
};

// Battle start sound - intense and action-packed
const createBattleStartSound = (ctx: AudioContext): SoundResult[] => {
  const sounds: SoundResult[] = [];
  
  // Drum-like impact
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "square";
  osc1.frequency.setValueAtTime(60, ctx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3);
  gain1.gain.setValueAtTime(0.3, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc1.connect(gain1);
  sounds.push({ oscillator: osc1, gain: gain1, duration: 0.3 });
  
  // Sword clash sound
  const clashFreqs = [800, 1200, 1600];
  clashFreqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    sounds.push({ oscillator: osc, gain, duration: 0.4 });
  });
  
  // War horn
  const horn = ctx.createOscillator();
  const hornGain = ctx.createGain();
  horn.type = "sawtooth";
  horn.frequency.setValueAtTime(150, ctx.currentTime + 0.2);
  horn.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.5);
  hornGain.gain.setValueAtTime(0, ctx.currentTime + 0.2);
  hornGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.3);
  hornGain.gain.setValueAtTime(0.25, ctx.currentTime + 0.8);
  hornGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
  horn.connect(hornGain);
  sounds.push({ oscillator: horn, gain: hornGain, duration: 1.2 });
  
  return sounds;
};

const soundCreators: Record<SoundType, (ctx: AudioContext) => SoundResult[]> = {
  taskComplete: createTaskCompleteSound,
  taskDelete: createTaskDeleteSound,
  levelUp: createLevelUpSound,
  achievement: createAchievementSound,
  click: createClickSound,
  hover: createHoverSound,
  error: createErrorSound,
  success: createSuccessSound,
  countdown: createCountdownSound,
  ready: createReadySound,
  battleStart: createBattleStartSound,
};

export function useSound() {
  const enabledRef = useRef(true);

  useEffect(() => {
    const savedEnabled = localStorage.getItem("timebot_sound_enabled");
    if (savedEnabled !== null) {
      enabledRef.current = savedEnabled === "true";
    }
  }, []);

  const play = useCallback((sound: SoundType) => {
    if (!enabledRef.current) return;

    try {
      const ctx = getAudioContext();
      
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const sounds = soundCreators[sound](ctx);
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0.5, ctx.currentTime);

      sounds.forEach(({ oscillator, gain, duration }) => {
        gain.connect(masterGain);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      });
    } catch (error) {
      console.warn("Failed to play sound:", error);
    }
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
    localStorage.setItem("timebot_sound_enabled", String(enabled));
  }, []);

  const isEnabled = useCallback(() => enabledRef.current, []);

  return { play, setEnabled, isEnabled };
}

export const playGlobalSound = (sound: SoundType) => {
  if (typeof window !== "undefined") {
    try {
      const savedEnabled = localStorage.getItem("timebot_sound_enabled");
      if (savedEnabled === "false") return;

      const ctx = getAudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const sounds = soundCreators[sound](ctx);
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0.5, ctx.currentTime);

      sounds.forEach(({ oscillator, gain, duration }) => {
        gain.connect(masterGain);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      });
    } catch (error) {
      console.warn("Failed to play global sound:", error);
    }
  }
};
