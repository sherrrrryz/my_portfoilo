'use client';

/* ============================================================================
   /ai — the "AI Related" page (client half; metadata lives in page.tsx).

   A blog-style list of Sherry's personal projects: small thumbnail on the
   left, title and tags on the right. Each row opens the live project in a new
   tab. Tag lines are a first pass summarised from the live sites. Same monochrome editorial voice as /projects, and the same
   per-page copies of ThemeToggle / LangToggle (isolation rule: no TSX
   shared with other routes). Bilingual via the shared localStorage "lang"
   recipe. No scroll choreography.
============================================================================ */

import '../_styles/tokens.css';
import './ai.css';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

/* ── i18n plumbing — per-page copy of the homepage recipe ─────────── */
type Lang = 'en' | 'zh';

/* Chinese edition is switched off for now: the toggle renders greyed out and
   a saved "zh" preference is ignored. Flip to true to bring it back. */
const ZH_ENABLED = false;

/* Light/dark toggle. Stateless: the icon swap is CSS keyed off
   html[data-theme]. Duplicated per page (isolation rule). */
function ThemeToggle() {
  return (
    <button
      type="button"
      className="ai-theme"
      aria-label="Toggle dark mode"
      onClick={() => {
        const el = document.documentElement;
        const next = el.dataset.theme === 'dark' ? 'light' : 'dark';
        el.dataset.theme = next;
        try {
          localStorage.setItem('theme', next);
        } catch {
          /* private mode etc. — theme still applies for this visit */
        }
      }}
    >
      <svg
        className="ai-theme__sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg
        className="ai-theme__moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
      </svg>
    </button>
  );
}

/* Footer language switch: shows the language you'd switch TO.
   Duplicated per page (isolation rule, same as ThemeToggle). */
function LangToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
}) {
  return (
    <button
      type="button"
      className="ai-lang"
      disabled={!ZH_ENABLED && lang === 'en'}
      aria-label={lang === 'en' ? '切换到中文' : 'Switch to English'}
      onClick={() => onChange(lang === 'en' ? 'zh' : 'en')}
    >
      {lang === 'en' ? '中文' : 'English'}
    </button>
  );
}

/* ── the list ──────────────────────────────────────────────────────
   One row per personal project. img and href are optional so a row can go
   in before its thumbnail or link exists: no img renders a blank tile, no
   href renders a plain (unlinked) row. External hrefs open in a new tab. */
type L10n = { en: string; zh: string };
type Post = {
  id: string;
  title: L10n;
  tags: L10n;
  img?: string;
  alt?: L10n;
  href?: string;
};

/* Six personal projects, in the order Sherry listed them. Every row opens
   the live project in a new tab. Thumbnails are 800x600 captures of each
   site in public/ai/ (Linkly reuses the homepage cover, since its live
   URL opens on a sign-in screen). */
const POSTS: Post[] = [
  {
    id: 'ai-papers',
    href: 'https://sherrrrryz.github.io/ai-papers/index.html',
    img: '/ai/ai-papers.jpg',
    alt: {
      en: 'A searchable table of AI-related CHI papers with year, type and topic filters.',
      zh: 'AI 相关 CHI 论文的可搜索表格，带年份、类型和主题筛选。',
    },
    title: { en: 'AI CHI Papers', zh: 'AI CHI 论文库' },
    tags: {
      en: 'HCI research · Paper library · Search and filters',
      zh: 'HCI 研究 · 论文库 · 搜索筛选',
    },
  },
  {
    id: 'linkly',
    href: 'https://linkly-sable-chi.vercel.app/',
    img: '/simple/off-clock/linkly/cover.jpg',
    alt: {
      en: 'Linkly cover: where every travel link finds its place.',
      zh: 'Linkly 封面：让每条旅行链接都有归处。',
    },
    title: { en: 'Linkly', zh: 'Linkly' },
    tags: {
      en: 'Web app · Travel links · Design to build',
      zh: 'Web 应用 · 旅行链接 · 从设计到上线',
    },
  },
  {
    id: 'app-docs-kit',
    href: 'https://app-docs-kit.vercel.app/#/',
    img: '/ai/app-docs-kit.jpg',
    alt: {
      en: 'App Docs Kit overview page: a project documentation framework written for AI agents.',
      zh: 'App 文档模板包概览页：一套给 AI 代理读的项目文档框架。',
    },
    title: { en: 'App Docs Kit', zh: 'App 文档模板包' },
    tags: {
      en: 'AI agents · Documentation framework · Templates',
      zh: 'AI 代理 · 文档框架 · 模板',
    },
  },
  {
    id: 'skill-lab',
    href: 'https://sherrrrryz.github.io/skillmap/index.html',
    img: '/ai/skill-lab.jpg',
    alt: {
      en: 'Skill Lab: a guide explaining what an AI agent skill is, section by section.',
      zh: 'Skill Lab：分章节讲解 AI 代理技能是什么的指南。',
    },
    title: { en: 'Skill Lab', zh: 'Skill Lab' },
    tags: {
      en: 'AI agents · Skills · Guide and compare tool',
      zh: 'AI 代理 · 技能 · 指南与对比工具',
    },
  },
  {
    id: 'relay',
    href: 'https://sherrrrryz.github.io/relay/prototype/#gallery',
    img: '/ai/relay-kit.jpg',
    alt: {
      en: 'Front of the Relay business debit card from the Activity Kit gallery.',
      zh: 'Activity Kit 组件库里的 Relay 商务借记卡正面。',
    },
    title: { en: 'Relay Activity Kit', zh: 'Relay Activity Kit' },
    tags: {
      en: 'Component gallery · Interaction experiments · Figma',
      zh: '组件库 · 交互实验 · Figma',
    },
  },
  {
    id: 'text-reader',
    href: 'https://text-reader-mu.vercel.app/',
    img: '/ai/text-reader.jpg',
    alt: {
      en: 'Text Reader: upload a text, read it and collect highlighted words.',
      zh: 'Text Reader：上传文本，阅读并收集高亮的单词。',
    },
    title: { en: 'Text Reader', zh: 'Text Reader' },
    tags: {
      en: 'Reading tool · Highlights · Word list',
      zh: '阅读工具 · 高亮 · 生词本',
    },
  },
];

