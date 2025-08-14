import { useState, useEffect, useCallback } from 'react';
import { SoundConfig } from '../types';

// ZzFX - Zuper Zmall Zound Zynth - A tiny procedural sound generator.
// Included directly in the project to eliminate external file loading issues
// and permanently resolve "no supported sources" errors.
// This version is adapted for TypeScript and modern JavaScript modules.

let zzfx_context: AudioContext;

const zzfx = (...soundParams: (number | undefined)[]) => {
  if (typeof window === 'undefined') return;

  if (!zzfx_context) {
    // Lazily create AudioContext on first sound playback, as browsers
    // often require a user interaction before creating it.
    zzfx_context = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Parameter destructuring with defaults from ZzFX documentation
  let [
    volume = 1,
    , // randomness (unused in this simplified player)
    frequency = 220,
    attack = 0,
    sustain = 0,
    release = 0.1,
    shape = 0, // 0:sine, 1:square, 2:saw, 3:triangle
    shapeCurve = 1,
    slide = 0,
    deltaSlide = 0,
    pitchJump = 0,
    pitchJumpTime = 0,
    repeatTime = 0,
    noise = 0,
    modulation = 0,
    , // bitCrush
    delay = 0,
    sustainVolume = 1,
    decay = 0, // If > 0, used instead of release
    tremolo = 0
  ] = soundParams;

  const sampleRate = zzfx_context.sampleRate;
  const PI2 = Math.PI * 2;
  
  const finalRelease = decay || release;
  const bufferLength = (attack + sustain + finalRelease + delay) * sampleRate;
  const buffer = zzfx_context.createBuffer(1, bufferLength, sampleRate);
  const data = buffer.getChannelData(0);

  let freq = frequency;
  let t = 0; // time for oscillator
  let p = 0; // phase for pitch jump
  let r = 0; // phase for repeat

  for (let i = 0; i < bufferLength; i++) {
    // Envelope
    let envelope = 0;
    if (i < attack * sampleRate) {
      envelope = i / (attack * sampleRate);
    } else if (i < (attack + sustain) * sampleRate) {
      envelope = 1 - (1 - sustainVolume) * (i - attack * sampleRate) / (sustain * sampleRate);
    } else if (i < (attack + sustain + finalRelease) * sampleRate) {
      envelope = (1 - (i - (attack + sustain) * sampleRate) / (finalRelease * sampleRate)) * sustainVolume;
    }
    envelope = Math.max(0, envelope);

    // Oscillator
    let sample = 0;
    const phase = t * PI2;
    if (shape === 0) sample = Math.sin(phase);
    else if (shape === 1) sample = Math.sign(Math.sin(phase));
    else if (shape === 2) sample = 2 * (t % 1) - 1;
    else if (shape === 3) sample = Math.abs(1 - (t * 2 % 2)) * 2 - 1;
    sample = Math.pow(sample, shapeCurve);
    
    // Tremolo
    sample *= 1 + tremolo * Math.sin(i / sampleRate * PI2 * 7); // 7hz tremolo

    // Apply noise and envelope
    if (noise) sample += (Math.random() * 2 - 1) * noise;
    sample *= envelope * volume * 0.3; // Global volume
    data[i] = sample;

    // Update frequency for next sample
    t += freq / sampleRate;
    freq += slide;
    slide += deltaSlide;

    // Pitch jump
    if (++p > pitchJumpTime * sampleRate && pitchJumpTime) {
      freq += pitchJump;
      pitchJump = 0; // Only jump once
    }

    // Repeat
    if (repeatTime && ++r > repeatTime * sampleRate) {
        freq = frequency;
        slide = soundParams[8] || 0;
        deltaSlide = soundParams[9] || 0;
        p = 0;
        r = 0;
    }
  }

  // Play buffer
  const source = zzfx_context.createBufferSource();
  source.buffer = buffer;
  source.connect(zzfx_context.destination);
  source.start(delay ? zzfx_context.currentTime + delay : 0);
};

// --- Sound Definitions ---
// Curated ZzFX parameters for each game event.
const sounds = {
  eat:         [1.2, , 1580, 0.01, 0.02, 0.05, 3, 0.1], // Quick, high-pitched crunch
  crash:       [1.4, 0.2, 90, 0.05, 0.1, 0.3, 1, 0.2, -4, 0.1, , , , 0.6, , , .05], // Low, distorted crunch with noise
  levelUp:     [0.8, , 523, 0.05, 0.1, 0.4, 0, 1, 5, 0.02, 300, 0.1, 0.15], // Ascending arpeggio
  rockCrumble: [0.6, 0.4, 300, 0.01, 0.05, 0.15, 2, 1, -2, -1, , , , 0.7, 10, .02], // Gravelly noise
  click:       [1.3, 0.01, 1950, 0, 0, 0.06, 4, 0.1], // Sharp UI click
  pauseIn:     [, 0.1, 440, 0.02, 0.08, 0.15, 1, 0, -12], // Descending whoosh
  pauseOut:    [, 0.1, 440, 0.02, 0.08, 0.15, 1, 0, 12],  // Ascending whoosh
};

const useGameSounds = () => {
  const [config, setConfig] = useState<SoundConfig>(() => {
    const savedConfig = localStorage.getItem('eskilaum_config');
    return savedConfig ? JSON.parse(savedConfig) : { effects: true, music: true };
  });

  useEffect(() => {
    localStorage.setItem('eskilaum_config', JSON.stringify(config));
  }, [config]);

  const playSound = useCallback((sound: keyof typeof sounds) => {
    if (config.effects) {
      zzfx(...sounds[sound]);
    }
  }, [config.effects]);

  const playEatSound = useCallback(() => playSound('eat'), [playSound]);
  const playCrashSound = useCallback(() => playSound('crash'), [playSound]);
  const playLevelUpSound = useCallback(() => playSound('levelUp'), [playSound]);
  const playRockCrumbleSound = useCallback(() => playSound('rockCrumble'), [playSound]);
  const playClickSound = useCallback(() => playSound('click'), [playSound]);
  const playPauseInSound = useCallback(() => playSound('pauseIn'), [playSound]);
  const playPauseOutSound = useCallback(() => playSound('pauseOut'), [playSound]);

  return {
    config,
    setConfig,
    playEatSound,
    playCrashSound,
    playLevelUpSound,
    playRockCrumbleSound,
    playClickSound,
    playPauseInSound,
    playPauseOutSound,
  };
};

export default useGameSounds;
