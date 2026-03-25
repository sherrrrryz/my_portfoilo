"use client";

interface TeamMember {
  count: number;
  label: string;
  subtitle?: string;
  highlight?: boolean;
}

interface TeamChartProps {
  members: TeamMember[];
}

export function TeamChart({ members }: TeamChartProps) {
  return (
    <div className="flex flex-wrap gap-3 w-full my-4">
      {members.map((m, i) => (
        <div
          key={i}
          className={`flex-1 min-w-[120px] h-[9.5rem] rounded-2xl px-5 py-6 flex flex-col items-center justify-start text-center ${
            m.highlight
              ? "bg-[var(--nav-fg)] text-white"
              : "bg-[var(--slide-card-bg,#f5f5f4)] text-[var(--nav-fg)]"
          }`}
        >
          <span
            className={`text-4xl font-bold leading-none mb-2 ${
              m.highlight ? "text-white" : "text-[var(--nav-fg)]"
            }`}
          >
            {m.count}
          </span>
          <span
            className={`text-base font-semibold leading-snug ${
              m.highlight ? "text-white" : "text-[var(--nav-fg)]/60"
            }`}
          >
            {m.label}
          </span>
          {m.subtitle && (
            <span
              className={`text-sm mt-2 leading-snug ${
                m.highlight ? "text-white/60" : "text-[var(--nav-fg)]/40"
              }`}
            >
              {m.subtitle}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
