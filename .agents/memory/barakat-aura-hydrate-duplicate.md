---
name: Barakat aura-source has two hydrateAuraPage definitions
description: Which hydrate function actually runs on the public site, plus reveal-animation screenshot gotcha
---

- `public/aura-source.js` defines `hydrateAuraPage()` early in the file AND later `window.hydrateAuraPage = async function(page)`. The React shell calls `window.hydrateAuraPage`, so **only the later definition runs** — edits to the first one are dead code. Always edit the `window.hydrateAuraPage` version (or both).
- **Why:** an anchor-scroll fix added to the first function silently did nothing until duplicated into the window version.
- Sections use `.reveal` (opacity 0 until scroll). `updateScrollEffects()` now runs on load/timeout/after hydrate, so below-fold sections render in screenshots. Home VIP section has `id="vip"` — screenshot `/#vip` to capture it directly.
