"use client";

/* Light/dark toggle for the AppLovin OOBE case study. Stateless on
   purpose: the visible icon is swapped by CSS keyed off html[data-theme]
   (see .alo-theme in oobe.css), so SSR markup never disagrees with the
   client. Duplicated per page, same as the homepage and lockscreen copies
   (isolation rule: themed pages share tokens.css only, never TSX). */
export default function ThemeToggle() {
  return (
    <button
      type="button"
      className="alo-theme"
      aria-label="Toggle dark mode"
      onClick={() => {
        const el = document.documentElement;
        const next = el.dataset.theme === "dark" ? "light" : "dark";
        el.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {
          /* private mode etc. — theme still applies for this visit */
        }
      }}
    >
      <svg
        className="alo-theme__sun"
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
        className="alo-theme__moon"
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
