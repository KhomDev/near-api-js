---
"near-api-js": patch
---

`exponentialBackoff` no longer sleeps after the final failed attempt, so it returns `null` as soon as the last attempt fails.
