# Science Orbit Forum — Phase 1 · Design System

The student science forum of the **Department of Science and Technology**, **Jamia
Madeenathunnoor, Kerala, India**. Science Orbit Forum brings together students interested in
science, technology, research, innovation and exploration through academic programmes,
science events, exhibitions, workshops, discussions and competitions.

> **Phase 1 scope:** this repository delivers the **visual identity and design
> foundation only**. It does **not** build the site pages (About / Events / Updates are
> intentionally omitted). Phase 2 builds the full website on top of this foundation.

---

## Visual concept

The identity is built around **"ORBIT"**:

> Curiosity → Exploration → Learning → Research → Innovation → Impact

A subtle visual language of orbital paths, circular geometry, scientific diagrams,
molecular structures, constellation connections, mathematical curves and abstract
research patterns. Not literal planets.

**Positioning:** *An ambitious student science forum with the credibility of an academic
institution and the visual quality of a modern international science organization.*

---

## 14 deliverables

| # | Deliverable | Primary source |
|---|-------------|----------------|
| 1 | Brand direction | `showcase/sections/BrandSection.tsx` |
| 2 | Colour palette | `styles/tokens.css` · `ColorSection.tsx` |
| 3 | Typography | Manrope + Inter · `TypographySection.tsx` |
| 4 | Logo / wordmark | `components/ui/Logo.tsx` · `public/logo-mark.svg` |
| 5 | Spacing system | `--space-*` tokens |
| 6 | Grid system | 12 / 8 / 4 columns |
| 7 | Button system | `components/ui/Button.tsx` |
| 8 | Card system | `components/ui/Card.tsx` |
| 9 | Icon system | `components/ui/Icon.tsx` |
| 10 | Image direction | `ImageSection.tsx` |
| 11 | Motion principles | `motion` tokens · `Reveal.tsx` |
| 12 | Responsive rules | `ResponsiveSection.tsx` |
| 13 | Reusable UI components | `components/ui/*` |
| 14 | Design tokens | `src/tokens/design-tokens.json` |

---

## Stack

- **React 19** + **Vite 6** + **TypeScript**
- **Node** static server (`server/index.js`, serves `dist/` for later phases)
- Plain CSS with design tokens as custom properties (no CSS framework lock-in)

## Getting started

```bash
npm install
npm run dev        # start Vite dev server → http://localhost:5173
```

### Build & preview

```bash
npm run build      # production build → dist/
npm run preview    # serve the build locally
npm run server     # serve dist/ via the thin Node server → :4000
```

## Design tokens

- `src/styles/tokens.css` — CSS custom properties (single source of truth in the app)
- `src/tokens/design-tokens.json` — machine-readable tokens for tooling / CI
- `src/tokens/index.ts` — typed TypeScript export of the token set

## Project structure

```
src/
  components/
    layout/      Header, Footer (reusable chrome)
    ui/          Buttons, Cards, Tags, Icons, Logo, etc.
  showcase/      Living style-guide page (Phase 1 deliverable)
    sections/    One component per deliverable
  styles/        tokens, base, components, layout, pages
  tokens/        JSON + typed tokens
server/          static server + config (for Phase 2 runtime)
public/          logo mark, favicon
```