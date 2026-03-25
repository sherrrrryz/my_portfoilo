"use client";

interface FlowCard {
  number: number;
  label: string;
  highlight?: boolean;
}

export function FlowCards({ title, cards }: { title?: string; cards: FlowCard[] }) {
  return (
    <div className="my-2">
      {title && (
        <h2 className="text-lg font-normal text-[var(--nav-fg)] mb-3">{title}</h2>
      )}
    <div className="grid grid-cols-1 gap-4 pt-4">
      {cards.map((card) => (
        <div
          key={card.number}
          className={`group flex items-center gap-4 rounded-2xl px-6 py-7 transition-colors duration-200 bg-[var(--slide-card-bg,#f5f5f4)] text-[var(--nav-fg)] ${
            card.highlight
              ? "hover:bg-[var(--nav-fg)] hover:text-white cursor-pointer"
              : ""
          }`}
        >
          <span
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold transition-colors duration-200 ${
              card.highlight
                ? "group-hover:bg-white/20 group-hover:text-white bg-[var(--nav-fg)]/10 text-[var(--nav-fg)]"
                : "bg-[var(--nav-fg)]/10 text-[var(--nav-fg)]"
            }`}
          >
            {card.number}
          </span>
          <span className="font-semibold text-lg">{card.label}</span>
        </div>
      ))}
    </div>
    </div>
  );
}
