# Site Status

Snapshot of what's live and what still needs building. Update whenever a scaffold lands or a section ships. Use this as the "where are we" doc; use [`prd.md`](./prd.md) for the full spec.

Last updated: 2026-07-04 (homepage replaced: the plain monochrome edition, formerly `/simple`, is now `/`; the scroll-driven Story page is archived).

## Homepage replacement (2026-07-04)

The Story page (7-section scroll-driven experience, `app/_story/**`) and the two lab playgrounds (`/lab/ds`, `/lab/reveal`) were deleted from the working tree and archived at git tag **`archive/story-page`**. The plain edition that lived at `/simple` was promoted to `/` (`app/page.tsx` + `app/simple.css`), and `/simple` now 308-redirects to `/` via `next.config.ts`.

Still in the tree and shared:

- `app/_styles/tokens.css` — imported by `app/page.tsx` and `app/projects/lockscreen/page.tsx`. Pruned in the 2026-07-04 redundancy cleanup: the LAYER 2.5 `[data-theme]` palettes, LAYER 3 component tokens, LAYER 3.5 re-substitution block, and `.stage-*` utilities were deleted (Story-page exclusive, zero consumers); Layer 1 primitives + Layer 2 semantics + the Tailwind `@theme` block remain as the design-system base.
- All `public/` assets — the plain homepage reuses the Story page's imagery (`lockscreen-web/`, `section1-*/`, `section2/`, `section3-3/`, `simple/off-clock/`).

Removed in the 2026-07-04 redundancy cleanup (recover from git history if needed): `app/_lab/` (ui stash + `cn()` util), `app/components/{project3col,projectimg,sectionDivider,twocol}.tsx`, and the npm deps `lenis`, `swiper`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `class-variance-authority`, `clsx`, `tailwind-merge`. Kept: `app/components/fadeIn.tsx` + `pageheader.tsx` (imported by the off-limits detail deck) and `lucide-react` (same).

## Pages

| Page | Status | Route | Notes |
|---|---|---|---|
| Home (plain edition) | built | `/` | Hero rotating role + 01 Millions (5 marquee rows) + 02 Business (A/B cards) + 03 Teams (workshop grid, hover phrases) + 04 Evidence + Curiosity (off-clock lightbox) + 05 Contact. Scroll-driven page-bg swap (`data-bg` on `.sm-root`) is the only scroll choreography. |
| Story (old home) | archived | — | git tag `archive/story-page`. Recover primitives from there if needed. |
| Overview | not built | `/overview` | PRD §1.1 — elevator-pitch view. Footer already links to it. |
| Projects | not built | `/projects` | Case-study grid. Lockscreen detail already exists at `/projects/lockscreen/detail` but no index grid yet. Footer already links to it. |
| Lockscreen case study | built (redesigned 2026-07-04) | `/projects/lockscreen` | Landing restyled to the homepage's monochrome editorial look (`lockscreen.css`, `lsx-` prefix, consumes `tokens.css`). SeeDetail password gate + contact modal restyled, logic unchanged. |
| Lockscreen detail deck | built (legacy, OFF-LIMITS) | `/projects/lockscreen/detail` | Slide deck, still isolated and styled by `globals.css`. Reached via the 6-digit gate on the landing page. |

## Outstanding

Design work to scope: Overview page · Projects index · Case-study detail template.

Homepage follow-ups:
- Footer links to `/overview` and `/projects` currently 404 (pages not built yet, links kept intentionally per PRD).

Known issues (found in the 2026-07-04 redundancy scan, deliberately not fixed yet):
- `/api/send-email` route does not exist, but the lockscreen SeeDetail modal's contact form POSTs to it, so sending always fails. Either implement the route (e.g. Resend) or drop the form.
- ~57MB of `public/` assets have zero code references and can be deleted in a follow-up pass: whole dirs `story-lockscreens/` (14MB), `photos/` (20MB), `miui/` (2.3MB), `toucharea/`, `s4/`; orphans `lockscreen/1-14.png`, `1-15.png`, `1-17.png`, `1-18.png`; root-level `projectimg1-4.png`, `myimg.png`, `dark/light-mode-demo.png`, `huawei/xiaomi/applovin.png`, `avatar.png`, `logo.png`, `profile.png`. Re-verify each with a repo-wide grep before deleting.

Content: S6-style closing copy was folded into the plain contact section; no pending copy.
