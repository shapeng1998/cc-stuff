// Context use and session cost at the bottom right of the prompt: `64.6k / 1M · $0.41`.
// `session.measure` reports both after each main-thread turn; cost also grows in a
// subagent's turns and in the prompt suggestion asked for after a turn, so those
// events redraw it too. Nothing is polled.
import type { Register } from 'claude-code';

/** Context fill, in percent, where the figure turns to the theme's warning and error colors. */
const WARN_AT = 70;
const ERROR_AT = 90;

/** Token counts in k or M, so the figure keeps one unit: 0k, 1.2k, 64.6k, 742k, 1M. */
export function formatTokens(n: number): string {
  const [value, unit] = n >= 1e6 ? [n / 1e6, 'M'] : [n / 1e3, 'k'];
  const scale = value < 100 ? 10 : 1; // one decimal below 100
  return `${Math.round(value * scale) / scale}${unit}`;
}

/** Dollars to the cent, as /cost writes them; a cost under a cent reads `<$0.01`. */
export function formatCost(usd: number): string {
  return usd > 0 && usd < 0.005 ? '<$0.01' : `$${usd.toFixed(2)}`;
}

export const registerSessionUsage: Register = (on) => {
  on('session.measure', async ($, e, next) => {
    const result = await next(e);
    if (e.changed.includes('context') || e.changed.includes('cost')) $.ui.invalidate('ui.render');
    return result;
  });

  // The main thread's turns are measured above.
  on('turn.complete', async ($, e, next) => {
    const result = await next(e);
    if (e.agentId !== undefined) $.ui.invalidate('ui.render');
    return result;
  });

  on('prompt.suggest', async ($, e, next) => {
    const result = await next(e);
    $.ui.invalidate('ui.render');
    return result;
  });

  on('ui.render', { component: 'SessionMode' }, async ($, e, next) => {
    const { context, cost } = await $.session.usage();
    if (!context.window) return next(e);

    const used = context.tokens ?? 0;
    const percent = context.percent ?? (used / context.window) * 100;
    const color = percent >= ERROR_AT ? 'error' : percent >= WARN_AT ? 'warning' : undefined;
    const { Text } = $.ui.resolve(e);

    // The engine's own mode labels stay first, joined as it joins them.
    return (
      <Text dimColor>
        {e.props.modes.length > 0 ? `${e.props.modes.join(' & ')} & ` : ''}
        <Text color={color} dimColor={!color}>
          {formatTokens(used)} / {formatTokens(context.window)}
        </Text>
        {cost ? ` · ${formatCost(cost.usd)}` : ''}
      </Text>
    );
  });
};
