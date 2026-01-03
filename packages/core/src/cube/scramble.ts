// packages/core/src/cube/scramble.ts
import type { Move } from './types';
import { MOVES } from './types';
import { mulberry32 } from './rng';

export function scrambleMoves(length: number, seed = Date.now()): Move[] {
  const rnd = mulberry32(seed);
  const out: Move[] = [];

  // Optional: avoid repeating same face twice in a row (feels nicer)
  let lastFace: string | null = null;

  while (out.length < length) {
    const m = MOVES[Math.floor(rnd() * MOVES.length)]!;
    const face = m[0]; // 'U','R',...
    if (face === lastFace) continue;
    out.push(m);
    lastFace = face;
  }
  return out;
}
