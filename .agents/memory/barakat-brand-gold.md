---
name: Barakat brand-gold styling
description: How "Barakat Estate" brand text is styled gold across the site
---
# Brand "Barakat Estate" gold shimmer

The `.brand-gold` utility (artifacts/barakat/src/app/globals.css) renders an
animated gold gradient via background-clip:text + `brandShine` keyframes.
Apply it to any user-visible **text** occurrence of "Barakat Estate".

**Why:** user requested every "Barakat Estate" text be a shimmering gold.

**How to apply / gotchas:**
- The brand appears both as a logo IMAGE (nav `Navigation.tsx`, footer brand
  img, loader — `/barakat.PNG`) and as TEXT (section titles, footer logo text +
  copyright, about hero/paragraph, seller line, team/blog hero subtexts, the
  `brandLockup` HTML string in `AuraPage.tsx`). Only the TEXT ones get
  `.brand-gold`; images are untouched.
- Static HTML templates in `aura-pages.ts` are injected as HTML → wrap with
  `<span class="brand-gold">`. React/JSX components use `className="brand-gold"`.
- `service.description` (service-details.ts) renders as PLAIN text
  (`{service.description}` in ServiceDetailPage.tsx), so HTML cannot be embedded
  there — that single in-sentence mention is intentionally left unstyled.
- grep display sometimes masks "Barakat Estate" → "n"; read the actual file to
  get exact strings for edits.
