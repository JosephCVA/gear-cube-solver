import type { CubeState } from './types';

export function encodeStateOneHotSize(): number {
  return 8 * 8 + 12 * 12 + 6 * 6 + 12 * 6; // 316
}

function oneHot(out: number[], offset: number, index: number, size: number) {
  // zero-fill is handled by the caller; we only set the 1
  out[offset + index] = 1;
  return offset + size;
}

export function encodeStateOneHot(s: CubeState): number[] {
  const out = new Array<number>(encodeStateOneHotSize()).fill(0);
  let off = 0;

  // corners: position i has piece s.corners[i] in [0..7]
  for (let i = 0; i < 8; i++) {
    off = oneHot(out, off, s.corners[i]!, 8);
  }

  // edges: position i has piece s.edges[i] in [0..11]
  for (let i = 0; i < 12; i++) {
    off = oneHot(out, off, s.edges[i]!, 12);
  }

  // centers: position i has center s.centers[i] in [0..5]
  for (let i = 0; i < 6; i++) {
    off = oneHot(out, off, s.centers[i]!, 6);
  }

  // edge orientations: edgeOri[i] in [0..5]
  for (let i = 0; i < 12; i++) {
    off = oneHot(out, off, s.edgeOri[i]!, 6);
  }

  return out;
}
