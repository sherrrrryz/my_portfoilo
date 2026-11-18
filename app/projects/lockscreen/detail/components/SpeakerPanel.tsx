"use client";
import { useState } from "react";
import { PresentationTimer } from "./PresentationTimer";
import { usePresentationTimer } from "../hooks/usePresentationTimer";

interface SpeakerPanelProps {
  notes: string;
  lang?: "en" | "zh";
}

export function SpeakerPanel({ notes, lang = "en" }: SpeakerPanelProps) {
  const zh = lang === "zh";
  const [visible, setVisible] = useState(false);
  const { elapsed, isRunning, start, pause, reset } = usePresentationTimer();

  // Chinese has no spaces between words: count Han characters plus any
  // Latin words or numbers, and pace it at ~240 per minute instead of 130.
  const wordCount = zh
    ? (notes.match(/[\u4e00-\u9fff]|[A-Za-z0-9.%]+/g) ?? []).length
    : notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.round((wordCount / (zh ? 240 : 130)) * 60);
  const estMin = Math.floor(estimatedSeconds / 60);
  const estSec = estimatedSeconds % 60;
  const estimatedTime = wordCount === 0
    ? (zh ? "仅展示画面" : "Visual only")
    : zh
      ? estMin > 0
        ? `约 ${estMin} 分${estSec > 0 ? ` ${estSec} 秒` : ""}`
        : `约 ${estSec} 秒`
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
        {zh ? "演讲备注" : "Speaker Notes"}
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
                {zh ? "演讲备注" : "Speaker Notes"}
              </span>
              <span className="text-white/40 text-xs">
                {wordCount} {zh ? "字" : "words"} · {estimatedTime}
              </span>
            </div>
            <PresentationTimer
              elapsed={elapsed}
              isRunning={isRunning}
              onStart={start}
              onPause={pause}
              onReset={reset}
              lang={lang}
            />
          </div>
          <div className="flex flex-col gap-3 text-white/90 text-sm leading-relaxed">
            {notes.split("\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
