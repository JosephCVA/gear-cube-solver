import type { CubeState, Move } from '@gear/core';
import { applyMove, GEAR_TABLES, isSolvedState, stateKey, MOVES, heuristicBasic } from '@gear/core';


type SolveResult =
  | { ok: true; solution: Move[]; explored: number; ms: number; depth: number }
  | { ok: false; reason: 'timeout' | 'not_found'; explored: number; ms: number; depth: number };

export function idaStarSolve(
  start: CubeState,
  opts: { maxDepth: number; timeLimitMs: number },
): SolveResult {
  const t0 = Date.now();
  const deadline = t0 + opts.timeLimitMs;

  // Admissible heuristic (trivial for now)
  const h = heuristicBasic;

  let explored = 0;

  // Transposition table: stateKey -> best (lowest) g found so far
  const bestG = new Map<string, number>();
  bestG.set(stateKey(start), 0);

  // We’ll avoid tiny cycles by forbidding repeating the same face immediately
  const faceOf = (m: Move) => m[0];

  function dfs(
    state: CubeState,
    key: string,
    g: number,
    bound: number,
    path: Move[],
    lastFace: string | null,
    prevFace: string | null,
    onPath: Set<string>,
    bestG: Map<string, number>,
  ): number | 'FOUND' | 'TIMEOUT' {
    const now = Date.now();
    if (now > deadline) return 'TIMEOUT';

    const f = g + h(state);
    if (f > bound) return f;
    if (isSolvedState(state)) return 'FOUND';

    let minNext = Infinity;

    for (const m of MOVES) {
      const f = faceOf(m);
      if (lastFace && f === lastFace) continue; // AA
      if (prevFace && f === prevFace) continue; // ABA

      const next = applyMove(state, m, GEAR_TABLES);
      const k2 = stateKey(next);

      if (onPath.has(k2)) continue;

      const g2 = g + 1;

      // prune dominated repeats (within this bound iteration)
      const best = bestG.get(k2);
      if (best !== undefined && best <= g2) continue;
      bestG.set(k2, g2);

      explored++;
      path.push(m);
      onPath.add(k2);

      const r = dfs(next, k2, g2, bound, path, f, lastFace, onPath, bestG);

      if (r === 'FOUND') return 'FOUND';
      if (r === 'TIMEOUT') return 'TIMEOUT';
      if (typeof r === 'number' && r < minNext) minNext = r;

      onPath.delete(k2);
      path.pop();
    }

    return minNext;
  }

  const startKey = stateKey(start);
  let bound = h(start);
  const path: Move[] = [];
  const onPath = new Set<string>([startKey]);

  for (let iter = 0; iter <= opts.maxDepth; iter++) {
    const bestG = new Map<string, number>();
    bestG.set(startKey, 0);

    const r = dfs(start, startKey, 0, bound, path, null, null, onPath, bestG);
    const ms = Date.now() - t0;

    if (r === 'FOUND') {
      return { ok: true, solution: [...path], explored, ms, depth: path.length };
    }
    if (r === 'TIMEOUT') {
      return { ok: false, reason: 'timeout', explored, ms, depth: iter };
    }
    if (typeof r === 'number') {
      bound = r;
    }
  }



  const ms = Date.now() - t0;
  return { ok: false, reason: 'not_found', explored, ms, depth: opts.maxDepth };
}
