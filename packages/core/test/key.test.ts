import { describe, expect, it } from 'vitest';
import { solvedState, stateKey, applyMove, GEAR_TABLES } from '../src';

describe('stateKey', () => {
  it('changes when a move is applied', () => {
    const s = solvedState();
    const k1 = stateKey(s);
    const s2 = applyMove(s, 'U2', GEAR_TABLES);
    const k2 = stateKey(s2);
    expect(k2).not.toBe(k1);
  });
});
