# Washington Aerial Robotics — website

A fast, content-driven site for WAAR built with [Astro](https://astro.build). Static HTML for the
content pages, with plain Three.js + GSAP islands only where the 3D drone and scroll motion live —
no React, no Tailwind, minimal dependencies.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
```

Build & preview the production output:

```bash
npm run build      # outputs to dist/
npm run preview
```

## Tech

- **Astro 4** — static site, per-page bundling, zero JS on pages that don't need it
- **Three.js** — the procedural placeholder drone (hero + interactive viewer)
- **GSAP + ScrollTrigger** — hero load sequence and scroll-scrub; free for all use since 2025
- Scroll reveals on inner pages use a tiny IntersectionObserver (no library)
- Design system in `src/styles/global.css` (UW purple + gold, Chakra Petch / IBM Plex)

## Project structure

```
src/
  components/   Nav, Footer, DroneHero (3D + HUD), DroneViewer (drag-to-orbit)
  layouts/      Base.astro — head, fonts, nav/footer, reveal script
  lib/drone.ts  procedural quadcopter builder (shared by hero + viewer)
  data/team.ts  roster (placeholder — edit this)
  content/updates/  Markdown blog posts (add a .md file = new post)
  pages/        index, about, drones, team, updates/, join, faq
  styles/       global.css design tokens
public/         favicon, static assets
```

## Customize

- **Colors / type:** all tokens live at the top of `src/styles/global.css`.
- **Team roster:** edit `src/data/team.ts`. Add photo support later by extending the `Member` type.
- **Updates:** drop a Markdown file into `src/content/updates/` with `title`, `date`, `summary`, `tag` frontmatter.
- **Application link:** search for `href="#"` in `src/pages/join.astro` and the "Apply" buttons, and paste your live form URL.
- **Real drone model:** `src/lib/drone.ts` builds a placeholder from primitives. To use a real airframe,
  export a compressed `.glb` (Draco/meshopt), load it with Three's `GLTFLoader`, and return its scene
  group in place of `buildDrone()`. The hero and viewer both consume the same builder, so it's one swap.

## Deploy (Cloudflare Pages)

1. Push this repo to GitHub.
2. In Cloudflare Pages, create a project from the repo.
3. Build command: `npm run build` · Output directory: `dist`
4. Set your custom domain and update `site` in `astro.config.mjs`.

Works the same on Netlify or Vercel (framework preset: Astro).
