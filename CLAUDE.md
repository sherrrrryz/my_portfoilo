# Portfolio — Entry Notes for Claude

Personal portfolio of Xueyi (Sherry) Zhou at `xueyizhou.xyz`. Next.js 15 + React 19 + Tailwind v4 + GSAP ScrollTrigger + Lenis.

## Start here

Read in this order. Skim the first three on every new task; read the 4th before touching scroll.

1. **[docs/prd.md](docs/prd.md)** — site spec. Three pages (Story · Overview · Projects), 7 Story sections, every copy line + interaction beat.
2. **[docs/site-status.md](docs/site-status.md)** — what's built, what's next. Check here before asking "which section is done?"
3. **[docs/design-system.md](docs/design-system.md)** — tokens + primitives + playground. Read before styling anything new.
4. **[docs/scroll-patterns.md](docs/scroll-patterns.md)** — GSAP ScrollTrigger / Lenis recipes + already-built primitives. Read before designing a new scroll behavior.

Optional skill (for Claude sessions that install it): `~/.claude/skills/scroll-experience/SKILL.md` covers GSAP / parallax / perf / a11y at a conceptual level.

## Legacy isolation · OFF-LIMITS paths

The Xiaomi lockscreen case study is an **older artifact kept intact** to be reused in the future once the new Projects page is built. It must stay isolated from the new Story-driven homepage codebase. **Do not edit, rename, move, refactor, reformat, or import from any of the following.** If a task tempts you to touch them, stop and ask the user.

**Lockscreen page + modal:**
```
app/projects/lockscreen/page.tsx
app/projects/lockscreen/SeeDetailButton.tsx
app/projects/lockscreen/SeeDetailContext.tsx
app/projects/lockscreen/SeeDetailModal.tsx
```

**Lockscreen detail (full slide deck):**
```
app/projects/lockscreen/detail/page.tsx
app/projects/lockscreen/detail/slideData.ts
app/projects/lockscreen/detail/speaker-notes.md
app/projects/lockscreen/detail/components/**    (all slide components)
app/projects/lockscreen/detail/hooks/**         (presentation hooks)
```

**Shared primitives that lockscreen depends on — kept only for its sake:**
```
app/components/fadeIn.tsx
app/components/pageheader.tsx
app/components/project3col.tsx
app/components/projectimg.tsx
app/components/sectionDivider.tsx
app/components/twocol.tsx
```

**Shared `app/globals.css`** — read-only for us. It declares legacy CSS variables (`--accent: #2EA82C`, `.prose`, `.dark` mode ramp, MDX typography) that lockscreen consumes. The new design system in `app/_styles/tokens.css` is **separate** — imported only from `app/page.tsx` and `/lab/*` routes. Don't merge the two, don't collapse variables across them, don't add `@import` from one file to the other.

**Isolation rule in one line:** the new Story page (`/`) and the lockscreen route (`/projects/lockscreen/**`) must never share a TSX import, and their styling lives in two separate files. The only shared file is `globals.css`, which neither side rewrites.

## Other hard constraints

- **Don't push `main` without explicit user approval.** Vercel auto-deploys.
- **Animation stack split by concern.**
  - **Scroll-driven motion → GSAP + Lenis only.** Never import `useScroll`, `useTransform`, `useSpring`, or `whileInView` from framer-motion when the driver is scroll progress. All parallax, pinning, stagger-on-scroll, and scrub animations must go through GSAP ScrollTrigger synced with Lenis via `lenis.on('scroll', ScrollTrigger.update)`. Mixing Lenis's smoothed position with framer-motion's raw `window.scrollY` reader causes visible desync drift.
  - **Non-scroll UI motion → framer-motion OK.** Modal enter/exit, menu toggle, tooltip fade, `<AnimatePresence>`, `layout` prop, `whileHover` / `whileTap` / `whileFocus`, state-driven `animate` — use framer-motion freely (already installed). No `motion-one` / `locomotive-scroll` / any other scroll lib.
  - **Rule of thumb:** if the animation's progress depends on where the user has scrolled → GSAP. If it depends on React state (open/closed, hovered/not) → framer-motion is fine.
  - **Still off-limits:** `app/components/fadeIn.tsx` — legacy, belongs to lockscreen. Don't edit or copy from it.
