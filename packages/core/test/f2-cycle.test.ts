import { describe, expect, it } from 'vitest';
import { applyMove, GEAR_TABLES, solvedState } from '../src';

describe('Gear tables: F2', () => {
  it('12 F2 moves returns to identity', () => {
    let s = solvedState();
    for (let i = 0; i < 12; i++) {
      s = applyMove(s, 'F2', GEAR_TABLES);
    }
    expect(s).toEqual(solvedState());
  });
});
