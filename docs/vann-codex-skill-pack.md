# VANN Codex Skill Pack

This repository includes reusable Codex skills in [`.agents/skills`](../.agents/skills). Codex discovers these repository-scoped skills when it is launched inside this repository. The same five skills are packaged in [`plugins/vann-codex-skill-pack`](../plugins/vann-codex-skill-pack) for local installation through Codex's personal marketplace.

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

## Install the local plugin

On the machine where the personal marketplace was created, install the plugin with:

```text
codex plugin add vann-codex-skill-pack@personal
```

Confirm that Codex can see the available or installed plugin with:

```text
codex plugin list --marketplace personal --available --json
```

In the Codex desktop app, enable **VANN Codex Skill Pack** from the Plugins area if it is not already enabled after installation. Then start a **new Codex thread** in the VANN AI Studio repository and type `$` in the composer to select one of the five skills.

When this local plugin is updated, run `codex plugin add vann-codex-skill-pack@personal` again, then use a new thread. The personal marketplace points at `C:\Users\Lenovo\plugins\vann-codex-skill-pack`; the checked-in copy is at `plugins/vann-codex-skill-pack`.

## Behavior and boundaries

The plugin provides skills, not custom slash commands. The documented explicit Codex invocation is `$skill-name`; this pack does not add a speculative `commands/` format or promise `/vann-*` commands. Whether enabled skills are displayed in a particular app menu can vary by Codex surface and version; use the `$` skill picker or the explicit `$vann-...` prompt as the reliable test.

The copies in the plugin package match `.agents/skills` in this release. When changing a source skill, update the corresponding packaged copy, validate the plugin, reinstall it, and test it in a new thread. Repository-scoped discovery continues to work independently of the plugin installation.

## Included skills

| Skill | Use it for |
| --- | --- |
| `vann-safe-coding` | Safe implementation around data, authentication, Supabase, and configuration. |
| `vann-release-check` | Evidence-based release-readiness assessment without deploying. |
| `vann-ui-review` | UI and accessibility review, with implementation only when requested. |
| `vann-github-pr` | A focused, well-documented pull request; never merges. |
| `vann-no-regression` | Scope control and proportionate verification while changing behavior. |

The pack follows the Agent Skills structure: each skill is a folder containing a `SKILL.md` with a concise trigger description and workflow instructions. See [OpenAI's Build skills guide](https://learn.chatgpt.com/docs/build-skills) and [Skills & Plugins guide](https://learn.chatgpt.com/docs/skills-and-plugins) for the skill model, discovery behavior, and explicit invocation.
