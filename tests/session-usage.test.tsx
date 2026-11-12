import { expect, test } from 'claude-code/testing';

import { formatCost, formatTokens } from '../hooks/session-usage';

test('tokens always carry a unit', () => {
  expect(formatTokens(0)).toBe('0k');
  expect(formatTokens(950)).toBe('1k');
  expect(formatTokens(1234)).toBe('1.2k');
  expect(formatTokens(64_600)).toBe('64.6k');
  expect(formatTokens(200_000)).toBe('200k');
  expect(formatTokens(742_300)).toBe('742k');
  expect(formatTokens(1_000_000)).toBe('1M');
});

test('cost reads to the cent', () => {
  expect(formatCost(0)).toBe('$0.00');
  expect(formatCost(0.001)).toBe('<$0.01');
  expect(formatCost(0.412)).toBe('$0.41');
  expect(formatCost(3.869)).toBe('$3.87');
});
