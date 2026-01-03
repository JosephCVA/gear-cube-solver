// apps/api/src/solver/types.ts
import type { CubeState, Move } from '@gear/core';

export type SolveStrategy = 'auto' | 'bidir' | 'ida';

export type SolveOpts = {
  maxDepth: number;
  timeLimitMs: number;
  strategy: SolveStrategy;
};

export type SolveResult =
  | { ok: true; solution: Move[]; explored: number; ms: number; depth: number; strategy: SolveStrategy }
  | {
      ok: false;
      reason: 'timeout' | 'not_found';
      explored: number;
      ms: number;
      depth: number;
      strategy: SolveStrategy;
    }
  | { ok: false; error: 'invalid_state'; strategy: SolveStrategy };

export type SolveRequestBody = {
  state?: unknown;
  maxDepth?: number;
  timeLimitMs?: number;
  strategy?: SolveStrategy;
};
