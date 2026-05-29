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

Suche nach dem `:root`-Block und tausche die Brand-Farbwerte:

```css
--brand-primary: oklch(0.45 0.15 25);   /* -> deine Primaerfarbe */
--brand-accent: oklch(0.65 0.12 80);     /* -> deine Akzentfarbe */
```

Auch die Dark-Mode-Varianten im `[data-theme="dark"]`-Block anpassen (gleiche Datei).

Empfehlung: Farben aus dem Logo extrahieren mit [oklch.com](https://oklch.com)
oder [coolors.co](https://coolors.co).

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

### Architektur

```
Internet -> Cloudflare Edge -> cloudflared (host-node-01) -> rednil-web (nginx:alpine)
```

Container `rednil-web` laeuft auf `host-node-01` im Docker-Netzwerk `cloudflared-tunnel`.
Tunnel ist token-basiert, Ingress-Routen werden im Cloudflare Dashboard konfiguriert.

### Voraussetzungen (einmalig)

#### 1. Cloudflare Tunnel Ingress

Im Cloudflare Dashboard unter Zero Trust > Networks > Tunnels:
- Tunnel auswaehlen, der auf `host-node-01` laeuft
- Public Hostname hinzufuegen:
  - `rednil.at` -> `http://rednil-web:80`
  - `www.rednil.at` -> `http://rednil-web:80`

Kein Neustart von cloudflared noetig — token-basierte Tunnels laden die
Config automatisch nach.

#### 2. GitHub-Zugang auf host-node-01

Der Remote-Server muss das Repo klonen koennen:

```bash
ssh achildrenmile@host-node-01 "git ls-remote https://github.com/achildrenmile/rednil.git HEAD"
```

Falls private: GitHub PAT oder SSH-Key einrichten.

### Deploy

```bash
./deploy/deploy.sh
```

Das Script macht:
1. `git push` nach GitHub
2. SSH zu `host-node-01`: Repo klonen oder pullen
3. Docker Multi-Stage Build auf dem Server (Astro build + nginx:alpine)
4. Image taggen mit Git SHA + `:latest`
5. `docker compose up -d`
6. Healthcheck

### Re-Deploy

```bash
git add . && git commit -m "..."
./deploy/deploy.sh
```

### Rollback

```bash
# Auf host-node-01:
docker compose -f /home/achildrenmile/rednil/deploy/docker-compose.yml down
docker run -d --name rednil-web --network cloudflared-tunnel rednil-web:<alter-sha>
```

## Entscheidungen

Alle Design- und Technik-Entscheidungen sind in `DECISIONS.md` dokumentiert.
