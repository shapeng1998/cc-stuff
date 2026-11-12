import { expect, test } from 'claude-code/testing';

import { drawMermaid } from '../hooks/mermaid-art';

const FLOW = '```mermaid\ngraph LR\n  A[Start] --> B[Done]\n```';

test('a closed mermaid fence becomes a text diagram', () => {
  const out = drawMermaid(`Before\n\n${FLOW}\n\nAfter`, 80);
  expect(out).toContain('```text');
  expect(out).toContain('Start');
  expect(out).toContain('┌');
  expect(out).not.toContain('```mermaid');
  expect(out.startsWith('Before\n')).toBe(true);
  expect(out.endsWith('\nAfter')).toBe(true);
});

test('a fence still streaming in is left as is', () => {
  const partial = '```mermaid\ngraph LR\n  A --> B';
  expect(drawMermaid(partial, 80)).toBe(partial);
});

test('a diagram wider than the transcript stays as source', () => {
  expect(drawMermaid(FLOW, 10)).toBe(FLOW);
});

test('source grok-mermaid cannot draw stays as source', () => {
  const pie = '```mermaid\npie title Pets\n  "Dogs" : 386\n```';
  expect(drawMermaid(pie, 80)).toBe(pie);
});

test('other code blocks are untouched', () => {
  const ts = '```ts\nconst a = 1\n```';
  expect(drawMermaid(ts, 80)).toBe(ts);
});

test('the reply drawn by the engine carries the diagram', async ($, on) => {
  // This hook stands for the engine: it draws whatever text reaches it.
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e);
    return <Text>{(e.props as { text: string }).text}</Text>;
  });

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({
      plugin: 'cc-stuff',
      surface,
      component: 'AssistantMessage',
      props: { text: `Flow:\n\n${FLOW}`, isFirstOfReply: true },
    });
    const drawn = await ui.find({ type: 'Text' });
    expect(drawn?.text).toContain('```text');
    expect(drawn?.text).toContain('┌');
    await ui.unmount();
  }
});
