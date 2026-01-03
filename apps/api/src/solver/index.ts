// apps/api/src/solver/index.ts
import type { CubeState } from '@gear/core';
import { isValidState } from '@gear/core';

import type { SolveOpts, SolveRequestBody, SolveResult } from './types';
import { bidirSolve } from './bidirSolve';
import { idaStarSolve } from './idaStar'; // keep your existing one (even if not great yet)

export function normalizeSolveOpts(body: SolveRequestBody): SolveOpts {
  const maxDepth = typeof body.maxDepth === 'number' ? body.maxDepth : 10;
  const timeLimitMs = typeof body.timeLimitMs === 'number' ? body.timeLimitMs : 1500;
  const strategy = body.strategy ?? 'auto';
  return { maxDepth, timeLimitMs, strategy };
}

export function solve(body: SolveRequestBody): SolveResult {
  const opts = normalizeSolveOpts(body);
  const strategy = opts.strategy;

  const state = body.state as any;
  if (!state || !isValidState(state)) {
    return { ok: false, error: 'invalid_state', strategy };
  }

  const start = state as CubeState;

  if (strategy === 'bidir') {
    const r = bidirSolve(start, opts);
    return { ...r, strategy: 'bidir' };
  }

  if (strategy === 'ida') {
    const r = idaStarSolve(start, { maxDepth: opts.maxDepth, timeLimitMs: opts.timeLimitMs });
    // normalize to SolveResult shape:
    if (r.ok) return { ...r, strategy: 'ida' };
    return { ...r, strategy: 'ida' };
  }

  // auto
  const shallowCutoff = 12;
  if (opts.maxDepth <= shallowCutoff) {
    const r = bidirSolve(start, opts);
    return { ...r, strategy: 'bidir' };
  }

  const r = idaStarSolve(start, { maxDepth: opts.maxDepth, timeLimitMs: opts.timeLimitMs });
  if (r.ok) return { ...r, strategy: 'ida' };
  return { ...r, strategy: 'ida' };
}
