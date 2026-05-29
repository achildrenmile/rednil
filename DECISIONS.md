# Entscheidungen / Decisions

Dieses Dokument hält alle Default-Entscheidungen fest, die im Rahmen des Projekts
getroffen wurden und nicht explizit vom Auftraggeber vorgegeben waren.

---

## D-001: Astro 6 statt Astro 5

**Kontext:** Das Briefing spezifiziert Astro 5, aber `create astro@latest` liefert
Astro 6.4.2 (aktuell stable, Mai 2026). Astro 6 ist abwärtskompatibel und bietet
bessere View Transitions, Content Layer API und Performance.
**Entscheidung:** Astro 6 verwenden.
**Auswirkung:** Keine Nachteile, alle genannten Features (MDX, Sitemap, RSS, i18n)
sind verfügbar und besser integriert.

## D-002: i18n via Astro Content Layer + manuelle Routen

**Kontext:** Astro 6 hat kein eingebautes i18n-Routing mehr im Sinne von
`routing: "manual"`. Stattdessen: Content Collections mit `lang`-Feld im
Frontmatter und sprachspezifische Page-Dateien unter `src/pages/en/`.
**Entscheidung:** Getrennte Page-Dateien pro Sprache (`src/pages/` = DE,
`src/pages/en/` = EN). Blog-Content in einer Collection mit `lang`-Feld im
Frontmatter zur Filterung.
**Auswirkung:** Einfach, explizit, kein Magic. Jede Sprache hat eigene Seiten.

## D-003: Content Collection mit `lang`-Feld statt getrennter Collections

**Kontext:** Briefing erlaubt beides (getrennte Directories oder Frontmatter-Flag).
**Entscheidung:** Eine Collection `blog` mit `lang: "de" | "en"` im Frontmatter.
Dateien in `src/content/blog/` mit Konvention `{slug}.mdx` (DE) und
`en/{slug}.mdx` (EN).
**Auswirkung:** Weniger Konfiguration, eine einzige Schema-Definition, einfaches
Querying per Filter.

## D-004: Newsreader als Display-Serif, Inter Tight als Body-Sans

**Kontext:** Briefing nennt Newsreader, Fraunces, Source Serif 4 als Optionen.
**Entscheidung:** Newsreader Variable (Display/Headlines) + Inter Tight Variable
(Body). Newsreader hat editorial Charakter ohne zu laut zu sein. Inter Tight ist
geometrisch-clean und kompakter als Inter.
**Auswirkung:** Starker typografischer Kontrast, memorable ohne schreiend.

## D-005: Theme-Toggle via `data-theme` Attribut auf `<html>`

**Kontext:** Dark Mode ist Pflicht mit System-Preference-Default + Manual Toggle.
**Entscheidung:** `data-theme="light|dark"` auf `<html>`, Inline-Script im
`<head>` liest `localStorage` bzw. `prefers-color-scheme` vor Paint. CSS Custom
Properties schalten per `[data-theme="dark"]`.
**Auswirkung:** Kein Flash-of-Wrong-Theme. Vanilla JS, kein Framework nötig.

## D-006: Tailwind CSS 4 via Vite Plugin

**Kontext:** Briefing spezifiziert `@tailwindcss/vite` statt `@astrojs/tailwind`.
**Entscheidung:** Tailwind 4 über `@tailwindcss/vite` in `astro.config.mjs`. Kein
separates `tailwind.config.ts` — Tailwind 4 nutzt CSS-basierte Konfiguration
direkt in `src/styles/global.css` via `@theme`.
**Auswirkung:** Modernster Tailwind-Setup. Theme-Werte werden über CSS Custom
Properties definiert, nicht über JS-Config.

## D-007: OG-Images via Satori + sharp

**Kontext:** Briefing nennt `astro-og-canvas` oder Satori-basiert.
**Entscheidung:** Eigene Satori-basierte Lösung mit `@resvg/resvg-js` und
`satori`. Gibt mehr Kontrolle über Design als `astro-og-canvas`, und sharp ist
bereits als Dependency vorhanden.
**Auswirkung:** Benutzerdefiniertes OG-Layout passend zum Site-Design. Wird in
Phase 5 implementiert.

## D-008: Platzhalter-E-Mail `hallo@rednil.at`

**Kontext:** Briefing nennt `hallo@rednil.at` als Platzhalter.
**Entscheidung:** Verwende `hallo@rednil.at` als Kontakt-E-Mail. User bestätigt
oder tauscht später.
**Auswirkung:** Leicht austauschbar, an einer Stelle in einer Konstanten-Datei.

## D-009: GHCR als Container Registry

**Kontext:** Briefing empfiehlt GHCR nach Tantum-Pattern.
**Entscheidung:** Docker-Images werden nach `ghcr.io/<user>/rednil-web` gepusht.
Deploy-Script nutzt GHCR pull auf host-node-01.
**Auswirkung:** Konsistent mit bestehendem Workflow. Erfordert einmaligen GHCR-Login
auf Laptop und Server.

## D-010: Kein `tailwind.config.ts`

**Kontext:** Briefing erwähnt `tailwind.config.ts` im Repo-Layout. Tailwind 4
konfiguriert sich aber über CSS (`@theme` Direktive), nicht über JS-Config.
**Entscheidung:** Kein `tailwind.config.ts`. Gesamte Theme-Konfiguration in
`src/styles/global.css`.
**Auswirkung:** Weniger Dateien, Tailwind-4-native Arbeitsweise. Im README
dokumentiert.
