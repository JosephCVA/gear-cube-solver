import type { CubeState } from './types';

// Very cheap heuristic (fast, not perfect).
// Idea: count how many items are not in solved position / orientation,
// then divide by a rough "pieces affected per move" lower bound.
//
// This is NOT guaranteed to be strictly admissible for all mechanics,
// but works as a strong guiding signal. We'll later replace/augment
// with PDB + ML.
export function heuristicBasic(s: CubeState): number {
  let badCorners = 0;
  for (let i = 0; i < 8; i++) if (s.corners[i] !== i) badCorners++;

  let badEdges = 0;
  let badEdgeOri = 0;
  for (let i = 0; i < 12; i++) {
    if (s.edges[i] !== i) badEdges++;
    if (s.edgeOri[i] !== 0) badEdgeOri++;
  }

  let badCenters = 0;
  for (let i = 0; i < 6; i++) if (s.centers[i] !== i) badCenters++;

  const c = Math.ceil(badCorners / 4);
  const e = Math.ceil(badEdges / 4);
  const ce = Math.ceil(badCenters / 2);
  const o = Math.ceil(badEdgeOri / 8);

  return c + e + ce + o;
}
