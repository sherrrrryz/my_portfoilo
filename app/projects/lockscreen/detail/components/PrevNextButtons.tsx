export function PrevNextButtons({
  onPrev,
  onNext,
  canPrev,
  canNext,
  lang = "en",
}: {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  lang?: "en" | "zh";
}) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[110] flex gap-3">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="px-4 py-2 rounded-full bg-[#fafaf9]/90 shadow-sm border border-[var(--nav-border)] text-sm text-[var(--nav-fg)] hover:bg-[var(--imgbg)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        {lang === "zh" ? "上一页" : "Prev"}
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="px-4 py-2 rounded-full bg-[#fafaf9]/90 shadow-sm border border-[var(--nav-border)] text-sm text-[var(--nav-fg)] hover:bg-[var(--imgbg)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        {lang === "zh" ? "下一页" : "Next"}
      </button>
    </div>
  );
}
