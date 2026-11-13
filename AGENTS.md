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

- After changing a mod: `pnpm fmt` and `pnpm check` (oxfmt, then oxlint with type-aware rules and type checking), `claude plugin validate . --strict` (also type-checks the hooks module against the installed Claude Code's API; `--strict` fails on its warnings) and `claude plugin test .`, then `/reload-plugins`.
- `pnpm check`'s type checking and the editor need the API declarations in `.claude-plugin/types/` (gitignored). The engine writes them only when it hot-reloads this folder, so run `claude --plugin-dir ~/Projects/cc-stuff` once after cloning or updating Claude Code; an installed plugin's folder is never written in. `claude plugin validate . --strict` needs no such step.
- For user-visible changes, bump `version` in `.claude-plugin/plugin.json` and add a `CHANGELOG.md` entry (`## [x.y.z] - YYYY-MM-DD`).
- Add a short `README.md` section for every new mod, skill, command or agent.
