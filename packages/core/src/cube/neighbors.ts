// packages/core/src/cube/neighbors.ts
import type { CubeState, Move } from './types';
import type { MoveTables } from './moveTables';
import { applyMove } from './applyMove';
import { MOVES } from './types';

export function neighbors(state: CubeState, tables: MoveTables): Array<{ move: Move; state: CubeState }> {
  return MOVES.map((m) => ({ move: m, state: applyMove(state, m, tables) }));
}
