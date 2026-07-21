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

The Xiaomi lockscreen **detail deck** is an **older artifact kept intact**. It must stay isolated from the new codebase. **Do not edit, rename, move, refactor, reformat, or import from any of the following.** If a task tempts you to touch them, stop and ask the user.

**Lockscreen detail (full slide deck):**
```
app/projects/lockscreen/detail/page.tsx
app/projects/lockscreen/detail/slideData.ts
app/projects/lockscreen/detail/speaker-notes.md
app/projects/lockscreen/detail/components/**    (all slide components)
app/projects/lockscreen/detail/hooks/**         (presentation hooks)
```

**No longer off-limits (redesigned 2026-07-04):** the case-study landing (`app/projects/lockscreen/page.tsx`, `SeeDetailButton/Context/Modal.tsx`) was restyled to match the homepage's monochrome editorial look. It now imports `_styles/tokens.css` and styles itself via `app/projects/lockscreen/lockscreen.css` (`lsx-` prefix). The SeeDetail password gate is unchanged. Its contact half used to be a form POSTing to `/api/send-email`; that route was deleted in `e6a690f` and the form spent months failing silently, so on 2026-07-21 the whole email-sending path was dropped. **The site now sends no mail of its own** — every contact affordance is a plain `mailto:`. Don't reintroduce a form without a backend to match.

**Legacy primitives the detail deck still imports — off-limits with it:**
```
app/components/fadeIn.tsx       (used by detail/components/SlideSection.tsx)
app/components/pageheader.tsx   (used by detail/components/CoverSection.tsx)
```
The other four legacy primitives (project3col, projectimg, sectionDivider, twocol) were deleted in the 2026-07-04 redundancy cleanup after verifying zero importers. Note the earlier claim that all six were orphaned was wrong; when grepping for importers, never filter out path segments (`grep -v components` hid `detail/components/`).

**Shared `app/globals.css`** — read-only for us. It declares legacy CSS variables (`--accent: #2EA82C`, `.prose`, `.dark` mode ramp, MDX typography) that the detail deck consumes. The new design system in `app/_styles/tokens.css` is **separate** — imported from `app/page.tsx` and `app/projects/lockscreen/page.tsx`. Don't merge the two, don't collapse variables across them, don't add `@import` from one file to the other.

**Isolation rule in one line:** the homepage (`/`) and the lockscreen route (`/projects/lockscreen/**`) must never share a TSX import, and each keeps its page styles in its own CSS file (`simple.css` vs `lockscreen.css`); they may both consume `_styles/tokens.css`. The only other shared file is `globals.css`, which neither side rewrites.

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

1. **Existing primitives in this repo / git history.** Check:
   - The former `app/_lab/ui/` stash (`Button`, `Card`, `Badge`, `Input`, `Separator`, `Sheet`, `Dropdown`, `following-pointer`) was deleted in the 2026-07-04 redundancy cleanup (zero importers); recover from git history if needed.
   - The former Story-page scroll primitives (`LenisContext`, `Reveal`, `ScrollFloat`, `FlowingRows`, `PortfolioScene`, etc.) were deleted with the Story page; recover them from git tag `archive/story-page` if a future page needs one.

2. **Preferred free copy-paste libraries** (in this order):
   - https://ui.aceternity.com/components
   - https://magicui.design/docs/components
   - https://www.reactbits.dev/

   Workflow: WebFetch the component source. If the fetch is blocked (Cloudflare / JS-rendered / rate-limited), **ask the user to paste the source manually** rather than giving up. Land the source under `app/_lab/ui/` and rewrite it to consume our tokens (`var(--accent)`, `--ink-primary`, `--surface-1`, etc.) instead of whatever colors the original shipped with.

   **Motion rewrite requirement (conditional):** these libraries often use framer-motion.
   - If the framer-motion code is **scroll-coupled** (`useScroll`, `useTransform`, `useSpring` driven by scrollY, `whileInView`) → **must rewrite** in GSAP + Lenis before landing. See the animation stack rule above.
   - If it's **non-scroll UI motion** (enter/exit, hover, layout, state-driven `animate`) → **keep as-is**.
   - Component tokens still need rewriting either way — swap hardcoded colors for our `var(--*)` tokens.

3. **[shadcn/ui source](https://ui.shadcn.com)** — for baseline accessible primitives not covered above (Dialog, Tabs, Accordion, Dropdown, Popover, Sheet, etc.). Copy-paste pattern, not the CLI. Same token rewrite rule.

4. **Headless / a11y libs** — [Radix UI](https://www.radix-ui.com/) or [Headless UI](https://headlessui.com/) — when a11y semantics require it and copy-paste templates don't cover it. These are runtime dependencies; only install if truly needed.

5. **Hand-write** — last resort. When you do, document the "why not use X" decision in [docs/scroll-patterns.md](docs/scroll-patterns.md) §2 "自写判定" (for scroll primitives) or as a short comment above the component (for UI). "I couldn't be bothered to look" is not a valid reason; "the existing options all depend on framer-motion which violates the animation stack, and the motion choreography is specific to this beat" is.

## Live routes

- `/` — homepage, plain monochrome edition (`app/page.tsx` + `app/simple.css`)
- `/about` — about page, same monochrome edition (`app/about/page.tsx` + `app/about/about.css`, `ab-` prefix; photos in `public/about/`)
- `/simple` — 308 permanent redirect to `/` (the page used to live there; see `next.config.ts`)
- `/projects` — project index, bilingual monochrome card grid (`app/projects/ProjectsIndex.tsx` + `projects.css`, `pj-` prefix; `page.tsx` is a thin server wrapper for metadata, deliberately not a `layout.tsx`)
- `/projects/lockscreen` — case study landing, monochrome edition (`app/projects/lockscreen/page.tsx` + `lockscreen.css`)
- `/projects/lockscreen/detail` — case study deep-dive slide deck (OFF-LIMITS)

Archives: git tag `archive/story-page` holds the scroll-driven Story homepage (plus the `/lab/ds` and `/lab/reveal` playgrounds) that `/` replaced; `archive/pre-flashlight-only` is the pre-rewrite site.

## Typical workflow

1. Figure out what section / component the task touches → look it up in `docs/prd.md`.
2. Check `docs/site-status.md` to see if scaffolding already exists.
3. Style with `var(--token)` from [app/_styles/tokens.css](app/_styles/tokens.css). Don't write hex codes.
4. Before writing a new scroll primitive, check [docs/scroll-patterns.md](docs/scroll-patterns.md) §2; the built primitives it describes now live in git tag `archive/story-page`.
5. Verify with `pnpm run dev` + preview tools: `/` renders, `/projects/lockscreen` still renders, console 0 errors.
6. Commit locally with a descriptive message. Do NOT push unless user says so.
7. If a new scroll pattern or design-system rule emerged, update the relevant doc (protocol: write the finding into the doc in the same commit that introduces it).
