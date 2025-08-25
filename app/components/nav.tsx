'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ThemeSwitch } from "./theme-switch";
import { metaData } from "../lib/config";

const navItems = {
  "/blog": { name: "Blog" },
  "/projects": { name: "Projects" },
  "/photos": { name: "Photos" },
};

function Hamburger({ open }: { open: boolean }) {
  return (
    <div className="relative shrink-0 size-12" aria-hidden="true">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g>
          <line stroke="white" strokeWidth="2" x1="14" x2="34" y1="15.5" y2="15.5"
            className="transition-transform duration-300 origin-center"
            style={{ transformOrigin: '24px 24px', transform: open ? 'rotate(45deg) translateY(8px)' : 'rotate(0deg) translateY(0px)' }} />
          <line stroke="white" strokeWidth="2" x1="14" x2="34" y1="23.5" y2="23.5"
            className="transition-opacity duration-300"
            style={{ opacity: open ? 0 : 1 }} />
          <line stroke="white" strokeWidth="2" x1="14" x2="34" y1="31.5" y2="31.5"
            className="transition-transform duration-300 origin-center"
            style={{ transformOrigin: '24px 24px', transform: open ? 'rotate(-45deg) translateY(-8px)' : 'rotate(0deg) translateY(0px)' }} />
        </g>
      </svg>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen(v => !v), []);
  const close  = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const links = useMemo(
    () =>
      Object.entries(navItems).map(([path, { name }]) => {
        const active = pathname === path || pathname?.startsWith(path + "/");
        return (
          <Link
            key={path}
            href={path}
            aria-current={active ? "page" : undefined}
            onClick={close}
            className={[
              "relative uppercase text-xl font-light leading-none whitespace-nowrap transition-colors",
              "text-[rgba(255,255,255,0.9)] hover:text-[rgba(105,215,103,0.9)]",
              active ? "text-[rgba(105,215,103,0.9)] font-normal" : "",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm",
            ].join(" ")}
          >
            {name}
          </Link>
        );
      }),
    [pathname, close]
  );

  return (
    <nav className="w-full">
      {/* 固定高度条：h-16 = 64px；用 px 控制左右内边距，items-center 垂直居中 */}
      <div className="h-[80px] md:h-[120px]">
        <div className="h-full flex items-center justify-between">
          {/* 左侧：头像 + 标题；去掉响应式字号，确保固定高度不被文本撑开 */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold uppercase tracking-wide text-[rgba(255,255,255,0.9)] text-2xl leading-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md"
            >
              <img
                src="/avatar.png"
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
              />
              {metaData.title}
            </Link>
          </div>

          {/* 桌面：横排；高度固定不受影响 */}
          <div className="hidden md:flex items-center gap-6">
            {links}
            <span className="text-[rgba(255,255,255,0.9)]">
              <ThemeSwitch />
            </span>
          </div>

          {/* 移动端：汉堡；按钮尺寸不影响条整体高度 */}
          <button
            type="button"
            className="md:hidden z-50 inline-flex items-center justify-center rounded-md p-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={toggle}
          >
            <Hamburger open={open} />
          </button>
        </div>
      </div>

      {/* 移动端抽屉：放在条下面；去掉会拉高视觉的 mt-6 */}
      <div
        className={[
          "md:hidden transition-[max-height,opacity] duration-300 overflow-hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        ].join(" ")}
      >
        <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-2 border-t border-white/10">
          <div className="flex flex-col gap-4">
            {links}
            <span className="text-[rgba(255,255,255,0.9)] py-2">
              <ThemeSwitch />
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}