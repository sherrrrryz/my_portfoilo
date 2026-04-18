# Design System

Source of truth: [`app/_styles/tokens.css`](../app/_styles/tokens.css). Loaded only on `/` and `/lab/ds` (lockscreen routes keep `globals.css`).

Playground: http://localhost:3000/lab/ds — every swatch + specimen reads tokens live. Color pickers override `document.documentElement.style`, dependents re-tint with zero React re-render.

## Three layers

```
primitive    raw values         --neutral-500, --green-500, --space-4
    ↓
semantic     purpose aliases    --ink-primary, --accent, --surface-1
    ↓
component    component-local    --card-bg, --corner-color, --headline-size
```

Change a **primitive** → everything downstream shifts. Change a **semantic** → one usage domain shifts (theming-scale change). Change a **component** → one component shifts (local tweak).

## Color roles

### Neutrals · 11 steps
`--neutral-50` (#fafafa, paper) → `--neutral-950` (#0a0a0a, ink). True neutral, Vercel-style.

### Greens · 5 steps (accent family)
Hand-picked ramp: olive pale 50 → matcha mid 500 → forest ink 900. Hue cools as value darkens. Maps to `--accent-pale / --accent / --accent-hover / --accent-ink`.

### Terracotta · 3 steps (highlight family)
`#efd4c7` pale → `#b14224` 500 → `#7d2914` deep. Maps to `--highlight-pale / --highlight / --highlight-ink`. Independent of the green accent — different family, different role.

## Rules

1. **Monochrome is the default**, color is opt-in. Buttons, cards, badges, inputs default to ink / neutral / surface. A page should feel black-white-gray first, with 1–2 colored accents per beat.
2. **`--accent` green appears only in**: primary CTA surfaces, link hover, focus rings, "WINNER"-style signal tags, editorial emphasis like "dollars." — one word, one color, once.
3. **`--highlight` terracotta appears only in**: `<mark>` content highlighting (paired with `--highlight-pale` bg + `--highlight-ink` text), standalone key statistics like `+18%`.
4. **Never mix accent and highlight in the same beat.** Pick one tonal register per section.
5. **Large color fills over borders.** Separate blocks via `--surface-1/2/ink` shift, not 1px outlines. Borders are for focus rings, input edges, tiny chip outlines, and hairline dividers only.
6. **Generous radius.** 12px is a button, 20px is a card, 32–48px is a hero surface. This plays to Switzer's rounded character.
7. **Geometric spacing.** Scale jumps: 4 · 8 · 16 · 24 · 40 · 64 · 96 · 144. The gap between `--space-5` and `--space-6` is intentional — big moves feel composed, not crowded.

## Two stages

- `.stage-light` — `--stage-light` bg (#fafafa) + `--ink-primary` text. All Story sections except opening.
- `.stage-dark` — `--stage-dark` bg (#0a0a0a) + `--ink-on-dark-primary` text. Section 0 flashlight opening only.

## Typography

Two families:
- `--font-sans` Switzer, weights 100–900 + italics. Display + body.
- `--font-mono` IBM Plex Mono. Corner labels, eyebrows, micro-type only.

Fluid scale: `--text-micro/xs/sm/base/md/lg/xl/2xl/3xl/display/marquee`. The three display tokens use `clamp(min, viewport, max)` so hero type scales with the screen.

## Primitives

Five shadcn-style components in [`app/_lab/ui/`](../app/_lab/ui/), all token-driven:

| Primitive | Default variant | Notes |
|---|---|---|
| `<Button>` | `default` = ink slab | `secondary` · `ghost` · `link` · `accent` (green, opt-in) · `destructive` |
| `<Card>` | surface-1 fill, no border | `CardHeader / Title / Description / Content / Footer` subcomponents |
| `<Badge>` | surface-2 gray fill | `ink` · `outline` · `accent` · `highlight` |
| `<Input>` | surface-1 fill, focus ring | No 1px border until focus |
| `<Separator>` | hairline | Only when a surface shift can't replace it |

Helper: `cn()` in [`_lab/utils.ts`](../app/_lab/utils.ts), `clsx + tailwind-merge`.

## When to style

**New component:** reach for tokens first. If something's missing, add a component-layer token rather than hardcoding. Specific Story-page components (corner label, comparison card, punch block…) already have dedicated tokens in `tokens.css` § LAYER 3.

**Existing legacy CSS:** `flashlight.css` and `for-business.css` still contain hardcoded hex values from before tokens existed. Refactor to `var()` opportunistically — don't rewrite them all at once, do it when you're already editing the file.

**Authoring Tailwind utilities:** arbitrary values like `bg-[var(--accent)]` always work. Named utilities from `@theme` (`bg-accent`, `text-ink`) also work but the arbitrary syntax is safer against future rename.
