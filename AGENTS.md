# AGENTS.md

This repo is one personal Claude Code plugin, and a marketplace that lists only itself. It is installed from this folder (`claude plugin marketplace add ~/Projects/cc-stuff`), so edits load with `/reload-plugins`.

## Layout

Create a directory when first needed:

- `hooks/` — mods (function hooks). `hooks.json` names one module, `register.tsx`, which registers each mod from its own file (`hooks/<mod>.tsx`, exporting `register<Mod>`).
- `skills/<name>/SKILL.md` — skills.
- `commands/*.md` — slash commands.
- `agents/*.md` — subagents.
- `vendor/<lib>/` — third-party code a mod imports (mods can't import npm packages), copied unchanged with its license.

## Rules

- After changing a mod: `claude plugin validate .` and `claude plugin test .`, then `/reload-plugins`.
- For user-visible changes, bump `version` in `.claude-plugin/plugin.json` and add a `CHANGELOG.md` entry (`## [x.y.z] - YYYY-MM-DD`).
- Add a short `README.md` section for every new mod, skill, command or agent.
