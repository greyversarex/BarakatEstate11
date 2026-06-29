---
name: barakat aura-source.js hydration entrypoint
description: aura-source.js has two hydrateAuraPage definitions; only the later window.* one runs
---

# barakat homepage hydration entrypoint

`artifacts/barakat/public/aura-source.js` defines `hydrateAuraPage` twice; the later
`window.hydrateAuraPage = ...` overrides the earlier `async function` declaration, and
only the later one actually runs (`AuraRuntime.tsx` calls `window.hydrateAuraPage`).
The earlier function is dead code.

**Why it matters:** per-page hydration wired only into the earlier function silently
never runs in the browser even though the code looks correct (this is how the homepage
hero carousel kept showing hardcoded placeholders instead of DB listings).

**How to apply:** add/edit homepage hydration in the *active* `window.hydrateAuraPage`
block, not the earlier duplicate. Verify with a fresh browser screenshot, not just by
curling the API — the API can be correct while the page is wrong.

Aside: `?pagination[pageSize]=N` URLs need `curl -g` (brackets trigger curl globbing);
browsers are unaffected.
