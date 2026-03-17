// app/components/PageHeader.tsx
import React from "react";

interface PageHeaderProps {
  subtitle?: string; // 比如 "UX Design · Product Design · Visual Design"
  title: string;     // 比如 "Lock Screen Personalization Editing"
  action?: React.ReactNode;
}

export default function PageHeader({ subtitle, title, action }: PageHeaderProps) {
  return (
    <header className="w-full mt-12">
      {subtitle && (
        <p className="uppercase text-sm tracking-wider text-[var(--nav-dim)]">
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-between gap-4 mt-2">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--nav-fg)]">
          {title}
        </h1>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}