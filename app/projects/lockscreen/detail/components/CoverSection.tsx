"use client";
import { forwardRef } from "react";
import Image from "next/image";
import PageHeader from "app/components/pageheader";

export const CoverSection = forwardRef<HTMLElement, { lang?: "en" | "zh" }>(({ lang = "en" }, ref) => {
  const zh = lang === "zh";
  return (
    <section
      ref={ref}
      className="w-full min-h-screen max-w-7xl mx-auto px-8 md:px-16 flex flex-col justify-center"
    >
      <div className="w-full">
        <Image
          src="/lockscreen/Cover.png"
          alt={zh ? "个性化锁屏编辑" : "Lock Screen Personalization Editing"}
          width={1600}
          height={900}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      <PageHeader
        subtitle={zh ? "产品设计 · UX 设计 · 原型 · 用户研究 · 视觉设计" : "Product Design · UX Design · Prototyping · User Research · Visual Design"}
        title={zh ? "个性化锁屏编辑" : "Lock Screen Personalization Editing"}
      />
      <div className="mt-8 w-full">
        <p className="text-lg font-semibold text-[var(--nav-fg)] mb-3">
          {zh ? "小米 · 7.5 亿月活 · 2023 年 10 月上线" : "Xiaomi · 750M MAU · Launched October 2023"}
        </p>
        <p className="text-[var(--nav-fg)] leading-relaxed">
          {zh
            ? "这是小米锁屏编辑器的故事。这个产品重新定义了用户如何在自己最常看到的那块屏幕上表达自我。"
            : "This is the story of Xiaomi's lock screen editor — a product that redefined how users express themselves on their most-viewed screen."}
        </p>
      </div>
    </section>
  );
});
CoverSection.displayName = "CoverSection";
