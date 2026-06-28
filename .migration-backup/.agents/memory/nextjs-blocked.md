---
name: Next.js blocked on Replit
description: All Next.js npm versions return 403 from Replit package firewall; workaround is React+Vite.
---

The package firewall at package-firewall.replit.local blocks all next package versions with 403 Forbidden.
Adding next to minimumReleaseAgeExclude does NOT fix this — it is a separate block, not a release age issue.

**Why:** Replit's package firewall blocks Next.js entirely (likely due to critical CVEs in early 2025).

**How to apply:** Any feature that would use Next.js must be built with React+Vite instead. API routes that would be Next.js API routes should go into the Express api-server at artifacts/api-server.
