/* ============================================================================
   /resume — the resume as a web page, exported to PDF through the browser's
   print dialog (see resume.css @media print). Self-contained per the
   isolation rule: own CSS (`rs-` prefix), no TSX shared with other routes.

   Always renders as a light sheet of paper, on screen and in print, so it is
   deliberately NOT in the dark-theme :has() guard in tokens.css.

   English by default, Chinese at /resume?lang=zh; both render from the same
   ResumeContent shape in content.ts. Not indexed and not in the sitemap while it is a draft.
============================================================================ */

import '../_styles/tokens.css';
import './resume.css';

import type { Metadata } from 'next';
import Link from 'next/link';
import PrintButton from './PrintButton';
import { RESUME, type Bullet } from './content';

export const metadata: Metadata = {
  title: 'Resume · Xueyi Zhou',
  description: 'Resume of Xueyi (Sherry) Zhou, product designer.',
  robots: { index: false, follow: false },
};

function Bullets({
  items,
  todoLabel,
}: {
  items: readonly Bullet[];
  todoLabel: string;
}) {
  return (
    <ul className="rs-bullets">
      {items.map((b) => (
        <li key={b.text}>
          {b.text}
          {b.todo ? <span className="rs-todo">
              {todoLabel}
              {b.todo}
            </span> : null}
        </li>
      ))}
    </ul>
  );
}

function SideList({ items }: { items: readonly string[] }) {
  return (
    <ul className="rs-bullets rs-bullets--side">
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

export default async function ResumePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const r = lang === 'zh' ? RESUME.zh : RESUME.en;
  const l = r.labels;

  return (
    <div className="rs-root" lang={r.lang}>
      <div className="rs-bar">
        <Link href="/about" className="rs-bar__back">
          {l.back}
        </Link>
        <span className="rs-bar__hint">{l.exportHint}</span>
        <Link href={l.switchHref} className="rs-bar__back">
          {l.switchLabel}
        </Link>
        <PrintButton label={l.export} />
      </div>

      <article className="rs-sheet">
        <header className="rs-head">
          <div>
            <h1 className="rs-name">
              {r.name}
              <span className="rs-name__dot" aria-hidden="true">
                .
              </span>
              {r.nameAlt ? (
                <span className="rs-name__alt">{r.nameAlt}</span>
              ) : null}
            </h1>
            <p className="rs-title">{r.title}</p>
          </div>
          <ul className="rs-contact">
            {r.contact.map((c) => (
              <li key={c.label}>
                <span className="rs-contact__label">{c.label}</span>
                {c.href ? <a href={c.href}>{c.value}</a> : <span>{c.value}</span>}
              </li>
            ))}
          </ul>
        </header>

        <div className="rs-cols">
          <aside className="rs-side">
            <section>
              <h2 className="rs-h">{l.education}</h2>
              {r.education.map((e) => (
                <div className="rs-edu" key={e.degree}>
                  <h3>{e.degree}</h3>
                  <p>{e.school}</p>
                  {e.dates ? <p className="rs-edu__dates">{e.dates}</p> : null}
                </div>
              ))}
            </section>
            <section>
              <h2 className="rs-h">{l.skills}</h2>
              <SideList items={r.skills} />
            </section>
            <section>
              <h2 className="rs-h">{l.languages}</h2>
              <SideList items={r.languages} />
            </section>
            <section>
              <h2 className="rs-h">{l.personal}</h2>
              <SideList items={r.personal} />
            </section>
          </aside>

          <main className="rs-main">
            <section>
              <h2 className="rs-h">{l.profile}</h2>
              <p className="rs-profile">{r.profile}</p>
            </section>
            <section>
              <h2 className="rs-h">{l.experience}</h2>
              {r.jobs.map((job) => (
                <div className="rs-job" key={job.org}>
                  <h3 className="rs-job__role">{job.role}</h3>
                  <p className="rs-job__meta">
                    {[job.org, job.place, job.dates].filter(Boolean).join(' / ')}
                  </p>
                  {job.groups.map((g, i) => (
                    <div key={g.label ?? i}>
                      {g.label ? <h4 className="rs-job__group">{g.label}</h4> : null}
                      <Bullets items={g.bullets} todoLabel={l.todo} />
                    </div>
                  ))}
                </div>
              ))}
            </section>
          </main>
        </div>
      </article>
    </div>
  );
}
