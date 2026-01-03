// packages/core/src/cube/state.ts
import type { CubeState } from './types';

export function solvedState(): CubeState {
  return {
    corners: [0, 1, 2, 3, 4, 5, 6, 7],
    edges: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    edgeOri: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    centers: [0, 1, 2, 3, 4, 5],
  };
}
