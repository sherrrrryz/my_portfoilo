# Site Status

Snapshot of what's live on `/` and what still needs building. Update whenever a scaffold lands or a section ships. Use this as the "where are we" doc; use [`prd.md`](./prd.md) for the full spec.

Last updated: 2026-04-18.

## Pages

| Page | Status | Route | Notes |
|---|---|---|---|
| Story | partial | `/` | Sections 0–2 scaffolded. 3–6 not started. |
| Overview | not built | `/overview` | PRD §1.1 — elevator-pitch view |
| Projects | not built | `/projects` | Case-study grid. Lockscreen detail already exists at `/projects/lockscreen/detail` but no index grid yet. |
| DS playground | built | `/lab/ds` | Token live-edit. See [design-system.md](./design-system.md). |
| Reveal playground | built | `/lab/reveal` | |

## Story sections

| # | Section | Status | Notes |
|---|---|---|---|
| 0 | Opening (flashlight) | built | `PortfolioScene` + `FlowingRows` + `RotatingRole` |
| 1 | For Millions | partial | 1.3 lockscreen pile built · 1.4 MIUI 3-up scaffold · 1.5 foldable A/B scaffold · 1.6 transition built. Copy refinement pending. |
| 2 | For Business | scaffold | 02.A / 02.B / 02.C laid out · uses hardcoded hex from pre-tokens era → needs token refactor |
| 3 | For Teams | not started | Manager-quote hover + workshop photo wall (PRD §6) |
| 4 | For Evidence | not started | Tag scatter (PRD §7) |
| 5 | Curiosity | not started | Collage wall (PRD §8) |
| 6 | Closing | not started | Contact block (PRD §9) |

## Design system rollout

| Item | Status |
|---|---|
| `app/_styles/tokens.css` | built — 3-layer, ~435 lines |
| `app/_lab/ui/*` primitives | built — Button / Card / Badge / Input / Separator |
| `/lab/ds` playground | built — live color picker, semantic specs, story specimens |
| `app/_story/styles/flashlight.css` | NOT token-ified — still has hardcoded `#f5f1ea` etc. Refactor opportunistically. |
| `app/_story/styles/for-business.css` | NOT token-ified — same. Will refactor when S2 gets visual polish pass. |
| `app/page.tsx` inline styles | NOT token-ified — section 0 `background: '#0a0a0a'` etc. |

## Scroll primitives available

Full inventory + recipes: [`scroll-patterns.md`](./scroll-patterns.md) §2.

Short list: `LenisProvider` / `useLenis()` · `useMotion` · `.gpu` · `ScrollFloat` · `ScrollReveal` · `Reveal` · `LockscreenPile` · `ScrollSnap` (unused) · `FlowingRows` · `PortfolioScene`.

## Outstanding — tracked in PRD §11

Content to finalize: S2 background copy · S3 workshop sticky-note copy · S3 "multiple departments" hover long text · S3 emoji selection · opening role-flip list.

Assets to gather: S1 lockscreen screenshots (dozens) · S1 MIUI before/after 6-pack · S1 foldable A/B 6-pack · S2 3 lo-fi mockups · S3 team/workshop photos · S4 research screenshots · S5 personal project + life photos.

Design work to scope: Overview page · Projects index · Case-study detail template · Text-wall keyword list for opening · S3 hover mobile fallback · S5 collage rotation / overlap parameters.
