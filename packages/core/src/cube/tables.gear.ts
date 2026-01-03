// packages/core/src/cube/tables.gear.ts
import type { MoveTables } from './moveTables';
import {
  ID_CENTER_PERM,
  ID_CORNER_PERM,
  ID_EDGE_PERM,
  ZERO_EDGE_ORI_DELTA,
  CORNER_POS,
  EDGE_POS,
  CENTER_POS,
} from './indexing';

// Helper to clone const arrays into mutable number[] for editing.
function n(arr: readonly number[]): number[] {
  return [...arr];
}

//----------------------------------

const R2_cornerPerm = n(ID_CORNER_PERM);
R2_cornerPerm[CORNER_POS.URF] = CORNER_POS.DRB;
R2_cornerPerm[CORNER_POS.DRB] = CORNER_POS.URF;
R2_cornerPerm[CORNER_POS.UBR] = CORNER_POS.DFR;
R2_cornerPerm[CORNER_POS.DFR] = CORNER_POS.UBR;

const R2_edgePerm = n(ID_EDGE_PERM);
// R face edges: UR <-> DR, FR <-> BR
R2_edgePerm[EDGE_POS.UR] = EDGE_POS.DR;
R2_edgePerm[EDGE_POS.DR] = EDGE_POS.UR;
R2_edgePerm[EDGE_POS.FR] = EDGE_POS.BR;
R2_edgePerm[EDGE_POS.BR] = EDGE_POS.FR;

// Adjacent middle layer (vertical center layer): UF -> DF -> DB -> UB -> UF
R2_edgePerm[EDGE_POS.DF] = EDGE_POS.UF;
R2_edgePerm[EDGE_POS.DB] = EDGE_POS.DF;
R2_edgePerm[EDGE_POS.UB] = EDGE_POS.DB;
R2_edgePerm[EDGE_POS.UF] = EDGE_POS.UB;

const R2_centerPerm = n(ID_CENTER_PERM);
// Adjacent vertical center layer centers: U -> F -> D -> B -> U
R2_centerPerm[CENTER_POS.U] = CENTER_POS.B; // U gets old B
R2_centerPerm[CENTER_POS.F] = CENTER_POS.U; // F gets old U
R2_centerPerm[CENTER_POS.D] = CENTER_POS.F; // D gets old F
R2_centerPerm[CENTER_POS.B] = CENTER_POS.D; // B gets old D
// R and L fixed by default

const R2_edgeOriDelta = n(ZERO_EDGE_ORI_DELTA);
// Rotate the 4 gear edges of the adjacent middle layer by +60° (mod 6)
for (const p of [EDGE_POS.UF, EDGE_POS.UB, EDGE_POS.DF, EDGE_POS.DB]) {
  R2_edgeOriDelta[p] = 1;
}
// Edges on the flipped face rotate by 180° (3 * 60°) in this model
for (const p of [EDGE_POS.UR, EDGE_POS.FR, EDGE_POS.DR, EDGE_POS.BR]) {
  R2_edgeOriDelta[p] = 3;
}

//----------------------------------

const L2_cornerPerm = n(ID_CORNER_PERM);
L2_cornerPerm[CORNER_POS.UFL] = CORNER_POS.DBL;
L2_cornerPerm[CORNER_POS.DBL] = CORNER_POS.UFL;
L2_cornerPerm[CORNER_POS.ULB] = CORNER_POS.DLF;
L2_cornerPerm[CORNER_POS.DLF] = CORNER_POS.ULB;

const L2_edgePerm = n(ID_EDGE_PERM);
// L face edges: UL <-> DL, FL <-> BL
L2_edgePerm[EDGE_POS.UL] = EDGE_POS.DL;
L2_edgePerm[EDGE_POS.DL] = EDGE_POS.UL;
L2_edgePerm[EDGE_POS.FL] = EDGE_POS.BL;
L2_edgePerm[EDGE_POS.BL] = EDGE_POS.FL;

