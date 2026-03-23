"use client";
import React, { useRef, useState, useCallback, useEffect, RefObject } from "react";

import { slides } from "../slideData";
import { Sidebar } from "./Sidebar";
import { SlideSection } from "./SlideSection";
import { SlideRenderer } from "./SlideRenderer";
import { CloseButton } from "./CloseButton";
import { PageIndicator } from "./PageIndicator";
import { PrevNextButtons } from "./PrevNextButtons";
import { SpeakerPanel } from "./SpeakerPanel";
import { ImageLightbox } from "./ImageLightbox";
import { useActiveSection } from "../hooks/useActiveSection";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import { CoverSection } from "./CoverSection";

export function PresentationShell() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<RefObject<HTMLElement | null>[]>(
    slides.map(() => ({ current: null }))
  );

  const activeIndex = useActiveSection(
    sectionRefs.current,
    scrollContainerRef
  );

  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  // Lock body scroll while presentation is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const scrollToSection = useCallback((index: number) => {
    const ref = sectionRefs.current[index];
    if (ref?.current && scrollContainerRef.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const goNext = useCallback(() => {
    if (activeIndex < slides.length - 1) scrollToSection(activeIndex + 1);
  }, [activeIndex, scrollToSection]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) scrollToSection(activeIndex - 1);
  }, [activeIndex, scrollToSection]);

  useKeyboardNav(goPrev, goNext);

  const handleEnlarge = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#fafaf9] flex"
      style={{
        "--nav-fg": "rgba(0, 0, 0, 0.88)",
        "--nav-dim": "rgba(0, 0, 0, 0.70)",
        "--nav-border": "rgba(0, 0, 0, 0.08)",
        "--nav-ring": "rgba(0, 0, 0, 0.35)",
        "--imgbg": "#F2F2F2",
        "--accent": "#2EA82C",
        "--greytext": "rgba(0, 0, 0, 0.6)",
      } as React.CSSProperties}
    >
      {/* Sidebar */}
      <Sidebar
        slides={slides}
        activeIndex={activeIndex}
        onNavigate={scrollToSection}
      />

      {/* Main scrollable content */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        {slides.map((slide, index) =>
          slide.id === "cover" ? (
            <CoverSection
              key={slide.id}
              ref={(el) => {
                sectionRefs.current[index].current = el;
              }}
            />
          ) : (
            <SlideSection
              key={slide.id}
              slide={slide}
              ref={(el) => {
                sectionRefs.current[index].current = el;
              }}
            >
              <SlideRenderer blocks={slide.content} onEnlarge={handleEnlarge} />
            </SlideSection>
          )
        )}
      </div>

      {/* Fixed UI elements */}
      <CloseButton />
      <PageIndicator current={activeIndex + 1} total={slides.length} />
      <PrevNextButtons
        onPrev={goPrev}
        onNext={goNext}
        canPrev={activeIndex > 0}
        canNext={activeIndex < slides.length - 1}
      />
      <SpeakerPanel notes={slides[activeIndex].speakerNotes} />

      {/* Lightbox */}
      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
