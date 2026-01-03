// packages/core/src/cube/alg.ts
import type { CubeState, Move } from './types';
import type { MoveTables } from './moveTables';
import { applyMove } from './applyMove';

// From our tests: each move returns to identity after 12 repetitions.
export const MOVE_ORDER = 12;

// Inverse of a generator move is move^(order-1)
export function invertMoveAsAlg(m: Move): Move[] {
  return Array.from({ length: MOVE_ORDER - 1 }, () => m);
}

export function invertAlg(moves: readonly Move[]): Move[] {
  const out: Move[] = [];
  for (let i = moves.length - 1; i >= 0; i--) {
    out.push(...invertMoveAsAlg(moves[i]!));
  }
  return out;
}

export function applyAlg(state: CubeState, moves: readonly Move[], tables: MoveTables): CubeState {
  let s = state;
  for (const m of moves) {
    s = applyMove(s, m, tables);
  }
  return s;
}