function PostRow({ p, lang }: { p: Post; lang: Lang }) {
  const inner = (
    <>
      <div className="ai-post__thumb">
        {p.img ? (
          <Image src={p.img} alt={p.alt ? p.alt[lang] : ''} fill sizes="220px" />
        ) : null}
      </div>
      <div className="ai-post__body">
        <h2 className="ai-post__title">{p.title[lang]}</h2>
        <p className="ai-post__tags">{p.tags[lang]}</p>
      </div>
    </>
  );
  return (
    <li className="ai-list__item">
      {p.href ? (
        /^https?:/.test(p.href) ? (
          <a href={p.href} className="ai-post" target="_blank" rel="noopener noreferrer">
            {inner}
          </a>
        ) : (
          <Link href={p.href} className="ai-post">
            {inner}
          </Link>
        )
      ) : (
        <div className="ai-post">{inner}</div>
      )}
    </li>
  );
}

/* All inline page copy. */
const UI = {
  en: {
    navMark: 'Xueyi Zhou',
    kicker: 'AI Related · Xueyi (Sherry) Zhou',
    heroLine: 'AI Related.',
    fHome: 'Home',
    fAbout: 'About',
    fProjects: 'Projects',
    fAI: 'AI Related',
    colophon: 'Xueyi (Sherry) Zhou © 2026',
  },
  zh: {
    navMark: '周雪怡',
    kicker: 'AI 相关 · 周雪怡 (Sherry)',
    heroLine: 'AI 相关。',
    fHome: '首页',
    fAbout: '关于',
    fProjects: '项目',
    fAI: 'AI 相关',
    colophon: '周雪怡 (Sherry) © 2026',
  },
} as const;

export default function AiRelated() {
  const [lang, setLang] = useState<Lang>('en');

  /* Restore the saved language after hydration (SSR is always English, so
     the first client render matches the server markup — no mismatch). */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang');
      if (saved === 'en' || (ZH_ENABLED && saved === 'zh')) setLang(saved);
    } catch {
      /* private mode etc. — stay in English */
    }
  }, []);

  /* Keep <html lang> honest for screen readers / search engines. */
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const changeLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem('lang', l);
    } catch {
      /* private mode etc. — language still applies for this visit */
    }
  };

  const u = UI[lang];

  return (
    <div className="ai-root">
      <nav className="ai-nav" aria-label="Primary">
        <Link href="/" className="ai-nav__mark">
          {u.navMark}
        </Link>
        <div className="ai-nav__side">
          <Link href="/" className="ai-nav__link">
            {u.fHome}
          </Link>
          <Link href="/about" className="ai-nav__link">
            {u.fAbout}
          </Link>
          <Link href="/projects" className="ai-nav__link">
            {u.fProjects}
          </Link>
          <Link href="/ai" className="ai-nav__link" aria-current="page">
            {u.fAI}
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <header className="ai-section ai-hero">
        <div className="ai-wrap">
          <div className="ai-hero__kicker">{u.kicker}</div>
          <h1 className="ai-hero__line">{u.heroLine}</h1>
        </div>
      </header>

      <section className="ai-section ai-posts">
        <div className="ai-wrap">
          <ul className="ai-list">
            {POSTS.map((p) => (
              <PostRow p={p} lang={lang} key={p.id} />
            ))}
          </ul>
        </div>
      </section>

      <footer className="ai-section ai-foot">
        <div className="ai-wrap">
          <div className="ai-colophon">
            <span>{u.colophon}</span>
            <LangToggle lang={lang} onChange={changeLang} />
          </div>
        </div>
      </footer>
    </div>
  );
}