// Adjacent middle layer (vertical center layer): UF -> DF -> DB -> UB -> UF
L2_edgePerm[EDGE_POS.DF] = EDGE_POS.UF;
L2_edgePerm[EDGE_POS.DB] = EDGE_POS.DF;
L2_edgePerm[EDGE_POS.UB] = EDGE_POS.DB;
L2_edgePerm[EDGE_POS.UF] = EDGE_POS.UB;

const L2_centerPerm = n(ID_CENTER_PERM);
// Adjacent vertical center layer centers: U -> F -> D -> B -> U
L2_centerPerm[CENTER_POS.U] = CENTER_POS.B;
L2_centerPerm[CENTER_POS.F] = CENTER_POS.U;
L2_centerPerm[CENTER_POS.D] = CENTER_POS.F;
L2_centerPerm[CENTER_POS.B] = CENTER_POS.D;

const L2_edgeOriDelta = n(ZERO_EDGE_ORI_DELTA);
for (const p of [EDGE_POS.UF, EDGE_POS.UB, EDGE_POS.DF, EDGE_POS.DB]) {
  L2_edgeOriDelta[p] = 1;
}
for (const p of [EDGE_POS.UL, EDGE_POS.FL, EDGE_POS.DL, EDGE_POS.BL]) {
  L2_edgeOriDelta[p] = 3;
}

//----------------------------------

const U2_cornerPerm = n(ID_CORNER_PERM);
// U face corners: URF <-> ULB, UFL <-> UBR
U2_cornerPerm[CORNER_POS.URF] = CORNER_POS.ULB;
U2_cornerPerm[CORNER_POS.ULB] = CORNER_POS.URF;
U2_cornerPerm[CORNER_POS.UFL] = CORNER_POS.UBR;
U2_cornerPerm[CORNER_POS.UBR] = CORNER_POS.UFL;

const U2_edgePerm = n(ID_EDGE_PERM);
// U face edges: UR <-> UL, UF <-> UB
U2_edgePerm[EDGE_POS.UR] = EDGE_POS.UL;
U2_edgePerm[EDGE_POS.UL] = EDGE_POS.UR;
U2_edgePerm[EDGE_POS.UF] = EDGE_POS.UB;
U2_edgePerm[EDGE_POS.UB] = EDGE_POS.UF;

// Adjacent middle layer (equator): FR -> FL -> BL -> BR -> FR
U2_edgePerm[EDGE_POS.FL] = EDGE_POS.FR;
U2_edgePerm[EDGE_POS.BL] = EDGE_POS.FL;
U2_edgePerm[EDGE_POS.BR] = EDGE_POS.BL;
U2_edgePerm[EDGE_POS.FR] = EDGE_POS.BR;

const U2_centerPerm = n(ID_CENTER_PERM);
// Adjacent equator centers: F -> L -> B -> R -> F
U2_centerPerm[CENTER_POS.L] = CENTER_POS.F; // L gets old F
U2_centerPerm[CENTER_POS.B] = CENTER_POS.L; // B gets old L
U2_centerPerm[CENTER_POS.R] = CENTER_POS.B; // R gets old B
U2_centerPerm[CENTER_POS.F] = CENTER_POS.R; // F gets old R

const U2_edgeOriDelta = n(ZERO_EDGE_ORI_DELTA);
// Rotate the 4 gear edges of the adjacent middle layer by +60°
for (const p of [EDGE_POS.FR, EDGE_POS.FL, EDGE_POS.BL, EDGE_POS.BR]) {
  U2_edgeOriDelta[p] = 1;
}
// Edges on the flipped face rotate by 180° (3*60°)
for (const p of [EDGE_POS.UR, EDGE_POS.UF, EDGE_POS.UL, EDGE_POS.UB]) {
  U2_edgeOriDelta[p] = 3;
}

//----------------------------------

const D2_cornerPerm = n(ID_CORNER_PERM);
// D face corners: DFR <-> DBL, DLF <-> DRB
D2_cornerPerm[CORNER_POS.DFR] = CORNER_POS.DBL;
D2_cornerPerm[CORNER_POS.DBL] = CORNER_POS.DFR;
D2_cornerPerm[CORNER_POS.DLF] = CORNER_POS.DRB;
D2_cornerPerm[CORNER_POS.DRB] = CORNER_POS.DLF;

