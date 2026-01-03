import { describe, expect, it } from 'vitest';
import { solvedState } from '../src';

describe('solvedState', () => {
  it('has correct array sizes', () => {
    const s = solvedState();
    expect(s.corners).toHaveLength(8);
    expect(s.edges).toHaveLength(12);
    expect(s.edgeOri).toHaveLength(12);
    expect(s.centers).toHaveLength(6);
  });

  it('starts with all gear orientations = 0', () => {
    const s = solvedState();
    expect(new Set(s.edgeOri).size).toBe(1);
    expect(s.edgeOri[0]).toBe(0);
  });
});
