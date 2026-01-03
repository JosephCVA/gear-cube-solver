import { describe, expect, it } from 'vitest';
import { heuristicBasic, solvedState, applyMove, GEAR_TABLES } from '../src';

describe('heuristicBasic', () => {
  it('is 0 for solved', () => {
    expect(heuristicBasic(solvedState())).toBe(0);
  });

  it('is > 0 for a moved state', () => {
    const s = applyMove(solvedState(), 'U2', GEAR_TABLES);
    expect(heuristicBasic(s)).toBeGreaterThan(0);
  });
});
