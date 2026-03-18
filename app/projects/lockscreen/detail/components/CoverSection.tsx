"use client";
import { forwardRef } from "react";
import Image from "next/image";
import PageHeader from "app/components/pageheader";

export const CoverSection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section
      ref={ref}
      className="w-full min-h-screen max-w-7xl mx-auto px-8 md:px-16 flex flex-col justify-center snap-start"
    >
      <div className="w-full">
        <Image
          src="/lockscreen/Cover.png"
          alt="Lock Screen Personalization Editing"
          width={1600}
          height={900}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      <PageHeader
        subtitle="Interaction Design · Product Design · Visual Design"
        title="Lock Screen Personalization Editing"
      />
      <div className="mt-8 w-full">
        <p className="text-lg font-semibold text-[var(--nav-fg)] mb-3">
          750M MAU · Launched October 2023
        </p>
        <p className="text-[var(--nav-fg)] leading-relaxed">
          What does it take to design a personalization feature used by three-quarters of a billion people?
        </p>
        <p className="text-[var(--nav-fg)] leading-relaxed mt-2">
          This is the story of Xiaomi&apos;s lock screen editor — a product that redefined how users express themselves on their most-viewed screen.
        </p>
      </div>
    </section>
  );
});
CoverSection.displayName = "CoverSection";