const D2_edgePerm = n(ID_EDGE_PERM);
// D face edges: DR <-> DL, DF <-> DB
D2_edgePerm[EDGE_POS.DR] = EDGE_POS.DL;
D2_edgePerm[EDGE_POS.DL] = EDGE_POS.DR;
D2_edgePerm[EDGE_POS.DF] = EDGE_POS.DB;
D2_edgePerm[EDGE_POS.DB] = EDGE_POS.DF;

// Adjacent middle layer (equator): FR -> FL -> BL -> BR -> FR
D2_edgePerm[EDGE_POS.FL] = EDGE_POS.FR;
D2_edgePerm[EDGE_POS.BL] = EDGE_POS.FL;
D2_edgePerm[EDGE_POS.BR] = EDGE_POS.BL;
D2_edgePerm[EDGE_POS.FR] = EDGE_POS.BR;

const D2_centerPerm = n(ID_CENTER_PERM);
// Adjacent equator centers: F -> L -> B -> R -> F
D2_centerPerm[CENTER_POS.L] = CENTER_POS.F;
D2_centerPerm[CENTER_POS.B] = CENTER_POS.L;
D2_centerPerm[CENTER_POS.R] = CENTER_POS.B;
D2_centerPerm[CENTER_POS.F] = CENTER_POS.R;

const D2_edgeOriDelta = n(ZERO_EDGE_ORI_DELTA);
// Rotate the 4 gear edges of the adjacent middle layer by +60°
for (const p of [EDGE_POS.FR, EDGE_POS.FL, EDGE_POS.BL, EDGE_POS.BR]) {
  D2_edgeOriDelta[p] = 1;
}
// Edges on the flipped face rotate by 180° (3*60°)
for (const p of [EDGE_POS.DR, EDGE_POS.DF, EDGE_POS.DL, EDGE_POS.DB]) {
  D2_edgeOriDelta[p] = 3;
}

//----------------------------------

const F2_cornerPerm = n(ID_CORNER_PERM);
// F face corners: URF <-> DLF, UFL <-> DFR
F2_cornerPerm[CORNER_POS.URF] = CORNER_POS.DLF;
F2_cornerPerm[CORNER_POS.DLF] = CORNER_POS.URF;
F2_cornerPerm[CORNER_POS.UFL] = CORNER_POS.DFR;
F2_cornerPerm[CORNER_POS.DFR] = CORNER_POS.UFL;

const F2_edgePerm = n(ID_EDGE_PERM);
// F face edges: UF <-> DF, FR <-> FL
F2_edgePerm[EDGE_POS.UF] = EDGE_POS.DF;
F2_edgePerm[EDGE_POS.DF] = EDGE_POS.UF;
F2_edgePerm[EDGE_POS.FR] = EDGE_POS.FL;
F2_edgePerm[EDGE_POS.FL] = EDGE_POS.FR;

// Adjacent middle slice ring (around F): UR -> DR -> DL -> UL -> UR
F2_edgePerm[EDGE_POS.DR] = EDGE_POS.UR;
F2_edgePerm[EDGE_POS.DL] = EDGE_POS.DR;
F2_edgePerm[EDGE_POS.UL] = EDGE_POS.DL;
F2_edgePerm[EDGE_POS.UR] = EDGE_POS.UL;

const F2_centerPerm = n(ID_CENTER_PERM);
// Adjacent centers around F: U -> R -> D -> L -> U (center ring around F)
F2_centerPerm[CENTER_POS.R] = CENTER_POS.U;
F2_centerPerm[CENTER_POS.D] = CENTER_POS.R;
F2_centerPerm[CENTER_POS.L] = CENTER_POS.D;
F2_centerPerm[CENTER_POS.U] = CENTER_POS.L;

