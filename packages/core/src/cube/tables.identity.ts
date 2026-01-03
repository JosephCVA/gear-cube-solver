// packages/core/src/cube/tables.identity.ts
import type { MoveTables } from './moveTables';
import { ID_CENTER_PERM, ID_CORNER_PERM, ID_EDGE_PERM, ZERO_EDGE_ORI_DELTA } from './indexing';

export const IDENTITY_TABLES: MoveTables = {
  U2: {
    cornerPerm: ID_CORNER_PERM,
    edgePerm: ID_EDGE_PERM,
    centerPerm: ID_CENTER_PERM,
    edgeOriDelta: ZERO_EDGE_ORI_DELTA,
  },
  R2: {
    cornerPerm: ID_CORNER_PERM,
    edgePerm: ID_EDGE_PERM,
    centerPerm: ID_CENTER_PERM,
    edgeOriDelta: ZERO_EDGE_ORI_DELTA,
  },
  F2: {
    cornerPerm: ID_CORNER_PERM,
    edgePerm: ID_EDGE_PERM,
    centerPerm: ID_CENTER_PERM,
    edgeOriDelta: ZERO_EDGE_ORI_DELTA,
  },
  D2: {
    cornerPerm: ID_CORNER_PERM,
    edgePerm: ID_EDGE_PERM,
    centerPerm: ID_CENTER_PERM,
    edgeOriDelta: ZERO_EDGE_ORI_DELTA,
  },
  L2: {
    cornerPerm: ID_CORNER_PERM,
    edgePerm: ID_EDGE_PERM,
    centerPerm: ID_CENTER_PERM,
    edgeOriDelta: ZERO_EDGE_ORI_DELTA,
  },
  B2: {
    cornerPerm: ID_CORNER_PERM,
    edgePerm: ID_EDGE_PERM,
    centerPerm: ID_CENTER_PERM,
    edgeOriDelta: ZERO_EDGE_ORI_DELTA,
  },
} as const;
