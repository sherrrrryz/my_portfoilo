# Site Status

Snapshot of what's live and what still needs building. Update whenever a scaffold lands or a section ships. Use this as the "where are we" doc; use [`prd.md`](./prd.md) for the full spec.

Last updated: 2026-07-07 (Chinese edition extended to the four case-study pages; see below).

## Chinese edition (2026-07-07)

`/`, `/about`, and the four case-study pages (`/projects/lockscreen`, `/projects/miui-design-system`, `/projects/applovin-oobe`, `/projects/touch-hotspots`) are now bilingual (English / Simplified Chinese). Implementation, per page (isolation rule keeps the copies separate, same as ThemeToggle):

- Every copy string in the page is an `{ en, zh }` pair (`type L10n`); data constants keep a single copy of each src/href and localize only text fields, so the languages can't drift structurally. Inline JSX copy lives in a `UI` dict; the hero sub, business body, and For-Teams quote are conditional JSX blocks because their inline-component interleaving differs by language.
- A `lang` state (`'en' | 'zh'`) is persisted in localStorage `lang` and shared across both pages; a `LangContext` + `useT()` hook feed subcomponents. SSR always renders English; the saved language is restored after hydration (no mismatch, one repaint). `<html lang>` is kept in sync (`en` / `zh-CN`).
- The toggle is a `LangToggle` button at the bottom right of the footer colophon (`.sm-lang` / `.ab-lang` / `.lsx-lang` / `.mds-lang` / `.alo-lang` / `.thz-lang`), showing the language you'd switch TO ("中文" / "English"). The case-study pages had no footer, so each gained a colophon strip (`.xxx-colophon`) under the CTA section.
- Chinese copy uses fullwidth punctuation (，：？) after CJK characters; no em dashes.
- Case-study specifics: each page.tsx became a client component ('use client'); `/projects/miui-design-system`, `/projects/applovin-oobe` and `/projects/touch-hotspots` moved their `metadata` export to a new per-route `layout.tsx` (client components can't export it; metadata stays English). Inline SVG diagram labels, captions, aria-labels and image alt text are localized too. The lockscreen SeeDetail button/modal (`SeeDetailButton/Context/Modal.tsx`) keep their own English copy — out of scope, logic untouched.
- Not yet translated: the legacy detail deck (`/projects/lockscreen/detail`). It stays English regardless of the toggle.

## Touch Hot Zone case study (2026-07-07)

`/projects/touch-hotspots` is a self-contained monochrome case-study landing (`app/projects/touch-hotspots/page.tsx` + `touch-hotspots.css`, `thz-` prefix, consumes `tokens.css`; own ThemeToggle copy per the isolation convention). Content distilled from Sherry's Framer page (static-acknowledge-295569.framer.app/project2, the 屏幕触摸热区研究 / Touch Hotspots study): the long research text is replaced by a hero stat band, five inline SVG diagrams (screen-growth vs thumb reach, two grip styles, the 8×18 zone experiment plus trial sequence, three reach bands per hand, top-tabs vs bottom-tabs before/after), a 3-up flow stat band, and the real hit-rate heatmap from `public/toucharea/Cover.png` (that directory is therefore no longer orphaned, do not delete). The homepage It-means row 4 (Touch Hot Zone) now links to it, and the dark-theme `:has()` guard in `tokens.css` includes `.thz-root`. No scroll choreography, no framer-motion, no shared TSX with other pages.

## AppLovin OOBE case study (2026-07-07)

`/projects/applovin-oobe` is a self-contained monochrome case-study landing (`app/projects/applovin-oobe/page.tsx` + `oobe.css`, `alo-` prefix, consumes `tokens.css`; own ThemeToggle copy per the isolation convention). Content distilled from Sherry's Notion page "OOBE演讲稿v3": the long speech text is replaced by a hero stat band, an inline SVG baseline-flow diagram, four constraint pictogram cards, per-experiment stat bands with hypothesis/takeaway blocks, an SVG bar chart (5-step vs 1-page survey), numbered learning rows, and six sanitized flow images downloaded to `public/oobe/`. Everything on the page is sanitized/placeholder except the uplift percentages (a dashed confidentiality strip says so). The dark-theme `:has()` guard in `tokens.css` includes `.alo-root`. Linked from the homepage 02 For Business section via a full-width case-link bar under the A/B cards (`.sm-case-link` in `simple.css`, replacing the old non-clickable `sm-footer-link` text line). No scroll choreography, no framer-motion, no shared TSX with other pages.

## MIUI Design System case study (2026-07-07)

`/projects/miui-design-system` is a self-contained monochrome case-study landing (`app/projects/miui-design-system/page.tsx` + `miui-ds.css`, `mds-` prefix, consumes `tokens.css`; own ThemeToggle copy per the isolation convention). Content distilled from Sherry's Notion deck "Miui规范v1": the long deck text is replaced by a hero stat band, an inline SVG handover diagram, research pictogram cards, problem-to-goal cards, an 8.9/10 score bar, doc-anatomy chips, and three before/after image pairs from `public/miui/` (that directory is therefore no longer orphaned). The homepage It-means row 2 (MIUI Design System 2.0) now links to it, and the dark-theme `:has()` guard in `tokens.css` includes `.mds-root`. No scroll choreography, no framer-motion, no shared TSX with other pages.

## About page (2026-07-07)

`/about` is a self-contained monochrome editorial page (`app/about/page.tsx` + `app/about/about.css`, `ab-` prefix) built from Sherry's resumes. Follows every homepage recipe: theme tokens aliased from the PAGE THEME block (the `:has()` guard in `tokens.css` now includes `.ab-root`), per-page ThemeToggle copy, emoji cursors, dark hover tooltip cards, grayscale-to-color photo hovers. Sections: hero with a hover-swap portrait, bio with hover facts, hover-to-expand career timeline, off-the-clock photo cards (snowboarding + cat pile), contact. Photos live in `public/about/` (EXIF/GPS stripped at export). No scroll choreography, framer-motion only. Homepage footer now links to it.

## Dark mode (2026-07-05)

`/` and `/projects/lockscreen` now theme light/dark from one shared grayscale: the PAGE THEME block in `app/_styles/tokens.css` (`--theme-*`, dark values on `html[data-theme="dark"]`). `simple.css` (`--sm-*`) and `lockscreen.css` (`--lsx-*`) alias it; neither page holds raw grayscale hex anymore. The attribute is resolved pre-paint by an inline script in `app/layout.tsx` (localStorage `theme`, falling back to `prefers-color-scheme`) and flipped by a per-page ThemeToggle (duplicated in `app/page.tsx` and `app/projects/lockscreen/ThemeToggle.tsx`; the isolation rule forbids sharing the component). The legacy detail deck keys off the `.dark` class, so `data-theme` never restyles it; the document-level dark rules (overscroll bg, `color-scheme`) are additionally scoped with `:has(.sm-root, .lsx-root)` so client-side navigation into the deck stays clean.

## Homepage replacement (2026-07-04)

The Story page (7-section scroll-driven experience, `app/_story/**`) and the two lab playgrounds (`/lab/ds`, `/lab/reveal`) were deleted from the working tree and archived at git tag **`archive/story-page`**. The plain edition that lived at `/simple` was promoted to `/` (`app/page.tsx` + `app/simple.css`), and `/simple` now 308-redirects to `/` via `next.config.ts`.

Still in the tree and shared:

- `app/_styles/tokens.css` — imported by `app/page.tsx` and `app/projects/lockscreen/page.tsx`. Pruned in the 2026-07-04 redundancy cleanup: the LAYER 2.5 `[data-theme]` palettes, LAYER 3 component tokens, LAYER 3.5 re-substitution block, and `.stage-*` utilities were deleted (Story-page exclusive, zero consumers); Layer 1 primitives + Layer 2 semantics + the Tailwind `@theme` block remain as the design-system base.
- All `public/` assets — the plain homepage reuses the Story page's imagery (`lockscreen-web/`, `section1-*/`, `section2/`, `section3-3/`, `simple/off-clock/`).

Removed in the 2026-07-04 redundancy cleanup (recover from git history if needed): `app/_lab/` (ui stash + `cn()` util), `app/components/{project3col,projectimg,sectionDivider,twocol}.tsx`, and the npm deps `lenis`, `swiper`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `class-variance-authority`, `clsx`, `tailwind-merge`. Kept: `app/components/fadeIn.tsx` + `pageheader.tsx` (imported by the off-limits detail deck) and `lucide-react` (same).

## Pages

| Page | Status | Route | Notes |
|---|---|---|---|
| About | built | `/about` | Hero portrait swap + bio hover facts + hover-expand timeline + off-clock photo cards. Self-contained (`ab-` prefix), consumes `tokens.css`. |
| Home (plain edition) | built | `/` | Hero rotating role + 01 Millions (5 marquee rows) + 02 Business (A/B cards) + 03 Teams (workshop grid, hover phrases) + 04 Evidence + Curiosity (off-clock lightbox) + 05 Contact. Scroll-driven page-bg swap (`data-bg` on `.sm-root`) is the only scroll choreography. |
| Story (old home) | archived | — | git tag `archive/story-page`. Recover primitives from there if needed. |
| Overview | not built | `/overview` | PRD §1.1 — elevator-pitch view. Footer already links to it. |
| Projects | not built | `/projects` | Case-study grid. Lockscreen detail already exists at `/projects/lockscreen/detail` but no index grid yet. Footer already links to it. |
| Lockscreen case study | built (redesigned 2026-07-04) | `/projects/lockscreen` | Landing restyled to the homepage's monochrome editorial look (`lockscreen.css`, `lsx-` prefix, consumes `tokens.css`). SeeDetail password gate + contact modal restyled, logic unchanged. |
| MIUI Design System case study | built | `/projects/miui-design-system` | Short visual-first landing (`miui-ds.css`, `mds-` prefix, consumes `tokens.css`). Stat band + SVG diagrams + before/after pairs from `public/miui/`. Linked from homepage It-means row 2. |
| Touch Hot Zone case study | built | `/projects/touch-hotspots` | Short visual-first landing (`touch-hotspots.css`, `thz-` prefix, consumes `tokens.css`). Stat bands + five SVG diagrams + real heatmap from `public/toucharea/`. Linked from homepage It-means row 4. |
| AppLovin OOBE case study | built | `/projects/applovin-oobe` | Short visual-first landing (`oobe.css`, `alo-` prefix, consumes `tokens.css`). Stat bands + SVG diagrams + sanitized flow images from `public/oobe/`. Linked from the homepage 02 Business case-link bar. |
| Lockscreen detail deck | built (legacy, OFF-LIMITS) | `/projects/lockscreen/detail` | Slide deck, still isolated and styled by `globals.css`. Reached via the 6-digit gate on the landing page. |

## Outstanding

Design work to scope: Overview page · Projects index · Case-study detail template.

Homepage follow-ups:
- Footer links to `/overview` and `/projects` currently 404 (pages not built yet, links kept intentionally per PRD).

Known issues (found in the 2026-07-04 redundancy scan, deliberately not fixed yet):
- `/api/send-email` route does not exist, but the lockscreen SeeDetail modal's contact form POSTs to it, so sending always fails. Either implement the route (e.g. Resend) or drop the form.
- ~55MB of `public/` assets have zero code references and can be deleted in a follow-up pass: whole dirs `story-lockscreens/` (14MB), `photos/` (20MB), `s4/` (`miui/` and `toucharea/` were reclaimed 2026-07-07 by the MIUI Design System and Touch Hot Zone case studies, do not delete); orphans `lockscreen/1-14.png`, `1-15.png`, `1-17.png`, `1-18.png`; root-level `projectimg1-4.png`, `myimg.png`, `dark/light-mode-demo.png`, `huawei/xiaomi/applovin.png`, `avatar.png`, `logo.png`, `profile.png`. Re-verify each with a repo-wide grep before deleting.

Content: S6-style closing copy was folded into the plain contact section; no pending copy.