const F2_edgeOriDelta = n(ZERO_EDGE_ORI_DELTA);
// Adjacent slice gear edges +60°
for (const p of [EDGE_POS.UR, EDGE_POS.UL, EDGE_POS.DL, EDGE_POS.DR]) {
  F2_edgeOriDelta[p] = 1;
}
// F-face edges +180° (3*60°)
for (const p of [EDGE_POS.UF, EDGE_POS.DF, EDGE_POS.FR, EDGE_POS.FL]) {
  F2_edgeOriDelta[p] = 3;
}

//----------------------------------

const B2_cornerPerm = n(ID_CORNER_PERM);
// B face corners: UBR <-> DBL, ULB <-> DRB
B2_cornerPerm[CORNER_POS.UBR] = CORNER_POS.DBL;
B2_cornerPerm[CORNER_POS.DBL] = CORNER_POS.UBR;
B2_cornerPerm[CORNER_POS.ULB] = CORNER_POS.DRB;
B2_cornerPerm[CORNER_POS.DRB] = CORNER_POS.ULB;

const B2_edgePerm = n(ID_EDGE_PERM);
// B face edges: UB <-> DB, BL <-> BR
B2_edgePerm[EDGE_POS.UB] = EDGE_POS.DB;
B2_edgePerm[EDGE_POS.DB] = EDGE_POS.UB;
B2_edgePerm[EDGE_POS.BL] = EDGE_POS.BR;
B2_edgePerm[EDGE_POS.BR] = EDGE_POS.BL;

// Adjacent middle slice ring (around B): UR -> UL -> DL -> DR -> UR
B2_edgePerm[EDGE_POS.UL] = EDGE_POS.UR;
B2_edgePerm[EDGE_POS.DL] = EDGE_POS.UL;
B2_edgePerm[EDGE_POS.DR] = EDGE_POS.DL;
B2_edgePerm[EDGE_POS.UR] = EDGE_POS.DR;

const B2_centerPerm = n(ID_CENTER_PERM);
// Adjacent centers around B: U -> L -> D -> R -> U
B2_centerPerm[CENTER_POS.L] = CENTER_POS.U;
B2_centerPerm[CENTER_POS.D] = CENTER_POS.L;
B2_centerPerm[CENTER_POS.R] = CENTER_POS.D;
B2_centerPerm[CENTER_POS.U] = CENTER_POS.R;

const B2_edgeOriDelta = n(ZERO_EDGE_ORI_DELTA);
// Adjacent slice gear edges +60°
for (const p of [EDGE_POS.UR, EDGE_POS.UL, EDGE_POS.DL, EDGE_POS.DR]) {
  B2_edgeOriDelta[p] = 1;
}
// B-face edges +180°
for (const p of [EDGE_POS.UB, EDGE_POS.DB, EDGE_POS.BL, EDGE_POS.BR]) {
  B2_edgeOriDelta[p] = 3;
}

//----------------------------------

export const GEAR_TABLES: MoveTables = {
  U2: {
    cornerPerm: U2_cornerPerm,
    edgePerm: U2_edgePerm,
    centerPerm: U2_centerPerm,
    edgeOriDelta: U2_edgeOriDelta,
  },
  R2: {
    cornerPerm: R2_cornerPerm,
    edgePerm: R2_edgePerm,
    centerPerm: R2_centerPerm,
    edgeOriDelta: R2_edgeOriDelta,
  },
  F2: {
    cornerPerm: F2_cornerPerm,
    edgePerm: F2_edgePerm,
    centerPerm: F2_centerPerm,
    edgeOriDelta: F2_edgeOriDelta,
  },
  D2: {
    cornerPerm: D2_cornerPerm,
    edgePerm: D2_edgePerm,
    centerPerm: D2_centerPerm,
    edgeOriDelta: D2_edgeOriDelta,
  },
  L2: {
    cornerPerm: L2_cornerPerm,
    edgePerm: L2_edgePerm,
    centerPerm: L2_centerPerm,
    edgeOriDelta: L2_edgeOriDelta,
  },
  B2: {
    cornerPerm: B2_cornerPerm,
    edgePerm: B2_edgePerm,
    centerPerm: B2_centerPerm,
    edgeOriDelta: B2_edgeOriDelta,
  },
} as const;
