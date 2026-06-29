---
name: Barakat lead service strings
description: Why site lead forms and admin application categories must share identical service strings.
---

The Barakat website lead modals and the admin "applications" sections are linked
solely by the free-text `service` value stored on each application row. The site
defines these strings (request-type config in the barakat public bundle); the
admin defines the category-to-service mapping that filters rows per section. There
is no enum or FK enforcing they agree.

**Why:** A lead submitted with a `service` string that no admin category matches
falls through to the catch-all "Другие заявки" section instead of its intended
section — a silent data-routing bug with no error.

**How to apply:** When adding or renaming any lead type (e.g. "Срочный выкуп"),
change the string in BOTH places in lockstep and keep them byte-identical
(including Cyrillic spelling/spacing). After a change, submit one test lead and
confirm it lands in the expected section.
