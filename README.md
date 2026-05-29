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

Container `rednil-web` laeuft auf `host-node-01` im Docker-Netzwerk `cloudflared`.

### Voraussetzungen (einmalig)

#### 1. Cloudflare Domain-Migration

1. Cloudflare-Account: Domain `rednil.at` hinzufuegen (Free Plan reicht)
2. Beim Registrar (wo die Domain registriert ist) die Nameserver auf die
   von Cloudflare angezeigten umstellen
3. Warten bis Cloudflare die Domain als aktiv meldet (kann bis zu 24h dauern)

#### 2. DNS-Records bei Cloudflare

| Typ   | Name          | Inhalt                                        | Proxy |
|-------|---------------|-----------------------------------------------|-------|
| CNAME | `rednil.at`   | `<tunnel-uuid>.cfargotunnel.com`              | Ja    |
| CNAME | `www`         | `<tunnel-uuid>.cfargotunnel.com`              | Ja    |

Die Tunnel-UUID findest du in der Cloudflare-Tunnel-Konfiguration auf `host-node-01`.

#### 3. Cloudflare Tunnel Ingress anpassen

In der Tunnel-Config auf `host-node-01` (z.B. `~/.cloudflared/config.yml`) hinzufuegen:

```yaml
ingress:
  # ... bestehende Eintraege ...
  - hostname: rednil.at
    service: http://rednil-web:80
  - hostname: www.rednil.at
    service: http://rednil-web:80
```

Danach `cloudflared` neu starten.

#### 4. GHCR-Login (auf Laptop und Server)

```bash
# Auf dem Laptop
echo $GITHUB_PAT | docker login ghcr.io -u <github-user> --password-stdin

# Auf host-node-01
ssh achildrenmile@host-node-01
echo $GITHUB_PAT | docker login ghcr.io -u <github-user> --password-stdin
```

GitHub PAT braucht `read:packages` + `write:packages` Scope.

#### 5. Docker-Netzwerk pruefen

```bash
ssh achildrenmile@host-node-01 "docker network ls | grep cloudflared"
```

Falls nicht vorhanden: `docker network create cloudflared`

### Erst-Deploy

```bash
./deploy/deploy.sh
```

Das Script macht:
1. Lokaler `pnpm build` als Sanity-Check
2. Docker Multi-Stage Build (baut Astro nochmal im Container)
3. Image taggen mit Git SHA + `:latest`
4. Push nach GHCR
5. SSH zu `host-node-01`, `docker compose pull && up -d`
6. Healthcheck

### Re-Deploy

Nach Aenderungen einfach:

```bash
git add . && git commit -m "..."
./deploy/deploy.sh
```

### Rollback

```bash
# Auf host-node-01:
docker compose -f deploy/docker-compose.yml down
docker run -d --name rednil-web --network cloudflared ghcr.io/achildrenmile/rednil-web:<alter-sha>
```

## Entscheidungen

Alle Design- und Technik-Entscheidungen sind in `DECISIONS.md` dokumentiert.
