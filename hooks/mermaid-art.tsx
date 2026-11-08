// Draws ```mermaid blocks in Claude's replies as Unicode diagrams.
// The diagram replaces the block as a ```text block; a diagram wider than the
// transcript, or one grok-mermaid can't draw, stays as the source.
import type { Register } from 'claude-code'

import { render } from '../vendor/grok-mermaid/index.js'

/** Columns the transcript takes for its bullet and code-block indent. */
const MARGIN = 4

const OPEN = /^( {0,3})(`{3,}|~{3,})[ \t]*mermaid\b[^`\n]*$/i
const CLOSE = /^ {0,3}(`{3,}|~{3,})[ \t]*$/

/** A ```text fence around `body`, with more backticks than any run inside it. */
function textFence(body: string, indent: string): string {
  const longest = Math.max(0, ...(body.match(/`+/g) ?? []).map(run => run.length))
  const ticks = '`'.repeat(Math.max(3, longest + 1))
  return [`${indent}${ticks}text`, ...body.split('\n').map(line => indent + line), `${indent}${ticks}`].join('\n')
}

const cache = new Map<string, string | null>()

/** The diagram for `source` if it fits in `width` columns, else null. */
function draw(source: string, width: number): string | null {
  const key = `${width}\n${source}`
  if (!cache.has(key)) {
    let art: string | null = null
    try {
      const drawn = render(source)
      if (drawn && drawn.width <= width) art = drawn.plain.join('\n')
    } catch {
      art = null
    }
    if (cache.size >= 200) cache.delete(cache.keys().next().value!)
    cache.set(key, art)
  }
  return cache.get(key) ?? null
}

/** `text` with every closed mermaid fence that fits replaced by its diagram. */
export function drawMermaid(text: string, width: number): string {
  const lines = text.split('\n')
  const out: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const open = OPEN.exec(lines[i]!)
    const end = open ? lines.findIndex((l, j) => j > i && CLOSE.exec(l)?.[1]?.startsWith(open[2]!)) : -1
    if (!open || end === -1) {
      out.push(lines[i]!) // not a fence, or one still streaming in
      continue
    }
    const indent = open[1]!
    const source = lines.slice(i + 1, end).map(l => (l.startsWith(indent) ? l.slice(indent.length) : l)).join('\n')
    const art = draw(source, width - indent.length)
    out.push(art === null ? lines.slice(i, end + 1).join('\n') : textFence(art, indent))
    i = end
  }
  return out.join('\n')
}

export const registerMermaidArt: Register = on => {
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    const { text, isSummary } = e.props
    if (isSummary || !/mermaid/i.test(text)) return next(e)
    const drawn = drawMermaid(text, (e.viewport?.columns ?? 80) - MARGIN)
    return drawn === text ? next(e) : next({ ...e, props: { ...e.props, text: drawn } })
  })
}
