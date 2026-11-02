"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { TracePlayer } from "@/engine/player";

export const SPEEDS = [0.5, 1, 2, 4, 8, 16, 32] as const;

/**
 * Playback state for a TracePlayer: position, play/pause and speed. The reconstructed
 * state is derived from the position, so stepping backwards is the same operation as
 * stepping forwards — there is no separate "undo" path that could disagree.
 */
export function usePlayback(player: TracePlayer | null) {
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(2);
  const length = player?.length ?? 0;

  // Reset when a new trace is loaded (adjusting state during render, per React docs).
  const [loaded, setLoaded] = useState(player);
  if (loaded !== player) {
    setLoaded(player);
    setPosition(0);
    setPlaying(false);
  }

  useEffect(() => {
    if (!playing || !player) return;
    const id = window.setInterval(() => {
      setPosition((p) => {
        if (p >= player.length) {
          setPlaying(false);
          return p;
        }
        return p + 1;
      });
    }, 1000 / speed);
    return () => window.clearInterval(id);
  }, [playing, speed, player]);

  const state = useMemo(() => (player ? player.stateAt(position) : null), [player, position]);

  const seek = useCallback((p: number) => setPosition(Math.max(0, Math.min(p, length))), [length]);
  const step = useCallback(
    (delta: number) => {
      setPlaying(false);
      setPosition((p) => Math.max(0, Math.min(p + delta, length)));
    },
    [length],
  );
  const toggle = useCallback(() => {
    if (!player) return;
    setPlaying((was) => {
      // Pressing play at the end restarts from the beginning.
      if (!was && position >= length) setPosition(0);
      return !was;
    });
  }, [player, position, length]);

  return { position, length, playing, speed, setSpeed, state, seek, step, toggle, setPlaying };
}
