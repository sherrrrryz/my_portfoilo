# Site Status

Snapshot of what's live on `/` and what still needs building. Update whenever a scaffold lands or a section ships. Use this as the "where are we" doc; use [`prd.md`](./prd.md) for the full spec.

Last updated: 2026-04-30 (theme system landed — sections now driven by body[data-theme]).

## Nav

Story page (`/`) and other routes now share `app/_story/components/StoryNav.tsx`. Spec: PRD §1.2 + §2.2 + Figma node 126:844. Two variants: `story` (full — wordmark + 5 flip buttons) and `compact` (wordmark only). Behavior: scroll-driven `body[data-theme]` + active/revealed states (one-way reveal); 3D `rotateX(180deg)` flip from `？？？` → label per PRD §2.2; dropdown + mobile sheet via shadcn-pattern Radix primitives in `app/_lab/ui/`. Old `PillNav` removed.

## Pages

| Page | Status | Route | Notes |
|---|---|---|---|
| Story | partial | `/` | S0–S5 built. S6 (Closing) not started. |
| Overview | not built | `/overview` | PRD §1.1 — elevator-pitch view |
| Projects | not built | `/projects` | Case-study grid. Lockscreen detail already exists at `/projects/lockscreen/detail` but no index grid yet. |
| DS playground | built | `/lab/ds` | Token live-edit (semantic) + `09 · Themes` tab — 6 per-section palettes, mini-preview, Apply globally. See [design-system.md](./design-system.md). |
| Reveal playground | built | `/lab/reveal` | |

## Story sections

| # | Section | Status | Notes |
|---|---|---|---|
| 0 | Opening (flashlight) | built | `PortfolioScene` + `FlowingRows` + `RotatingRole`. Role-flip copy list still pending. |
| 1 | For Millions | built | `LockscreenPile` · `BeforeAfterSlider` · `FoldableCarousel`. Bg + text + footer + eyebrow consume `var(--theme-*)`; ScrollReveal CSS forced to `color: inherit`. **Pending**: PRD §4.3 unified choreography (shared "It means" + 3-group pile) — spec-only. |
| 2 | For Business | built (bg themed) | `BeforeAfterSlider` · `FoldableCarousel` · `ABVote` · `ComparisonCard`. Section bg → `var(--theme-surface-1)`. Inner text colors still legacy — needs follow-up. |
| 3 | For Teams | built (bg themed) | `s3/QuoteHover` · `s3/WorkshopWall` etc. Section bg → `var(--theme-surface-1)`. Mobile hover fallback + inner text migration pending. |
| 4 | For Evidence | built (bg themed) | `s4/FeSection` · `s4/MethodGrid` · `s4/EvervaultCard` · `s4/FtIntroSection`. Section bg → `var(--theme-surface-1)`. Old internal light→dark GSAP scrub removed (obsolete under §2.4 cream spec). |
| 5 | Curiosity | built (bg themed) | `s5/BioRow` · `s5/PhotoStackGrid` · `s5/Polaroid`. Section bg → `var(--theme-surface-1)` (now white). **Visible regression**: `.cu-section` text still `--ink-on-dark-primary` (white) → white-on-white. Needs text-color migration. |
| 6 | Closing | not started | Contact block (PRD §9). No markup, no component, no CSS yet. |

## Design system rollout

| Item | Status |
|---|---|
| `app/_styles/tokens.css` | built — 3-layer + LAYER 2.5 themes block (~580 lines) |
| `tokens.css` `[data-theme="..."]` blocks | built — 6 per-section palettes, 10 tokens each (`--theme-surface-1/2`, `--theme-text-1/2/3`, `--theme-accent-1/2`, `--theme-btn-1/2/3`). Spec source: [`prd.md`](./prd.md) §2.4. |
| **Body-level theme switching (PRD §2.3)** | **built** — `app/page.tsx` `useEffect` creates 5 ScrollTriggers at each section's `bottom 55%`, flips `body[data-theme]` opening → millions → business → teams → evidence → curiosity. Cleaned up on unmount. |
| **Section bg consumes `--theme-surface-1`** | **built** — S0 (page.tsx inline) · S1 (page.tsx 3 sections) · S2 (`.fb-section`) · S3 (`.ft-section`) · S4 (`.fe-section` initial) · S5 (`.cu-section`). All have `transition: background-color 0.4s ease`. |
| **Bridge sections deleted** | **done** — 3 `.fb-bridge` sections removed from `page.tsx` (S1→S2, S2→S3, S3 internal) per PRD §2.3. CSS `.fb-bridge` selectors in `for-business.css` are now orphaned. |
| `app/_lab/ui/*` primitives | built — Button / Card / Badge / Input / Separator / DropdownMenu / Sheet |
| `/lab/ds` playground | built — live color picker (semantic), specs, story specimens |
| `/lab/ds` `09 · Themes` tab | built (v1, view-only) — 6 ThemeCards, mini-preview, "Apply globally" toggles `<html data-theme="X">`. |
| `app/_story/styles/for-teams.css` | fully token-ified — 0 hex |
| `app/_story/styles/for-evidence.css` | fully token-ified — 0 hex |
| `app/_story/styles/for-business.css` | fully token-ified — 0 hex (rgba shadows remain, not blocking) |
| `app/_story/styles/curiosity.css` | hybrid — 8 hex remain (sticky-note bg, polaroid bg, pin gradient) |
| `app/_story/styles/flashlight.css` | mostly token-ified — 3 hex remain |
| `app/_story/styles/LockscreenPile.css` | not token-ified — 1 hex, 0 token uses |
| `app/page.tsx` inline styles | mostly token-ified — `.fl-root` wrapper still `#0a0a0a` / `#fff`; Glow/Flat toggle uses `#ffd27a` / `#ffffff`. S0 section + S1 sub-sections fully on `var(--theme-*)`. |

## Scroll primitives available

Full inventory + recipes: [`scroll-patterns.md`](./scroll-patterns.md) §2.

Short list: `LenisProvider` / `useLenis()` · `useMotion` · `.gpu` · `ScrollFloat` · `ScrollReveal` · `Reveal` · `LockscreenPile` · `ScrollSnap` (unused) · `FlowingRows` · `PortfolioScene`.

## Outstanding — tracked in PRD §11

Content to finalize: opening role-flip list · S2 background copy · S6 Closing copy.

Assets to gather: any final-pass swaps for placeholder photos in S3 / S4 / S5 (placeholders are in).

Design work to scope: S6 Closing block · Overview page · Projects index · Case-study detail template · S3 hover mobile fallback · S5 hex → token sweep · `app/page.tsx` Section 0 inline-style → token sweep.

Theme system follow-up:
- **Inner text-color migration** — sections currently inherit legacy `--ink-primary` etc. for body text. Most visible breaks: S5 white-on-white, S2/S3 dark-on-dark contrast on the new themed bg. S1 already migrated as a precedent.
- **Themes tab v2** — per-swatch color picker for live-editing each `[data-theme]` block in-browser.
- **Orphan `.fb-bridge` CSS** — `for-business.css` still defines `.fb-bridge` / `.fb-bridge__copy` after bridge `<section>` deletion. Sweep when next touching that file.

PRD-only spec pending code:
- **S1 unified §4.3 choreography** — shared "It means" anchor + crossfade + 3-group pile (§4.3.2 timeline). S1 still ships legacy independent-section layout.
