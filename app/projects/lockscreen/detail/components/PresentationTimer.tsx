"use client";

interface PresentationTimerProps {
  elapsed: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function PresentationTimer({
  elapsed,
  isRunning,
  onStart,
  onPause,
  onReset,
}: PresentationTimerProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-white text-base tabular-nums">
        {formatTime(elapsed)}
      </span>
      <button
        onClick={isRunning ? onPause : onStart}
        className="px-3 py-1 rounded text-xs bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
      >
        {isRunning ? "Pause" : "Start"}
      </button>
      <button
        onClick={onReset}
        className="px-3 py-1 rounded text-xs bg-white/10 hover:bg-white/20 text-white/70 transition-colors cursor-pointer"
      >
        Reset
      </button>
    </div>
  );
}
