// packages/core/src/cube/utils.ts

/**
 * Apply a permutation to a piece-at-position array.
 *
 * If perm[pos] = newPos, then the piece at old position `perm[pos]` moves to `pos`.
 * (This "destination-indexed" convention makes composing easier in practice.)
 *
 * Example: out[pos] = arr[perm[pos]]
 */
export function permute<T>(arr: readonly T[], perm: readonly number[]): T[] {
  if (arr.length !== perm.length) {
    throw new Error(`permute: length mismatch arr=${arr.length} perm=${perm.length}`);
  }
  const out = new Array<T>(arr.length);
  for (let pos = 0; pos < arr.length; pos++) {
    const from = perm[pos]!;
    out[pos] = arr[from]!;
  }
  return out;
}

/**
 * Apply mod-N deltas to selected positions.
 * out[i] = (arr[i] + delta[i]) mod mod
 */
export function addMod(
  arr: readonly number[],
  delta: readonly number[],
  mod: number,
): number[] {
  if (arr.length !== delta.length) {
    throw new Error(`addMod: length mismatch arr=${arr.length} delta=${delta.length}`);
  }
  const out = new Array<number>(arr.length);
  for (let i = 0; i < arr.length; i++) {
    const v = (arr[i]! + delta[i]!) % mod;
    out[i] = v < 0 ? v + mod : v;
  }
  return out;
}

/**
 * Compose permutations (destination-indexed):
 * out[pos] = a[b[pos]]
 * meaning apply b first, then a.
 */
export function composePerm(a: readonly number[], b: readonly number[]): number[] {
  if (a.length !== b.length) {
    throw new Error(`composePerm: length mismatch a=${a.length} b=${b.length}`);
  }
  const out = new Array<number>(a.length);
  for (let pos = 0; pos < a.length; pos++) {
    out[pos] = a[b[pos]!]!;
  }
  return out;
}
