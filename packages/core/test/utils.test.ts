import { describe, expect, it } from 'vitest';
import { addMod, composePerm, permute } from '../src/cube/utils';

describe('cube utils', () => {
  it('permute uses destination-indexed convention', () => {
    const arr = ['a', 'b', 'c', 'd'];
    // out[0]=arr[1], out[1]=arr[1]? no:
    // using out[pos] = arr[perm[pos]]
    const perm = [1, 1, 3, 0];
    expect(permute(arr, perm)).toEqual(['b', 'b', 'd', 'a']);
  });

  it('addMod applies mod and handles negatives', () => {
    expect(addMod([0, 5, 1], [1, 1, -2], 6)).toEqual([1, 0, 5]);
  });

  it('composePerm composes destination-indexed perms', () => {
    const a = [1, 0, 2]; // swap 0<->1
    const b = [0, 2, 1]; // swap 1<->2
    // apply b then a: out[pos] = a[b[pos]]
    expect(composePerm(a, b)).toEqual([1, 2, 0]);
  });
});
