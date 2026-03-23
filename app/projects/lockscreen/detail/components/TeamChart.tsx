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
              ? "bg-[#1a2333] text-white"
              : "bg-[#f4f5f7] text-[var(--nav-fg)]"
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
              m.highlight ? "text-white" : "text-[#4a5568]"
            }`}
          >
            {m.label}
          </span>
          {m.subtitle && (
            <span
              className={`text-sm mt-2 leading-snug ${
                m.highlight ? "text-[rgba(255,255,255,0.6)]" : "text-[var(--greytext)]"
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
