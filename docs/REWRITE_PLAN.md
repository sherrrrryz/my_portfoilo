# Portfolio Rewrite Plan — Handoff for New Session

> **This doc is self-contained.** Any Claude Code session opening `/Users/axue/my-portfolio` can read this file and know exactly what the project is, what's been done, what the rules are, and what to build next.

---

## 0. Hard Constraint — Read First

**DO NOT modify `/projects/lockscreen` or `/projects/lockscreen/detail` in any way.**

Off-limits paths:

```
app/projects/lockscreen/page.tsx
app/projects/lockscreen/SeeDetailContext.tsx
app/projects/lockscreen/SeeDetailButton.tsx
app/projects/lockscreen/SeeDetailModal.tsx
app/projects/lockscreen/detail/**          (all 18 files: page, components, hooks, data, speaker notes)
```

Also off-limits — these `app/components/` are only kept because lockscreen uses them:

```
app/components/fadeIn.tsx
app/components/pageheader.tsx
app/components/project3col.tsx
app/components/projectimg.tsx
app/components/sectionDivider.tsx
app/components/twocol.tsx
```

If a rewrite task tempts you to touch any of these, stop and ask the user.

**The ONE allowed edit** to lockscreen code this session was the back-link target (now `"← Back to Story"` → `/`). Future sessions should leave it alone.

---

## 1. Project Snapshot

### What the site is

Personal portfolio of Xueyi (Sherry) Zhou, hosted at `xueyizhou.xyz`. Next.js 15 + App Router + React 19 + Tailwind v4 + TypeScript.

### What routes exist (after cleanup)

- `/` — **The Story page** (this is what we rewrite/extend). Was `/flashlight` before; renamed.
- `/projects/lockscreen` — Xiaomi case study landing (OFF-LIMITS).
- `/projects/lockscreen/detail` — Presentation-shell case study deep-dive (OFF-LIMITS).

Everything else was deleted to an archive tag (`archive/pre-flashlight-only` on commit `ee8df9c`, pushed to origin). To resurrect any deleted page for reference: `git show archive/pre-flashlight-only:app/<path>` or GitHub web UI at that tag.

### Tech stack (current `package.json`)

```
Runtime:  Next.js 15.3.8 / React 19.1.0
Scroll:   lenis ^1.3.23 (+ lenis/snap subpackage)
Animate:  gsap ^3.15.0  (ScrollTrigger)
Other:    framer-motion ^12.23 (used ONLY by app/components/fadeIn.tsx for lockscreen)
          lucide-react (icons in lockscreen detail)
Styling:  tailwindcss ^4.1.11
```

No `next-themes`, no `@anthropic-ai/sdk`, no MDX / blog infra. These were removed.

### Current `/` (Story page) contents

Two sections live today. Both in `app/page.tsx`:

