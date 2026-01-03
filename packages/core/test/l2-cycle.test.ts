import { describe, expect, it } from 'vitest';
import { applyMove, GEAR_TABLES, solvedState } from '../src';

describe('Gear tables: L2', () => {
  it('12 L2 moves returns to identity', () => {
    let s = solvedState();
    for (let i = 0; i < 12; i++) {
      s = applyMove(s, 'L2', GEAR_TABLES);
    }
    expect(s).toEqual(solvedState());
  });
});
