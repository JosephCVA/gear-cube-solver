// packages/core/src/cube/indexing.ts

/**
 * We use standard 3x3 position indexing (same as many cube libs).
 * This is *positions*, not piece identities.
 *
 * Corners (8):
 * 0 URF, 1 UFL, 2 ULB, 3 UBR, 4 DFR, 5 DLF, 6 DBL, 7 DRB
 *
 * Edges (12):
 * 0 UR, 1 UF, 2 UL, 3 UB, 4 DR, 5 DF, 6 DL, 7 DB, 8 FR, 9 FL, 10 BL, 11 BR
 *
 * Centers (6):
 * 0 U, 1 R, 2 F, 3 D, 4 L, 5 B
 */

export const CORNER_POS = {
  URF: 0,
  UFL: 1,
  ULB: 2,
  UBR: 3,
  DFR: 4,
  DLF: 5,
  DBL: 6,
  DRB: 7,
} as const;

export const EDGE_POS = {
  UR: 0,
  UF: 1,
  UL: 2,
  UB: 3,
  DR: 4,
  DF: 5,
  DL: 6,
  DB: 7,
  FR: 8,
  FL: 9,
  BL: 10,
  BR: 11,
} as const;

export const CENTER_POS = {
  U: 0,
  R: 1,
  F: 2,
  D: 3,
  L: 4,
  B: 5,
} as const;

export const ID_CORNER_PERM = [0, 1, 2, 3, 4, 5, 6, 7] as const;
export const ID_EDGE_PERM = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
export const ID_CENTER_PERM = [0, 1, 2, 3, 4, 5] as const;
export const ZERO_EDGE_ORI_DELTA = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as const;