1. **Section 0 — Opening (Flashlight beam)**: dark full-viewport. Mouse-tracked mask lights up a wall of flowing keyword text. Center heading rotates through roles ("As a Designer / Researcher / Facilitator…") via `DecryptedText` scramble. See `_story/components/PortfolioScene.tsx`, `FlowingRows.tsx`, `PortfolioContent.tsx`, `RotatingRole.tsx`, `DecryptedText.tsx`, `MaskControls.tsx`.
2. **Section 1 — "For Millions" / Xiaomi Lockscreen**: light beige `#f5f1ea`. Contains:
   - Small caps header: "I DESIGN FOR MILLIONS."
   - Question (`ScrollFloat` char-level reveal, once): "What does it mean to design for 700 million people?"
   - Answer (`ScrollReveal` word-level scrub reveal with blur + rotate): "It means making something personal — at a scale where nothing feels personal."  *(em-dash intentionally preserved — PRD-quoted copy overrides the user's general "no em-dash" feedback rule)*
   - `LockscreenPile` — 13 images staggered in 5 columns (3 on mobile) arranged in a pile silhouette. Reveals top-to-bottom once via GSAP stagger (`once: true`, sorted by visual top position).
   - Footer line: "Xiaomi Lock Screen · 2023 · View project →" → links to `/projects/lockscreen`.

Sections 2–6 from the PRD (MIUI Design System, Foldable framework, For Business, For Teams, For Evidence, Curiosity, Closing) **do not exist yet**. This plan is about building them with a better foundation than we currently have.

---

## 2. Key Files & Directories

```
app/
├── page.tsx                     # The /  route (entry for story page) - all JSX currently lives here
├── layout.tsx                   # Root: just html + body + Analytics + SpeedInsights (no nav, no theme provider)
├── globals.css                  # Tailwind + CSS variables (NOTE: tweet.css import was deleted, don't re-add)
├── error.tsx                    # Error boundary
├── not-found.tsx                # 404
├── og/route.tsx                 # OG image generation
├── sitemap.ts                   # Just / and /projects/lockscreen
├── robots.ts
├── components/                  # 6 files, lockscreen-only, OFF-LIMITS (§0)
├── lib/
│   └── config.ts                # site metaData only (baseUrl, title, description)
├── _story/                      # Private folder (underscore = not a route). Story components live here.
│   ├── components/              # 12 files - the Story page's building blocks
│   │   ├── DecryptedText.tsx
│   │   ├── FlowingRows.tsx
│   │   ├── LenisProvider.tsx    # Mounts Lenis + exposes on window.__lenis
│   │   ├── LockscreenPile.tsx   # 13-image stagger pile (Section 1 lower)
│   │   ├── MaskControls.tsx
│   │   ├── PillNav.tsx          # Brand pill nav (currently just "Story")
│   │   ├── PortfolioContent.tsx # Rotating-role hero
│   │   ├── PortfolioScene.tsx   # Flashlight mask scene
│   │   ├── RotatingRole.tsx
│   │   ├── ScrollFloat.tsx      # Char-level reveal (used by "What does it mean..." question)
│   │   ├── ScrollReveal.tsx     # Word-level reveal (used by "It means making..." answer)
│   │   └── ScrollSnap.tsx       # Lenis/snap wrapper - NOT mounted (snap was disabled, kept for future)
│   └── styles/                  # 5 CSS files mapped to the components above
│       ├── flashlight.css       # imported by app/page.tsx via side-effect
│       ├── PillNav.css
│       ├── ScrollFloat.css
│       ├── ScrollReveal.css
│       └── LockscreenPile.css
└── projects/lockscreen/         # OFF-LIMITS (§0)

public/
├── story-lockscreens/           # 13 jpg (ls-01.jpg … ls-13.jpg) - wallpapers for LockscreenPile
├── logo.png
├── favicon.ico
└── [other assets]

docs/
└── scroll-patterns.md           # Scroll animation knowledge base - needs updates per phase (§6)
```

### Reference docs on disk

- `/Users/axue/.claude/skills/scroll-experience/SKILL.md` — 609-line skill installed globally. Covers GSAP ScrollTrigger patterns, parallax layer speeds, story beats, performance, `prefers-reduced-motion` (HIGH severity), iOS GPU fixes, mobile parallax reduction, CSS scroll-timeline. **Read this before designing any new scroll behavior.**
- `/Users/axue/my-portfolio/docs/scroll-patterns.md` — Local knowledge base. 8 sections: stack, component speed-check table, ScrollTrigger 3 modes, Snap 3 types, duplicated self-written fragments, 7 future recipes, gotchas list, when to introduce new libs.
- `/Users/axue/Downloads/portfolio-prd-section0-1.md` — PRD covering architecture, Section 0 (Opening), and Section 1 (For Millions with 3 projects: Xiaomi Lockscreen ✓, MIUI Design System, Foldable). Sections 2–5 + Closing are referenced in the same PRD but not yet detailed in this file. **Assume the user has more PRD content for Sections 2–6 when that time comes; ask.**
- `CLAUDE.md` at repo root — **Stale.** Talks about an "Ephemeral Chat" backend upgrade for `/chat`, which no longer exists (route deleted). Update or delete this file early in the next session so it doesn't mislead.

---

## 3. Carry-Over Decisions (From Prior Session)

These are settled. Don't re-litigate without cause.

| Decision | Reason |
|---|---|
| Single animation stack: **GSAP + ScrollTrigger + Lenis + lenis/snap** | Avoid dual rAF loops. Framer Motion is only allowed inside lockscreen-adjacent code (`fadeIn.tsx`). |
| **No `prefers-reduced-motion` yet** — but must be added in Phase 0 | Skill lists as HIGH severity accessibility issue. User chose "delete theme-switch, re-add later if needed" so current state is: no toggle, no media query support. Phase 0 fixes this properly. |
| **Snap is disabled** on `/` | Tried `lenis/snap proximity` — felt like "冲过头再弹回" (overshoot + rubber-band). `mandatory` / `lock` types conflict with the long pile's free-scroll requirement. Revisit only if a future section is pure full-viewport slideshow. |
| **flashlight → `/` rename, `/flashlight` dir → `app/_story/`** | User wants `/` to be the landing. `_story/` underscore makes it a private folder (Next.js App Router skips routing). All imports use `./_story/components/...`. |
| **`window.__lenis` global stays for now** | Phase 0 will replace with `LenisContext` + `useLenis()` hook. Don't add new call sites to the global. |
| **`ScrollTrigger.getAll().forEach(t => t.kill())` banned** | Kills other components' triggers. Each component must keep per-tween refs and kill only its own. Already fixed in `ScrollReveal.tsx`. |
| **`invalidateOnRefresh: true` + `toggleActions` → use `once: true` instead** | First pattern can cause replay on refresh. `once` is bulletproof. `LockscreenPile` already uses this. |
| **Em-dash rule**: default no, but PRD-quoted copy preserves original punctuation | Memory feedback at `~/.claude/projects/-Users-axue-my-portfolio/memory/feedback_writing_style.md` says avoid em dashes in copy. Section 1's "personal — at a scale" retains the em dash per PRD. Future Section 2-6 copy follows memory rule unless PRD says otherwise. |

---

## 4. The Plan — Phase 0 → Section buildout

### Phase 0 — Foundation primitives (non-breaking, 0 risk)

**Goal**: Three new files under `app/_story/lib/` that unlock the rest. No existing code changes.

#### 4.0.1 `app/_story/lib/useMotion.ts`

Hook wrapping `matchMedia('(prefers-reduced-motion: reduce)')`. Returns `'full' | 'reduced'`. SSR-safe (defaults to `'full'` on server, flips in `useEffect`).

```ts
export function useMotion(): 'full' | 'reduced' {
  const [mode, setMode] = useState<'full' | 'reduced'>('full');
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMode(mq.matches ? 'reduced' : 'full');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return mode;
}
```

Every new animation reads this. When `reduced`: zero stagger, no transform, opacity-only fade, duration ≤ 0.2s.

#### 4.0.2 `app/_story/lib/LenisContext.tsx`

React Context + `<LenisProvider>` + `useLenis()` hook. Mounts Lenis, exposes instance through context, continues to set `window.__lenis` for back-compat while old call sites exist.

```tsx
const LenisCtx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisCtx);
export function LenisProvider({ children }: { children: React.ReactNode }) { /* setup, rAF, cleanup */ }
```

Replaces `app/_story/components/LenisProvider.tsx` in place (rename it to use the context pattern). `app/page.tsx` wraps story content in `<LenisProvider>`.

#### 4.0.3 `app/_story/lib/gpu.ts` + CSS class in `flashlight.css`

```css
.gpu {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  will-change: transform;
}
```

Plus helper `export const GPU = 'gpu';` for `className={GPU}`. Apply to any element that's heavily animated. Skill's iOS-fix for parallax stutter.

**Docs update**: add §2 speed-check rows for `useMotion`, `useLenis`, `.gpu`. Tag §7 gotcha entries: "use useMotion before any animation" + "window.__lenis is deprecated, use useLenis".

**Verification after Phase 0**:
- `/` and `/projects/lockscreen` still render identically
- `useLenis()` returns the live Lenis instance when mounted inside `<LenisProvider>`
- DevTools → Emulate CSS → `prefers-reduced-motion: reduce` → no new animations (existing Section 0/1 stay as-is since they haven't migrated yet)

---

### Phase 1 — `<Reveal>` primitive

**Goal**: One component that covers everything ScrollFloat and ScrollReveal do today, plus fade / slide for simpler cases.

File: `app/_story/lib/Reveal.tsx` + `app/_story/lib/Reveal.css`

```tsx
type RevealProps = {
  children: string;  // text-only for splittable modes
  mode?: 'chars' | 'words' | 'lines' | 'element';
  effect?: 'float' | 'blur' | 'slide' | 'fade';
  trigger?: 'once' | 'scrub' | 'toggle';
  stagger?: number;
  duration?: number;
  start?: string;    // GSAP ScrollTrigger start position
  end?: string;      // only for scrub
};
```

Internal logic:
1. If `mode='element'`, animate the wrapper; else split text by spec into `<span>`.
2. Read `useMotion()` — if `'reduced'`: force `trigger='once'`, `effect='fade'`, `stagger=0`, `duration=0.2`.
3. Read `useLenis()` to register ScrollTrigger.
4. Kill per-tween refs on unmount (NO `getAll().kill()`).

Section 2+ uses this. Section 0/1 keeps the existing ScrollFloat/ScrollReveal until there's a concrete reason to migrate (user requested slight behavior change, or adding a new effect they share).

**Docs update**: replace §6.1 and §6.2 recipes with a single `<Reveal>` recipe table.

**Verification**: build a throwaway test in `app/page.tsx` with `<Reveal mode="words" effect="blur" trigger="once">` — visual compare to current ScrollReveal output. Remove after confirming.

---

### Phase 2 — `<Scene>` container

**Goal**: Each PRD section declares its mode, background, and lifecycle in one place.

File: `app/_story/lib/Scene.tsx`

```tsx
type SceneProps = {
  id: string;
  bg: 'dark' | 'light' | string;     // string = custom hex
  mouseMode?: 'flashlight' | 'normal';
  pinDuration?: string;              // optional GSAP pin, e.g. '+=100%'
  onEnter?: () => void;
  onExit?: () => void;
  children: React.ReactNode;
};
```

Internal logic:
1. GSAP ScrollTrigger to drive background color transition (scrub, crossfades between Scenes).
2. Mount/unmount `PortfolioScene` (flashlight mask) when `mouseMode='flashlight'`.
3. Optional `pin: true` when `pinDuration` is set.
4. Call `onEnter`/`onExit` as the scene crosses viewport center.

`app/page.tsx` Sections 2–6 get declared as:

```tsx
<Scene id="s2-miui" bg="light" mouseMode="normal">
  <Reveal mode="words" effect="blur">It means building the system that other designers build on.</Reveal>
  {/* 3-column MIUI sliders */}
</Scene>
```

Section 0/1 migration optional — keep inline JSX unless refactor has other benefit.

**Docs update**: add §6 recipe for `<Scene>` with the 3 common patterns (continuous flow / pinned hero / background-tween transition).

---

### Phase 3 — `<ParallaxLayer>` + skill speed table

**Goal**: Give Sections 2–6 depth-based scroll storytelling.

File: `app/_story/lib/ParallaxLayer.tsx`

```tsx
type ParallaxLayerProps = {
  speed?: 0.2 | 0.5 | 1.0 | 1.2 | number;  // per skill's table
  axis?: 'y' | 'x';
  children: React.ReactNode;
};
```

Internal logic:
1. GSAP scrub tween: `y: (1 - speed) * 100%` relative to scene scroll (background `0.2` = moves slow ≈ stays still visually).
2. `useMotion()`: if `reduced` → force `speed=1.0` (no movement).
3. Mobile breakpoint (<720px): compress speed range toward 1.0 (skill: "reduce intensity, don't disable"). e.g. `0.2` → `0.6`, `1.2` → `1.1`.
4. Apply `.gpu` from §4.0.3.

**Speed reference (from SKILL.md §Parallax Storytelling)**:

| Layer | Speed | Effect |
|-------|-------|--------|
| Background | 0.2x | Far away, slow |
| Midground | 0.5x | Middle depth |
| Foreground / Content | 1.0x | Normal scroll |
| Floating elements | 1.2x | Pop forward |

**Docs update**: §6 new recipe "Parallax layer depth" with speed table.

---

### Phase 4 — Section 2 buildout (first real use of the primitives)

PRD Section 1 Project 2: **MIUI Design System 2.0 + Multi-language Framework**.

Copy: *"It means building the system that other designers build on."*

Layout: three side-by-side Before/After sliders (Components / Design Tokens / Localization). Each slider: vertical split with draggable divider, hold state, hover cursor change.

```tsx
<Scene id="s1-miui" bg="light" mouseMode="normal">
  <Reveal mode="words" effect="blur" trigger="once">
    It means building the system that other designers build on.
  </Reveal>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <BeforeAfterSlider title="Components" beforeSrc={...} afterSrc={...} />
    <BeforeAfterSlider title="Design Tokens" beforeSrc={...} afterSrc={...} />
    <BeforeAfterSlider title="Localization" beforeSrc={...} afterSrc={...} />
  </div>
  {/* Project footer link */}
</Scene>
```

New components needed:
- `app/_story/components/BeforeAfterSlider.tsx` (drag + pointer events, mobile tap-to-reveal)

Assets needed: 6 images (3 × before/after pairs). Ask user for paths when reaching this phase.

Mobile: 3-column grid collapses to 1-column vertical stack via Tailwind.

### Phase 5 — Section 2 Project 3: Foldable framework (A/B voting)

Copy: *"It means 'just make it bigger' is never the answer."*

Layout: three A/B pairs with click voting. Show Sherry's take after vote.

New components:
- `app/_story/components/ABVote.tsx` — two images, click one → reveals vote % (preset) + commentary

Assets needed: 6 images (3 A/B pairs). Ask user.

### Phase 6 — Sections 2, 3, 4, 5, Closing

PRD outlines: For Business / For Teams / For Evidence / Curiosity / Closing. PRD only fully details Section 1; Sections 2–5 are described in PRD overview but detailed content is elsewhere. **Ask user for each section's full PRD content before designing.**

---

## 5. What NOT to Do

- Don't migrate Section 0 / Section 1 to new `<Reveal>` / `<Scene>` primitives eagerly. They work. Migrate only when a change request coincides.
- Don't introduce new animation libraries (framer-motion, motion one, locomotive). Single stack is a deliberate choice.
- Don't enable CSS `animation-timeline` for primary effects yet — Safari support still spotty as of 2026-04. OK as progressive enhancement for Section 4+ decorative.
- Don't switch `<img>` to `next/image` on LockscreenPile unless a perf issue is measured. 13 images at ~800KB each = ~10MB total is acceptable for a portfolio landing.
- Don't attempt CSS "double-render" to eliminate mobile hydration flash. Not reported as user-visible issue.
- Don't push `main` without explicit user approval — Vercel auto-deploys.
- Don't touch `/projects/lockscreen/**`. See §0.

---

## 6. Docs Sync Protocol

Every phase completion must update `docs/scroll-patterns.md`:

- Phase 0 → §2 speed-check table, §7 gotchas (use `useMotion`, deprecate `window.__lenis`)
- Phase 1 → §6 recipe 6.1 + 6.2 collapsed into one `<Reveal>` entry
- Phase 2 → §6 new `<Scene>` recipe
- Phase 3 → §6 new `<ParallaxLayer>` recipe + skill speed table
- Phase 4+ → §2 new rows for BeforeAfterSlider, ABVote, etc.

Also delete/rewrite the stale root `CLAUDE.md` (still references old `/chat` backend) early in the next session.

---

## 7. Verification After Any Change

Mandatory loop before declaring done:

1. `pnpm run dev` — starts at `localhost:3000`
2. Preview `/` — Section 0 flashlight beam works, mouse-followed mask, rotating role text, scroll to Section 1 shows pile reveal
3. Preview `/projects/lockscreen` — page renders with styles, "← Back to Story" links to `/`
4. Preview `/projects/lockscreen/detail` — presentation shell loads, 18 sections render
5. DevTools Console — **zero** errors (the `<html className="light">` hydration warning should remain gone after theme-switch removal)
6. DevTools → Rendering → Emulate `prefers-reduced-motion: reduce` → after Phase 0+, animations disabled
7. Resize to 375×812 (mobile) — Section 1 pile goes 5→3 columns, no layout break

For visual-specific changes, `preview_screenshot` at top of each section.

---

## 8. Known Gotchas (carry-over)

1. **`lenis/snap` does NOT trigger on programmatic `lenis.scrollTo` calls.** It only listens to `virtualScroll` (real wheel/touch). Test snap with `window.dispatchEvent(new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true }))`, never by calling scrollTo.
2. **Preview `scrollTo` sometimes returns `0` even after scrolling.** The scroll happens in `.fl-root` vs window depending on context; query `document.documentElement.scrollTop` AND `window.scrollY` AND `.fl-root.scrollTop` to be sure.
3. **HMR after component rename leaves stale module errors.** When renaming directories (e.g. `app/flashlight/` → `app/_story/`), also `rm -rf .next/` and restart `preview_start` — otherwise console is flooded with "failed to read source code from app/components/LayoutChrome.tsx" type errors that don't actually break the page.
4. **Don't globally `@import` a CSS file that might be deleted.** Tailwind's import chain fails silently and strips all styles when one `@import` target is missing. This bit us when `globals.css` had `@import "./components/tweet.css"` after tweet.css was deleted → every class stopped working. Always prune `@import` lines when deleting CSS files.
5. **`immediate: true` in `lenis.scrollTo`** bypasses wheel events; ScrollTrigger onEnter won't fire naturally. Use `{ duration: 1.0 }` for tests that need trigger firing.
6. **Font-dependent layout math needs `document.fonts.ready`.** Otherwise ScrollTrigger start/end math uses pre-layout values. Wrapped in a `useScrollReadyRefresh()` helper is the future-eventual fix (§5 of scroll-patterns.md recipe list).
7. **`ScrollTrigger.refresh()` + `invalidateOnRefresh: true` + `toggleActions` may replay already-played animations.** Prefer `once: true` for reveal-type tweens.

---

## 9. Git State at Handoff

Local `main` is ahead of `origin/main` by **4 commits** (not pushed — user wants manual push after live testing):

```
2266a54 fix: remove stale tweet.css import from globals.css
2b60052 refactor: flashlight becomes homepage, drop legacy chrome and deps
e6a690f chore: remove unused routes to focus on flashlight only
ee8df9c add: section 1 xiaomi lockscreen pile + ScrollReveal + ScrollSnap
```

Tag `archive/pre-flashlight-only` (pushed to origin) points to `ee8df9c` — the last commit with all legacy routes (`/about`, `/blog`, `/chat`, `/idea`, `/photos`, `/projects/<others>`, `/feed`). Resurrect any deleted file with:

```sh
git checkout archive/pre-flashlight-only -- app/<path>
# or browse on GitHub at that tag
```

---

## 10. Immediate Next Step (Recommendation)

Start with **Phase 0**: three files, ~200 LOC, zero behavior change, unlocks everything else. Then update `docs/scroll-patterns.md` accordingly. That's one clean session.

After Phase 0 ships: ask user which Section to build first. Recommend Section 2 (MIUI sliders) as the first use of `<Reveal>` + `<Scene>` + `<ParallaxLayer>` — it stress-tests all three primitives.

---

## 11. When Opening New Session

1. Read this file first.
2. Read `~/.claude/skills/scroll-experience/SKILL.md` (or invoke the skill's expertise lens).
3. Read `docs/scroll-patterns.md`.
4. Confirm git state matches §9 (or note drift).
5. Confirm the user's current ask — don't assume continuation of this plan without check-in.
6. Kill stale `CLAUDE.md` references to `/chat` / ephemeral chat.
