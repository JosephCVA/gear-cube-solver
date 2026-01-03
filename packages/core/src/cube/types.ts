// packages/core/src/cube/types.ts

export type Face = 'U' | 'R' | 'F' | 'D' | 'L' | 'B';

// Only 180° turns are legal on the classic Gear Cube.
// We'll name them U2/R2/... to avoid ambiguity.
export type Move = 'U2' | 'R2' | 'F2' | 'D2' | 'L2' | 'B2';

export const MOVES: readonly Move[] = ['U2', 'R2', 'F2', 'D2', 'L2', 'B2'] as const;

// Standard 3x3 indexing conventions (we’ll keep them because it helps later with UI):
// Corners (8): 0..7
// Edges   (12): 0..11
// Centers (6): 0..5
//
// We will also track gear “phase” on edges:
// edgeOri[i] in {0..5} representing multiples of 60 degrees (0,60,120,180,240,300).
export type CornerIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type EdgeIndex =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11;

export type CenterIndex = 0 | 1 | 2 | 3 | 4 | 5;

// Gear orientation steps (60° increments)
export type GearOri = 0 | 1 | 2 | 3 | 4 | 5;

// Core state.
// - corners[pos] = which corner piece is in that corner position
// - edges[pos]   = which edge piece is in that edge position
// - edgeOri[pos] = orientation of the edge gear currently in that edge position
// - centers[pos] = which center is in that center position
export interface CubeState {
  corners: readonly number[]; // length 8
  edges: readonly number[]; // length 12
  edgeOri: readonly number[]; // length 12, values 0..5
  centers: readonly number[]; // length 6
}
