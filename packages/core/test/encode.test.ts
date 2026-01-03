import { describe, expect, it } from 'vitest';
import { encodeStateInts, solvedState } from '../src';

describe('encodeStateInts', () => {
  it('encodes solved to length 38', () => {
    const e = encodeStateInts(solvedState());
    expect(e.length).toBe(38);
  });
});
