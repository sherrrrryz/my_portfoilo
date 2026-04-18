# Portfolio — Entry Notes for Claude

Personal portfolio of Xueyi (Sherry) Zhou at `xueyizhou.xyz`. Next.js 15 + React 19 + Tailwind v4 + GSAP ScrollTrigger + Lenis.

## Start here

Before editing anything, read in this order:

1. **[docs/REWRITE_PLAN.md](docs/REWRITE_PLAN.md)** — the self-contained plan for how this site is being rebuilt. Routes, constraints, primitives to build, gotchas, git state, verification. **§0 lists hard-off-limits paths.**
2. **[docs/scroll-patterns.md](docs/scroll-patterns.md)** — scroll animation knowledge base (ScrollTrigger modes, Snap types, recipes, pitfalls).
3. **`~/.claude/skills/scroll-experience/SKILL.md`** — installed skill covering GSAP/parallax/performance/a11y. Read when designing any new scroll behavior.

## Hard constraints

- **Do NOT touch `app/projects/lockscreen/**` or `app/components/{fadeIn,pageheader,project3col,projectimg,sectionDivider,twocol}.tsx`** — see `docs/REWRITE_PLAN.md` §0.
- Don't push `main` without explicit user approval (Vercel auto-deploys).
- Single animation stack: GSAP + Lenis only. No framer-motion, motion one, or locomotive-scroll except the existing `fadeIn.tsx` which lockscreen depends on.

## Live routes

- `/` — Story page (`app/page.tsx` → `app/_story/components/*`)
- `/projects/lockscreen` — case study landing (off-limits)
- `/projects/lockscreen/detail` — case study deep-dive (off-limits)

Everything else was archived at git tag `archive/pre-flashlight-only`.

## Typical workflow

1. User asks for a change → consult `REWRITE_PLAN.md` phase it belongs to
2. Edit under `app/_story/` or `app/page.tsx` (never `app/projects/lockscreen/`)
3. Verify with `pnpm run dev` + preview tools: `/` renders, `/projects/lockscreen` still renders, console 0 errors
4. Update `docs/scroll-patterns.md` if introducing a new scroll pattern (protocol in `REWRITE_PLAN.md` §6)
5. Commit locally — do NOT push unless user says so
