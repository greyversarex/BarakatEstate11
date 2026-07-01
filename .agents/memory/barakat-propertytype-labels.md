---
name: Barakat propertyType label vs code duality
description: Why the public site sees two different propertyType representations and how mapPropertyType bridges them
---

Property type reaches the public runtime in two different shapes depending on origin:
- The dev seed (`deploy/initdb/02-seed.sql`) stores machine codes like `apartment`, `newbuild`, `secondary`, `house`, `land`.
- The admin panel stores the Russian display labels directly (e.g. `Квартира`, `Новостройка`, `Вторичка`).

`mapPropertyType()` in `artifacts/barakat/public/aura-source.js` normalizes both into the Russian label used for the price-note text and for the dynamic VIP filter tabs (`buildVipTabs` + label-based `vipMatchesFilter`).

**Why:** the two data sources were built at different times and never unified; VIP tabs are derived at runtime from whatever labels the current VIP listings resolve to, so a missing alias silently breaks a tab/filter.

**How to apply:** if a listing shows a raw code (e.g. "Продажа · newbuild") instead of a Russian label, add the missing code→label alias to `mapPropertyType`. Do not assume input is always a code or always a label — handle both.
