// packages/core/src/cube/applyMove.ts
import type { CubeState, Move } from './types';
import type { MoveTables } from './moveTables';
import { addMod, permute } from './utils';

export function applyMove(state: CubeState, move: Move, tables: MoveTables): CubeState {
  const t = tables[move];

  return {
    corners: permute(state.corners, t.cornerPerm),
    edges: permute(state.edges, t.edgePerm),
    centers: permute(state.centers, t.centerPerm),
    edgeOri: addMod(permute(state.edgeOri, t.edgePerm), t.edgeOriDelta, 6),
  };
}
