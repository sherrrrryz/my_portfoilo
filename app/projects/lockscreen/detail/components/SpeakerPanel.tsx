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

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setVisible(!visible)}
        className="fixed bottom-5 left-5 z-[110] px-3 py-1.5 rounded-full bg-black/70 text-white text-xs hover:bg-black/80 transition-colors cursor-pointer"
      >
        {visible ? "Hide Notes" : "Speaker Notes"}
      </button>

      {/* Panel */}
      {visible && (
        <div className="fixed bottom-16 left-5 right-60 z-[110] bg-black/80 backdrop-blur-md rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-xs uppercase tracking-wider font-medium">
              Speaker Notes
            </span>
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
