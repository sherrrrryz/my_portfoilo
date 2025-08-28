import React from "react";

interface TwoColProps {
  title: string;
  children: React.ReactNode; // 右侧正文内容
}

export function TwoCol({ title, children }: TwoColProps) {
  return (
    <section className="w-full my-12 md:my-30">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* 左边标题 - hug */}
        <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wide text-[var(--nav-fg)]">
          {title}
        </h2>

        {/* 自动撑开的 space */}
        <div className="flex-1" />

        {/* 右边正文 - 最大 800 */}
        <div className="text-[var(--nav-fg)] leading-relaxed max-w-[800px]">
          {children}
        </div>
      </div>
    </section>
  );
}