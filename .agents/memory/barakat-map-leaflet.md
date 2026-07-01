---
name: Barakat map is Leaflet + OpenStreetMap
description: The public-site map uses Leaflet/OSM (no key) despite legacy "yandex" naming everywhere.
---

# Barakat map = Leaflet + OpenStreetMap (no key)

The public site map is **Leaflet with OpenStreetMap tiles** — no API key, no
registration. Do NOT reintroduce Yandex or any keyed map provider; the user
explicitly abandoned Yandex.

**Why the naming is confusing:** the map code in
`artifacts/barakat/public/aura-source.js` keeps its old Yandex-era names on
purpose — functions `loadYandexMap` / `createYandexMap` / `addYandexMarkers` /
`initYandexMaps`, the container properties `_ymap` / `_ymapMarkers`, the div ids
`preview-yandex-map` / `yandex-full-map` / `detail-yandex-map`, and CSS classes
`.yandex-map` / `.ymap-balloon-*`. These are just identifiers now; the bodies are
Leaflet. Renaming was skipped to avoid touching ~4 external call sites in that
2200-line legacy file.

**How it's wired:** Leaflet is bundled via npm and exposed as `window.L` in
`artifacts/barakat/src/main.tsx` (which replaced the old Yandex `<script>`
injection). `aura-source.js` polls for `window.L`. `navigate()` does a full
`window.location.href` reload per page, so map instances never leak.

**How to apply:**
- Adding/adjusting the map = edit the 5 map functions in `aura-source.js`.
- Popups are built with DOM APIs + `textContent` (not HTML strings) to avoid
  stored-XSS from listing data — keep it that way. Note: other renderers in the
  same file (e.g. `renderMapResults` map-card list) still use `innerHTML` with
  interpolated listing data — a pre-existing XSS pattern not yet hardened.
- No map API key exists in deploy config anymore (removed the Yandex build-arg
  from Dockerfile / docker-compose.yml / .env.example / README).
