"use client";
import { useState } from "react";
import { Slide } from "../slideData";

interface SidebarProps {
  slides: Slide[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export function Sidebar({ slides, activeIndex, onNavigate }: SidebarProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fixed left-0 top-0 h-full z-[105] flex items-stretch"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thin indicator strip */}
      <div className="w-7 flex flex-col items-center justify-center gap-1.5 py-12">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => onNavigate(index)}
            aria-label={slide.title}
            className="cursor-pointer flex items-center justify-center"
          >
            <span
              className={`block rounded-full transition-all duration-200 ${
                activeIndex === index
                  ? "w-[3px] h-4 bg-[var(--nav-fg)]"
                  : "w-[2px] h-2.5 bg-[var(--nav-border)] hover:bg-[var(--nav-dim)]"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Floating TOC panel */}
      <div
        className={`absolute left-7 top-1/2 -translate-y-1/2 transition-all duration-200 ${
          hovered
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-1 pointer-events-none"
        }`}
      >
        <nav className="bg-[#fafaf9]/96 backdrop-blur-sm rounded-2xl shadow-lg border border-[var(--nav-border)] py-2 min-w-[220px]">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => onNavigate(index)}
              className={`w-full text-left px-4 py-1.5 transition-colors cursor-pointer flex items-center gap-3 ${
                activeIndex === index
                  ? "text-[var(--nav-fg)]"
                  : "text-[var(--nav-dim)] hover:text-[var(--nav-fg)]"
              }`}
            >
              <span className={`text-[10px] font-mono w-4 flex-shrink-0 ${activeIndex === index ? "text-[var(--nav-fg)]" : "text-[var(--nav-border)]"}`}>
                {slide.sectionNumber.toString().padStart(2, "0")}
              </span>
              <span
                className={`text-sm leading-snug ${
                  activeIndex === index ? "font-medium" : ""
                }`}
              >
                {slide.title}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
