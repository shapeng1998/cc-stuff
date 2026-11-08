// The plugin's one hooks module: each mod lives in its own file and is registered here.
import type { Register } from 'claude-code'

import { registerMermaidArt } from './mermaid-art'

export const register: Register = (on, options) => {
  registerMermaidArt(on, options)
}
