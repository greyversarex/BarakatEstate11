---
name: Barakat index.css red placeholders
description: Why aura text/borders rendered red and how the cascade collision works
---
In `artifacts/barakat/src/index.css` the shadcn scaffold shipped its theme
variables as unfilled `red` placeholders (`--muted: red; /*replace with H S L*/`,
also `--foreground`, `--card`, `--primary`, `--border`, etc.) in both `:root` and
`.dark` blocks.

`src/main.tsx` imports `globals.css` (the real aura theme) FIRST, then `index.css`.
Same-specificity `:root` rules, so index.css wins → it overrides aura's
`--muted: #8A7F6A`, `--border`, etc. with `red`.

Key subtlety: index.css consumes these vars wrapped as `hsl(var(--x))` (e.g.
`--color-muted: hsl(var(--muted))`), and `hsl(red)` is INVALID, so Tailwind
utilities silently fall back. The red is only visible where aura uses the var
DIRECTLY as a full color, e.g. inline `color: var(--muted)` (79+ uses) → literal red.

**Why:** placeholders were never filled; cascade order makes them shadow the aura theme.
**How to apply:** if aura text/borders look red/olive/muddy, check index.css for
`: red` placeholders and set them to real full-color aura values (#1A1610 ink,
#8A7F6A muted, #DDB45D gold, #F9F3E4 cream, transparent borders/input), keeping
`--destructive` an actual error-red. Setting full colors is safe — the hsl()-wrapped
Tailwind side was already broken by `hsl(red)`, so nothing regresses.
