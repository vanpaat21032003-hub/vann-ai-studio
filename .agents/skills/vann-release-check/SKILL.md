---
name: vann-release-check
description: Check whether a VANN AI Studio change is ready to release by reviewing build, configuration, data, and rollback risks. Use before a deployment or release decision; do not deploy by itself.
---

# VANN release check

Assess release readiness without deploying, merging, or changing production state unless the user explicitly requests that action.

Start from the proposed diff and release target. Identify the behavior that changes, the users affected, and every required runtime dependency. Confirm that new or changed environment-variable names are documented without exposing their values.

Run the available release gates that are relevant to the change, prioritizing lint, type/build checks, and targeted tests. Record each result as passed, failed, skipped, or unavailable; never represent an unavailable check as passing.

Review release-specific risks:

- database migrations, data backfills, and Supabase policies;
- authentication, permissions, redirects, and server/client boundaries;
- API compatibility, third-party configuration, and feature-flag defaults;
- monitoring signals and a practical rollback path.

End with a concise go/no-go recommendation, blockers, residual risks, and the exact approvals or checks needed to turn a no-go into a go. Do not make the final release decision for the owner.
