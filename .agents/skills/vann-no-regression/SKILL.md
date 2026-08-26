---
name: vann-no-regression
description: Guard VANN AI Studio changes against regressions by identifying affected behavior and running proportionate checks. Use while implementing a change or when a user asks for regression protection; not for unrelated performance tuning.
---

# VANN no regression

Define the existing behavior that must remain true before changing code. Include adjacent user flows, authorization paths, data shapes, error handling, and responsive UI states when they could be affected.

Make a narrowly scoped change. Prefer extending existing patterns and tests over broad refactors. Do not silently alter public behavior, defaults, database policies, or environment-variable meaning.

Verify proportionately:

- run focused tests or reproducible checks for the changed behavior when available;
- run the repository's lint and type/build checks when the change warrants them;
- exercise the relevant happy path plus meaningful failure or permission cases;
- compare the final diff with the intended scope and remove incidental edits.

When a meaningful automated check does not exist, document a concise manual scenario with the expected result and call it out in the final report. Report residual risk rather than claiming zero regression risk.
