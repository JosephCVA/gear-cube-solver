import { describe, expect, it } from 'vitest';
import { applyMove, IDENTITY_TABLES, MOVES, solvedState } from '../src';

describe('applyMove with identity tables', () => {
  it('does nothing for all moves', () => {
    const s = solvedState();
    for (const m of MOVES) {
      const out = applyMove(s, m, IDENTITY_TABLES);
      expect(out).toEqual(s);
    }
  });
});
