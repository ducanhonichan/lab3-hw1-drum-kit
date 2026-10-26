
import { useCallback, useEffect, useRef, useState } from 'react';
import { DrumPad } from './components/DrumPad';
import { drumPads } from './data/drumPads';
import { useDrumAudio } from './hooks/useDrumAudio';
import './App.css';

function App() {
  
  
const [lastPlayed, setLastPlayed] = useState(null);
const [activePadId, setActivePadId] = useState(null);

const activeTimerRef = useRef(null);
const { playDrum } = useDrumAudio();


  
const handlePlay = useCallback(
  (pad) => {
    playDrum(pad.id);
    setLastPlayed(pad);
    setActivePadId(pad.id);

    if (activeTimerRef.current !== null) {
      clearTimeout(activeTimerRef.current);
    }

    activeTimerRef.current = setTimeout(() => {
      setActivePadId(null);
      activeTimerRef.current = null;
    }, 150);
  },
  [playDrum]
);




useEffect(() => {
  return () => {
    if (activeTimerRef.current !== null) {
      clearTimeout(activeTimerRef.current);
    }
  };
}, []);



  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) {
        return;
      }

      const pressedKey = event.key.toUpperCase();

      const matchedPad = drumPads.find(
        (pad) => pad.key === pressedKey
      );

      if (matchedPad) {
        event.preventDefault();
        handlePlay(matchedPad);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePlay]);

  return (
    <main className="studio">
      <header className="studio__header">
        <p className="studio__eyebrow">REACT 19 · HOMEWORK 1</p>
        <h1>Production Studio Drum Kit</h1>
        <p>
          Play the drums using your mouse or keyboard.
        </p>
      </header>

      <section
        className="studio__panel"
        aria-labelledby="drum-title"
      >
        <h2 id="drum-title">Drum Pads</h2>

        <div className="drum-grid">
          {drumPads.map((pad) => (
            <DrumPad
              key={pad.id}
              pad={pad}
              onPlay={handlePlay}
             isActive={activePadId === pad.id}
            />
          ))}
        </div>

        <p
          className="studio__status"
          role="status"
          aria-live="polite"
        >
          {lastPlayed
            ? `Last played: ${lastPlayed.name} (${lastPlayed.key})`
            : 'Ready to play. Select a drum pad.'}
        </p>
      </section>
    </main>
  );
}

export default App;
