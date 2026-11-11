# cc-stuff

Personal [Claude Code](https://claude.com/claude-code) plugin: mods, skills and commands, synced across machines with git.

```sh
git clone https://github.com/shapeng1998/cc-stuff.git ~/Projects/cc-stuff
claude plugin marketplace add ~/Projects/cc-stuff
claude plugin install cc-stuff@cc-stuff
```

Claude Code reads the plugin from this folder in place: edit, then `/reload-plugins`.

## Mods

### `mermaid-art`

Draws ```` ```mermaid ```` blocks in Claude's replies as Unicode diagrams, with [grok-mermaid](https://github.com/xl0/grok-mermaid) (the renderer pi uses). A diagram wider than the transcript, or one grok-mermaid can't draw, stays as source.

### `session-usage`

Shows context use and session cost at the bottom right of the prompt, e.g. `64.6k / 1M · $0.41`. The context figure turns to the theme's warning color at 70% and error at 90%. Both update after each response; nothing is polled.

## License

[MIT](LICENSE). `vendor/grok-mermaid` is grok-mermaid 0.2.3, Apache-2.0, copied unchanged with its [LICENSE](vendor/grok-mermaid/LICENSE).
