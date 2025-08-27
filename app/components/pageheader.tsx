// app/components/PageHeader.tsx
import React from "react";

interface PageHeaderProps {
  subtitle?: string; // 比如 "UX Design · Product Design · Visual Design"
  title: string;     // 比如 "Lock Screen Personalization Editing"
}

export default function PageHeader({ subtitle, title }: PageHeaderProps) {
  return (
    <header className="mb-10 md:mb-14">
      {subtitle && (
        <p className="uppercase text-sm tracking-wider text-[var(--nav-dim)]">
          {subtitle}
        </p>
      )}
      <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-[var(--nav-fg)]">
        {title}
      </h1>
    </header>
  );
}