- **Monochrome first.** The site reads black / white / gray by default. Accent green and highlight terracotta are opt-in — use only for (a) system feedback (errors, success), (b) interaction affordance (link hover, focus ring, active state), or (c) deliberate editorial emphasis (one word, one datum, one tag). Never as default surface color. Full rules: [docs/design-system.md#rules](docs/design-system.md#rules).
- **Copy style**: avoid em dashes in user-facing copy — use periods or commas. The PRD has quoted copy with em dashes; preserve those verbatim (they are source material, not new writing).

## Component sourcing order

Before writing a new component, walk this ladder in order. Stop at the first step that can cover the need.

1. **Existing primitives in this repo.** Check:
   - `app/_story/lib/` — `LenisContext`, `Reveal`, `useMotion`, `gpu`
   - `app/_story/components/` — `ScrollFloat`, `ScrollReveal`, `LockscreenPile`, `FlowingRows`, `PortfolioScene`, `MonoCornerLabel`, `ComparisonCard`
   - `app/_lab/ui/` — `Button`, `Card`, `Badge`, `Input`, `Separator`

2. **Preferred free copy-paste libraries** (in this order):
   - https://ui.aceternity.com/components
   - https://magicui.design/docs/components
   - https://www.reactbits.dev/

   Workflow: WebFetch the component source. If the fetch is blocked (Cloudflare / JS-rendered / rate-limited), **ask the user to paste the source manually** rather than giving up. Land the source under `app/_lab/ui/` or `app/_story/components/` and rewrite it to consume our tokens (`var(--accent)`, `--ink-primary`, `--surface-1`, etc.) instead of whatever colors the original shipped with.

   **Motion rewrite requirement (conditional):** these libraries often use framer-motion.
   - If the framer-motion code is **scroll-coupled** (`useScroll`, `useTransform`, `useSpring` driven by scrollY, `whileInView`) → **must rewrite** in GSAP + Lenis before landing. See the animation stack rule above.
   - If it's **non-scroll UI motion** (enter/exit, hover, layout, state-driven `animate`) → **keep as-is**.
   - Component tokens still need rewriting either way — swap hardcoded colors for our `var(--*)` tokens.

3. **[shadcn/ui source](https://ui.shadcn.com)** — for baseline accessible primitives not covered above (Dialog, Tabs, Accordion, Dropdown, Popover, Sheet, etc.). Copy-paste pattern, not the CLI. Same token rewrite rule.

4. **Headless / a11y libs** — [Radix UI](https://www.radix-ui.com/) or [Headless UI](https://headlessui.com/) — when a11y semantics require it and copy-paste templates don't cover it. These are runtime dependencies; only install if truly needed.

5. **Hand-write** — last resort. When you do, document the "why not use X" decision in [docs/scroll-patterns.md](docs/scroll-patterns.md) §2 "自写判定" (for scroll primitives) or as a short comment above the component (for UI). "I couldn't be bothered to look" is not a valid reason; "the existing options all depend on framer-motion which violates the animation stack, and the motion choreography is specific to this beat" is.

## Live routes

- `/` — Story page (`app/page.tsx` → `app/_story/components/*`)
- `/lab/ds` — design-system playground (bound to `app/_styles/tokens.css`, live-edit color tokens)
- `/lab/reveal` — Reveal primitive playground
- `/projects/lockscreen` — case study landing (OFF-LIMITS)
- `/projects/lockscreen/detail` — case study deep-dive (OFF-LIMITS)

The pre-rewrite archive lives at git tag `archive/pre-flashlight-only`.

## Typical workflow

1. Figure out what section / component the task touches → look it up in `docs/prd.md`.
2. Check `docs/site-status.md` to see if scaffolding already exists.
3. Style with `var(--token)` from [app/_styles/tokens.css](app/_styles/tokens.css). Don't write hex codes.
4. Reuse scroll primitives from `app/_story/lib/` + `app/_story/components/` before writing new ones. See [docs/scroll-patterns.md](docs/scroll-patterns.md) §2.
5. Verify with `pnpm run dev` + preview tools: `/` renders, `/projects/lockscreen` still renders, console 0 errors.
6. Commit locally with a descriptive message. Do NOT push unless user says so.
7. If a new scroll pattern or design-system rule emerged, update the relevant doc (protocol: write the finding into the doc in the same commit that introduces it).
