"use client";
import { useState } from "react";

export function CollapsibleBlock({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-4 border border-[var(--nav-border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3.5 text-left flex justify-between items-center bg-[var(--imgbg)] hover:opacity-80 transition-opacity text-sm font-medium text-[var(--nav-fg)] cursor-pointer"
      >
        {title}
        <span className="text-[var(--nav-dim)] ml-2">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-5 py-4 text-sm text-[var(--nav-fg)] leading-relaxed whitespace-pre-line bg-[#fafaf9]">
          {content}
        </div>
      )}
    </div>
  );
}
