import { describe, expect, it } from 'vitest';
import { applyMove, solvedState, GEAR_TABLES, invertMoveTables } from '../src';

describe('invertMoveTables', () => {
  it('forward then inverse returns to original for one move', () => {
    const inv = invertMoveTables(GEAR_TABLES);
    const s0 = solvedState();
    const s1 = applyMove(s0, 'F2', GEAR_TABLES);
    const s2 = applyMove(s1, 'F2', inv);
    expect(s2).toEqual(s0);
  });
});
