"use client";
import { forwardRef } from "react";
import { FadeInWhenVisible } from "app/components/fadeIn";
import { Slide } from "../slideData";

interface SlideSectionProps {
  slide: Slide;
  children: React.ReactNode;
}

export const SlideSection = forwardRef<HTMLElement, SlideSectionProps>(
  ({ slide, children }, ref) => {
    return (
      <section
        ref={ref}
        id={`slide-${slide.id}`}
        className="w-full min-h-screen px-8 md:px-16 pb-32 md:pb-56 max-w-7xl mx-auto"
      >
        <FadeInWhenVisible>
          {children}
        </FadeInWhenVisible>
      </section>
    );
  }
);
SlideSection.displayName = "SlideSection";
