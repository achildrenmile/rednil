# rednil.at

Persönliche Visitenkarte + Thought-Leadership-Blog von Michael Linder.

## Tech Stack

- **Astro 6** mit MDX, Sitemap, RSS
- **Tailwind CSS 4** via Vite Plugin
- **Fonts:** Newsreader Variable (Headlines), Inter Tight Variable (Body) — self-hosted via `@fontsource-variable`
- **Icons:** Lucide (sparsam)
- **Deploy:** Docker (nginx:alpine) hinter Cloudflare Tunnel

## Quickstart

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # Output in dist/
pnpm preview    # Preview des Builds
```

## Logo & Farben

### Logo einbinden

1. Logo-Dateien ablegen:
   - `public/logo.svg` — Haupt-Logo (Light Mode)
   - `public/logo-dark.svg` — Logo für Dark Mode (optional, falls identisch: weglassen)
   - `public/favicon.svg` — Favicon als SVG
   - `public/apple-touch-icon.png` — 180x180px Apple Touch Icon

2. Wortmarke ersetzen:
   - `src/components/Wordmark.astro` enthält eine Platzhalter-Wortmarke
   - Entweder durch `<img src="/logo.svg">` ersetzen oder SVG-Code direkt einfügen

### Farben anpassen

Alle Farben sind in **einer einzigen Datei** definiert: `src/styles/global.css`

Suche nach dem Kommentar `/* Brand */` und tausche die zwei Farbwerte:

```css
--color-brand-primary: oklch(0.45 0.15 25);   /* -> deine Primaerfarbe */
--color-brand-accent: oklch(0.65 0.12 80);     /* -> deine Akzentfarbe */
```

Empfehlung: Farben aus dem Logo extrahieren mit [oklch.com](https://oklch.com)
oder [coolors.co](https://coolors.co).

Auch die Dark-Mode-Varianten anpassen (gleiche Datei, weiter unten unter
`@variant dark`).

## Blog-Posts schreiben

Neuen Post anlegen: `src/content/blog/{slug}.mdx`

```mdx
---
title: "Titel des Posts"
description: "Kurzbeschreibung fuer SEO und Vorschau"
pubDate: 2026-05-29
tags: ["platform-engineering", "devops"]
lang: de
---

Inhalt in MDX...
```

Englische Posts: `src/content/blog/en/{slug}.mdx` mit `lang: en`.

## Projektstruktur

```
src/
├── components/     Astro-Komponenten
├── content/blog/   Blog-Posts (MDX)
├── layouts/        Seiten-Layouts
├── lib/            Hilfsfunktionen, i18n, Konstanten
├── pages/          DE-Seiten
│   └── en/         EN-Seiten
└── styles/         global.css (Theme, Fonts, Tailwind)
deploy/             Docker + Nginx + Deploy-Script
```

## Deployment

> Siehe Phase 6 — wird nach Fertigstellung aller Inhalte ergaenzt.

## Entscheidungen

Alle Design- und Technik-Entscheidungen sind in `DECISIONS.md` dokumentiert.
