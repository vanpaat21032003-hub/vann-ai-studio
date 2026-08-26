---
name: vann-github-pr
description: Prepare a reviewable GitHub pull request for VANN AI Studio changes, including scope, verification, and risk notes. Use when asked to create or prepare a PR; never merge a PR.
---

# VANN GitHub PR

Prepare a focused, reviewable change. Work on a feature branch, never directly on `main`, and preserve unrelated working-tree changes.

Before committing, inspect the diff and run the relevant checks. Keep generated files, secrets, unrelated formatting, and accidental configuration changes out of the commit. Use the repository's existing conventions for commit messages and PR templates when they exist.

Write a PR description that states:

- what changes and why;
- important implementation choices or data/configuration impact;
- verification actually performed, including skipped or failing checks;
- rollout, rollback, and follow-up notes when they apply.

Pushing a branch and opening a PR are external actions: do them only when the user has requested them and credentials, remote access, and repository policy permit. A successful push or PR creation does not authorize merging, enabling auto-merge, deleting branches, or changing review settings.
