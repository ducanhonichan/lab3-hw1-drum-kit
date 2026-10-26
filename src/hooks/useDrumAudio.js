
import { useCallback, useEffect, useRef } from 'react';

export function useDrumAudio() {
  const audioContextRef = useRef(null);

  useEffect(() => {
    return () => {
      const context = audioContextRef.current;
      audioContextRef.current = null;

      if (context && context.state !== 'closed') {
        void context.close();
      }
    };
  }, []);

  const playDrum = useCallback((padId) => {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    const context = audioContextRef.current;

    if (context.state === 'suspended') {
      void context.resume();
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    const settings = {
      kick: { frequency: 90, duration: 0.35, type: 'sine' },
      snare: { frequency: 180, duration: 0.18, type: 'triangle' },
      'closed-hihat': {
        frequency: 650,
        duration: 0.08,
        type: 'square',
      },
      'open-hihat': {
        frequency: 550,
        duration: 0.4,
        type: 'square',
      },
      clap: { frequency: 320, duration: 0.12, type: 'sawtooth' },
      tom: { frequency: 140, duration: 0.3, type: 'sine' },
      crash: { frequency: 800, duration: 0.6, type: 'sawtooth' },
    };

    const sound = settings[padId];
    if (!sound) return;

    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.frequency, now);

    if (padId === 'kick' || padId === 'tom') {
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(40, sound.frequency / 2),
        now + sound.duration
      );
    }

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + sound.duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + sound.duration);

    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }, []);

  return { playDrum };
}
