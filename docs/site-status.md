# Site Status

Snapshot of what's live and what still needs building. Update whenever a scaffold lands or a section ships. Use this as the "where are we" doc; use [`prd.md`](./prd.md) for the full spec.

Last updated: 2026-07-04 (homepage replaced: the plain monochrome edition, formerly `/simple`, is now `/`; the scroll-driven Story page is archived).

## Homepage replacement (2026-07-04)

The Story page (7-section scroll-driven experience, `app/_story/**`) and the two lab playgrounds (`/lab/ds`, `/lab/reveal`) were deleted from the working tree and archived at git tag **`archive/story-page`**. The plain edition that lived at `/simple` was promoted to `/` (`app/page.tsx` + `app/simple.css`), and `/simple` now 308-redirects to `/` via `next.config.ts`.

Still in the tree and shared:

- `app/_styles/tokens.css` — imported by `app/page.tsx`. The LAYER 2.5 `[data-theme]` palettes are currently unused (kept for future pages).
- `app/_lab/ui/` — copy-paste primitives (Button, Card, Badge, Input, Separator, Sheet, Dropdown). No current importers; step 1 of the component sourcing ladder in CLAUDE.md.
- All `public/` assets — the plain homepage reuses the Story page's imagery (`lockscreen-web/`, `section1-*/`, `section2/`, `section3-3/`, `simple/off-clock/`).

## Pages

| Page | Status | Route | Notes |
|---|---|---|---|
| Home (plain edition) | built | `/` | Hero rotating role + 01 Millions (5 marquee rows) + 02 Business (A/B cards) + 03 Teams (workshop grid, hover phrases) + 04 Evidence + Curiosity (off-clock lightbox) + 05 Contact. Scroll-driven page-bg swap (`data-bg` on `.sm-root`) is the only scroll choreography. |
| Story (old home) | archived | — | git tag `archive/story-page`. Recover primitives from there if needed. |
| Overview | not built | `/overview` | PRD §1.1 — elevator-pitch view. Footer already links to it. |
| Projects | not built | `/projects` | Case-study grid. Lockscreen detail already exists at `/projects/lockscreen/detail` but no index grid yet. Footer already links to it. |
| Lockscreen case study | built (legacy, OFF-LIMITS) | `/projects/lockscreen` + `/detail` | Isolated; styled by `globals.css`. |

## Outstanding

Design work to scope: Overview page · Projects index · Case-study detail template.

Homepage follow-ups:
- Footer links to `/overview` and `/projects` currently 404 (pages not built yet, links kept intentionally per PRD).
- Optional: prune the unused `[data-theme]` LAYER 2.5 block from `tokens.css` if no future page adopts it.

Content: S6-style closing copy was folded into the plain contact section; no pending copy.
