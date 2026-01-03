// packages/core/src/cube/moveTables.ts
import type { Move } from './types';

export interface MoveTable {
  // destination-indexed permutations (out[pos] = in[perm[pos]])
  cornerPerm: readonly number[]; // len 8
  edgePerm: readonly number[]; // len 12
  centerPerm: readonly number[]; // len 6

  // edge orientation deltas per destination position (len 12), mod 6
  edgeOriDelta: readonly number[];
}

export type MoveTables = Record<Move, MoveTable>;
