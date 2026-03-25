"use client";
import { useState } from "react";
import { PresentationTimer } from "./PresentationTimer";
import { usePresentationTimer } from "../hooks/usePresentationTimer";

interface SpeakerPanelProps {
  notes: string;
}

export function SpeakerPanel({ notes }: SpeakerPanelProps) {
  const [visible, setVisible] = useState(false);
  const { elapsed, isRunning, start, pause, reset } = usePresentationTimer();

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.round((wordCount / 130) * 60);
  const estMin = Math.floor(estimatedSeconds / 60);
  const estSec = estimatedSeconds % 60;
  const estimatedTime = wordCount === 0
    ? "Visual only"
    : estMin > 0
      ? `~${estMin}m ${estSec > 0 ? `${estSec}s` : ""}`
      : `~${estSec}s`;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setVisible(!visible)}
        className="fixed top-1/2 -translate-y-1/2 right-8 z-[110] px-3 py-1.5 rounded-full bg-black/70 text-white text-xs hover:bg-black/80 transition-colors cursor-pointer"
        style={{ ...(visible ? { display: "none" } : {}) }}
      >
        Speaker Notes
      </button>

      {/* Panel */}
      {visible && (
        <div className="fixed top-1/2 -translate-y-1/2 right-8 z-[110] bg-black/80 backdrop-blur-md rounded-2xl p-5 shadow-xl w-full max-w-[400px]">
          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 text-white/40 hover:text-white/80 text-xs cursor-pointer"
          >
            ✕
          </button>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-xs uppercase tracking-wider font-medium">
                Speaker Notes
              </span>
              <span className="text-white/40 text-xs">
                {wordCount} words · {estimatedTime}
              </span>
            </div>
            <PresentationTimer
              elapsed={elapsed}
              isRunning={isRunning}
              onStart={start}
              onPause={pause}
              onReset={reset}
            />
          </div>
          <p className="text-white/90 text-sm leading-relaxed">{notes}</p>
        </div>
      )}
    </>
  );
}
