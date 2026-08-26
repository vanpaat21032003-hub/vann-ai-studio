---
name: vann-safe-coding
description: Safely plan and implement code changes in VANN AI Studio, especially changes involving authentication, Supabase data, environment configuration, or user data. Use for implementation work; not for a read-only review.
---

# VANN safe coding

Make the smallest safe change that satisfies the request. Preserve the repository's current patterns and do not broaden the task into cleanup or a redesign.

Before editing, inspect the relevant code, `AGENTS.md`, and the nearest configuration or data-access boundary. Treat `.env.local`, service-role keys, access tokens, and production credentials as secrets: never print, commit, or copy them into code, documentation, test fixtures, or client-side bundles.

For routes, server actions, and Supabase access:

- Verify the intended authorization boundary before relying on client input.
- Validate untrusted input at the server boundary and return useful, non-sensitive failures.
- Keep privileged database access server-side; do not bypass row-level security merely to unblock an implementation.
- Make destructive data operations explicit, scoped, and recoverable where practical.

For dependencies, configuration, migrations, deployments, external messages, and other consequential actions, explain the impact and obtain the authorization required by the surrounding workflow before performing the action.

Finish by running the narrowest relevant verification available and report what changed, what was verified, and anything that still needs human confirmation.
