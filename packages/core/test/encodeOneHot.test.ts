import { describe, expect, it } from 'vitest';
import { encodeStateOneHot, encodeStateOneHotSize, solvedState, applyMove, GEAR_TABLES } from '../src';

describe('encodeStateOneHot', () => {
  it('has correct length', () => {
    const v = encodeStateOneHot(solvedState());
    expect(v.length).toBe(encodeStateOneHotSize());
    expect(v.length).toBe(316);
  });

  it('is binary and has correct count of ones', () => {
    const v = encodeStateOneHot(solvedState());
    const ones = v.reduce((a, x) => a + (x === 1 ? 1 : 0), 0);
    // One "1" per slot: 8 corners + 12 edges + 6 centers + 12 edgeOri = 38
    expect(ones).toBe(38);
  });

  it('changes after a move', () => {
    const s0 = solvedState();
    const v0 = encodeStateOneHot(s0).join(',');
    const s1 = applyMove(s0, 'U2', GEAR_TABLES);
    const v1 = encodeStateOneHot(s1).join(',');
    expect(v1).not.toBe(v0);
  });
});
