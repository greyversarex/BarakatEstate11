---
name: Barakat aura-source.js card render escaping
description: XSS-safe interpolation rules for the legacy vanilla-JS card renderers (propCard/vipCard) in the public site
---

The public site's card/list UI is rendered by the legacy vanilla-JS runtime `artifacts/barakat/public/aura-source.js` via `innerHTML` string templates (propCard, vipCard, and friends). Listing/agent data (title, address, agent name, avatar URL, ids, etc.) is seller/admin-entered, so it is untrusted and must be escaped at every interpolation.

**Rule:** any `p.*`/user-derived value interpolated into these templates must be escaped by context:
- HTML text content and normal double-quoted attributes → `escapeAttr()`.
- Values inside an inline event handler's JS string, e.g. `onclick="navigate('property','${...}')"` → `escapeJsAttr()`. Plain HTML-entity encoding is NOT enough here because the browser HTML-decodes the attribute before JS parses it; `escapeJsAttr` JS-escapes `\` and `'` first, then entity-encodes `& " < >`.
- IDs used to build a DOM id that is also referenced in an inline handler (slider ids) → `safeSlideId(prefix, id)`, which strips the id to `[A-Za-z0-9_-]` so the same value is safe as both the `id="..."` attribute and the `slideCard('...')` argument.
- Numeric-looking fields (e.g. `p.views` via `toLocaleString`) → coerce with `Number(x) || 0` before interpolation; `String.toLocaleString()` returns the raw string for non-numeric input.

**Why:** a compromised/malicious listing value with quotes or HTML could execute script on the public site (stored XSS). Two architect passes were needed to catch every sink (the `p.views` toLocaleString one is easy to miss).

**How to apply:** when adding or editing any card/detail template in aura-source.js, wrap every data field per the context above. `lucideIcon()` output is trusted internal HTML — do not escape it. The optional `propCard(p, onclick)` raw onclick arg is trusted-only; never pass user data into it.
