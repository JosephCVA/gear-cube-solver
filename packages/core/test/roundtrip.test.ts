import { describe, expect, it } from 'vitest';
import { applyAlg, invertAlg, scrambleMoves, solvedState, GEAR_TABLES } from '../src';

describe('roundtrip: scramble + inverse', () => {
  it('returns to solved for multiple seeds', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const scr = scrambleMoves(25, seed);
      const s1 = applyAlg(solvedState(), scr, GEAR_TABLES);
      const s2 = applyAlg(s1, invertAlg(scr), GEAR_TABLES);
      expect(s2).toEqual(solvedState());
    }
  });
});
