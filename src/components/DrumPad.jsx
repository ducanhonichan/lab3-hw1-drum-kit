
export function DrumPad({ pad, onPlay, isActive = false }) {
  return (
    <button
      type="button"
      className={`drum-pad ${isActive ? 'drum-pad--active' : ''}`}
      onClick={() => onPlay(pad)}
      aria-label={`Play ${pad.name} drum using key ${pad.key}`}
      aria-keyshortcuts={pad.key}
    >
      <span className="drum-pad__key" aria-hidden="true">
        {pad.key}
      </span>

      <span className="drum-pad__name">
        {pad.name}
      </span>
    </button>
  );
}
