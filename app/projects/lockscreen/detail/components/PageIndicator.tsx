export function PageIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-[110] text-sm text-[var(--nav-dim)] bg-[#fafaf9]/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-[var(--nav-border)]">
      {current} / {total}
    </div>
  );
}
