import type { MoveTable, MoveTables } from './moveTables';
import { composePerm } from './utils';

// Invert a destination-indexed permutation
// If out[pos] = in[perm[pos]], then inversePerm[from] = pos where perm[pos]=from.
function invertPerm(perm: readonly number[]): number[] {
  const inv = new Array<number>(perm.length);
  for (let pos = 0; pos < perm.length; pos++) {
    inv[perm[pos]!] = pos;
  }
  return inv;
}

// Given forward edgePerm and edgeOriDelta, compute inverse edgeOriDelta.
// We want: invOriDelta such that undo is correct when using invEdgePerm.
function invertEdgeOriDelta(edgePerm: readonly number[], edgeOriDelta: readonly number[], mod: number): number[] {
  const invEdgePerm = invertPerm(edgePerm);
  const invDelta = new Array<number>(edgeOriDelta.length).fill(0);

  // Forward: edgeOri' = permute(edgeOri, edgePerm) + edgeOriDelta (at destination)
  // Undo should satisfy: edgeOri = permute(edgeOri', invEdgePerm) + invDelta
  // Solve per position.
  for (let dest = 0; dest < edgeOriDelta.length; dest++) {
    const from = edgePerm[dest]!;
    // The delta applied when a piece moves from `from` to `dest` must be undone
    // when we bring it back from dest to from.
    invDelta[from] = (mod - (edgeOriDelta[dest]! % mod)) % mod;
  }
  return invDelta;
}

export function invertMoveTable(t: MoveTable): MoveTable {
  const cornerPerm = invertPerm(t.cornerPerm);
  const edgePerm = invertPerm(t.edgePerm);
  const centerPerm = invertPerm(t.centerPerm);
  const edgeOriDelta = invertEdgeOriDelta(t.edgePerm, t.edgeOriDelta, 6);
  return { cornerPerm, edgePerm, centerPerm, edgeOriDelta };
}

export function invertMoveTables(tables: MoveTables): MoveTables {
  const out: any = {};
  for (const k of Object.keys(tables) as Array<keyof MoveTables>) {
    out[k] = invertMoveTable(tables[k]);
  }
  return out as MoveTables;
}
