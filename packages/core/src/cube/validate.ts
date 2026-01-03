// packages/core/src/cube/validate.ts
import type { CubeState } from './types';

export function isValidState(s: CubeState): boolean {
  if (
    !Array.isArray(s.corners) ||
    !Array.isArray(s.edges) ||
    !Array.isArray(s.edgeOri) ||
    !Array.isArray(s.centers)
  ) {
    return false;
  }
  if (s.corners.length !== 8 || s.edges.length !== 12 || s.edgeOri.length !== 12 || s.centers.length !== 6) {
    return false;
  }

  // basic range checks
  for (const v of s.corners) if (!Number.isInteger(v) || v < 0 || v > 7) return false;
  for (const v of s.edges) if (!Number.isInteger(v) || v < 0 || v > 11) return false;
  for (const v of s.centers) if (!Number.isInteger(v) || v < 0 || v > 5) return false;
  for (const v of s.edgeOri) if (!Number.isInteger(v) || v < 0 || v > 5) return false;

  // uniqueness checks (permutations)
  const uniqCorners = new Set(s.corners);
  const uniqEdges = new Set(s.edges);
  const uniqCenters = new Set(s.centers);
  if (uniqCorners.size !== 8 || uniqEdges.size !== 12 || uniqCenters.size !== 6) return false;

  return true;
}

export function isSolvedState(s: CubeState): boolean {
  // solved in our model = identity perms + all edgeOri = 0
  for (let i = 0; i < 8; i++) if (s.corners[i] !== i) return false;
  for (let i = 0; i < 12; i++) if (s.edges[i] !== i) return false;
  for (let i = 0; i < 12; i++) if (s.edgeOri[i] !== 0) return false;
  for (let i = 0; i < 6; i++) if (s.centers[i] !== i) return false;
  return true;
}
