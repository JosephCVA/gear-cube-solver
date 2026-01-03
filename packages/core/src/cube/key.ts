// packages/core/src/cube/key.ts
import type { CubeState } from './types';

// Compact-ish stable key for hashing in Sets/Maps
export function stateKey(s: CubeState): string {
  // Join with separators to avoid ambiguity
  return [
    s.corners.join(','),
    s.edges.join(','),
    s.edgeOri.join(','),
    s.centers.join(','),
  ].join('|');
}
