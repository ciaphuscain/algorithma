"use client";

import { SPEEDS } from "./usePlayback";

interface Props {
  position: number;
  length: number;
  playing: boolean;
  speed: number;
  onSeek(p: number): void;
  onStep(delta: number): void;
  onToggle(): void;
  onSpeed(s: (typeof SPEEDS)[number]): void;
}

export function Controls({
  position,
  length,
  playing,
  speed,
  onSeek,
  onStep,
  onToggle,
  onSpeed,
}: Props) {
  return (
    <div className="controls" role="group" aria-label="Playback controls">
      <button
        type="button"
        className="btn btn--icon"
        onClick={() => onSeek(0)}
        disabled={position === 0}
        aria-label="Restart"
        title="Restart (Home)"
      >
        ⏮
      </button>
      <button
        type="button"
        className="btn btn--icon"
        onClick={() => onStep(-1)}
        disabled={position === 0}
        aria-label="Step back"
        title="Step back (←)"
      >
        ◀
      </button>
      <button
        type="button"
        className="btn btn--primary"
        onClick={onToggle}
        aria-label={playing ? "Pause" : "Play"}
        title="Play / pause (Space)"
        style={{ minWidth: 88 }}
      >
        {playing ? "❚❚ Pause" : "▶ Play"}
      </button>
      <button
        type="button"
        className="btn btn--icon"
        onClick={() => onStep(1)}
        disabled={position >= length}
        aria-label="Step forward"
        title="Step forward (→)"
      >
        ▶
      </button>
      <button
        type="button"
        className="btn btn--icon"
        onClick={() => onSeek(length)}
        disabled={position >= length}
        aria-label="Jump to end"
        title="End (End)"
      >
        ⏭
      </button>
      <div className="controls__scrub">
        <label className="sr-only" htmlFor="viz-scrub">
          Trace position
        </label>
        <input
          id="viz-scrub"
          type="range"
          min={0}
          max={length}
          value={position}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-valuetext={`Step ${position} of ${length}`}
        />
        <span className="controls__pos" aria-hidden="true">
          {position} / {length}
        </span>
      </div>
      <label className="controls__speed">
        Speed
        <select
          className="select"
          style={{ width: "auto", minHeight: 32, padding: "2px 8px" }}
          value={speed}
          onChange={(e) => onSpeed(Number(e.target.value) as (typeof SPEEDS)[number])}
        >
          {SPEEDS.map((s) => (
            <option key={s} value={s}>
              {s} steps/s
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
