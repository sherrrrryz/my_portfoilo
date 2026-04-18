# xueyizhou.xyz

Personal portfolio of **Xueyi (Sherry) Zhou** — UX designer, ex-Xiaomi / AppLovin.

Story-driven long scroll that unfolds across six sections: opening flashlight beam, For Millions (Xiaomi lockscreen + MIUI design system + foldable framework), For Business (AppLovin OOBE), For Teams, For Evidence, Curiosity.

## Stack

- [Next.js 15](https://nextjs.org/) App Router / React 19 / TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (tokens declared via `@theme` in `app/_styles/tokens.css`)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) + [Lenis](https://github.com/darkroomengineering/lenis) for scroll-driven animation
- Hosted on [Vercel](https://vercel.com/)

## Run locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Structure

```
app/
  page.tsx                 Story page (/)
  _styles/tokens.css       Design-system source of truth
  _story/                  Story page components, lib, styles
  _lab/ui/                 shadcn-style primitives bound to tokens
  lab/ds/                  Design-system playground (/lab/ds)
  lab/reveal/              Reveal primitive playground (/lab/reveal)
  projects/lockscreen/     Legacy case study (off-limits to edit)

docs/
  prd.md                   Full site spec
  site-status.md           What's built / what's next
  design-system.md         Tokens + primitives usage guide
  scroll-patterns.md       ScrollTrigger + Lenis recipes
```

## Documentation

New to the codebase? Start with [CLAUDE.md](CLAUDE.md) for the orientation tour.
