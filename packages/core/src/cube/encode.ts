import type { CubeState } from './types';

export type EncodedState = number[];

// Simple integer encoding (stable, compact)
// Length = 8 + 12 + 6 + 12 = 38
export function encodeStateInts(s: CubeState): EncodedState {
  return [...s.corners, ...s.edges, ...s.centers, ...s.edgeOri];
}
