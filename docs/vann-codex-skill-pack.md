# VANN Codex Skill Pack

This repository includes reusable Codex skills in [`.agents/skills`](../.agents/skills). Codex discovers repository skills when it is launched anywhere inside this repository.

## Use a skill

Invoke a skill explicitly in Codex with its name, for example:

```text
$vann-safe-coding Add an authenticated affiliate campaign settings page.
$vann-ui-review Review the campaign dashboard on mobile and desktop.
$vann-release-check Check whether this branch is ready for production.
$vann-github-pr Prepare this branch for a pull request.
$vann-no-regression Implement this fix without regressing existing dashboard flows.
```

Codex can also select a skill automatically when the request matches its description. Use an explicit invocation when the workflow is important to the task.

## Included skills

| Skill | Use it for |
| --- | --- |
| `vann-safe-coding` | Safe implementation around data, authentication, Supabase, and configuration. |
| `vann-release-check` | Evidence-based release-readiness assessment without deploying. |
| `vann-ui-review` | UI and accessibility review, with implementation only when requested. |
| `vann-github-pr` | A focused, well-documented pull request; never merges. |
| `vann-no-regression` | Scope control and proportionate verification while changing behavior. |

The pack follows the Agent Skills structure: each skill is a folder containing a `SKILL.md` with a concise trigger description and workflow instructions. See [OpenAI's Build skills guide](https://learn.chatgpt.com/docs/build-skills) for the skill model and discovery behavior.
