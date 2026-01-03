import type { CubeState, Move } from '@gear/core';
import { applyMove, GEAR_TABLES, invertMoveTables, isSolvedState, stateKey, MOVES, solvedState } from '@gear/core';

type SolveResult =
  | { ok: true; solution: Move[]; explored: number; ms: number; depth: number }
  | { ok: false; reason: 'timeout' | 'not_found'; explored: number; ms: number; depth: number };

export function bidirSolve(
  start: CubeState,
  opts: { maxDepth: number; timeLimitMs: number },
): SolveResult {
  const t0 = Date.now();
  const deadline = t0 + opts.timeLimitMs;

  if (isSolvedState(start)) {
    return { ok: true, solution: [], explored: 0, ms: 0, depth: 0 };
  }

  const invTables = invertMoveTables(GEAR_TABLES);

  const depthA = Math.floor(opts.maxDepth / 2);
  const depthB = opts.maxDepth - depthA;

  // Forward frontier: stateKey -> path to reach it
  const front = new Map<string, Move[]>();
  front.set(stateKey(start), []);

  let explored = 0;

  function expandLayer(
    current: Map<string, Move[]>,
    tables: typeof GEAR_TABLES,
  ): Map<string, Move[]> {
    const next = new Map<string, Move[]>();
    for (const [k, path] of current) {
      if (Date.now() > deadline) throw new Error('TIMEOUT');
      // Reconstruct state is expensive; instead we store states too? For now keep it simple:
      // We'll store state alongside path in a queue later if needed.
    }
    return next;
  }

  // We'll do BFS using arrays of [state, path] to avoid re-hashing reconstruction.
  let layerF: Array<{ s: CubeState; path: Move[] }> = [{ s: start, path: [] }];
  const seenF = new Map<string, Move[]>();
  seenF.set(stateKey(start), []);

  for (let d = 0; d < depthA; d++) {
    const next: Array<{ s: CubeState; path: Move[] }> = [];
    for (const node of layerF) {
      if (Date.now() > deadline) return { ok: false, reason: 'timeout', explored, ms: Date.now() - t0, depth: opts.maxDepth };
      for (const m of MOVES) {
        const s2 = applyMove(node.s, m, GEAR_TABLES);
        const k2 = stateKey(s2);
        if (seenF.has(k2)) continue;
        explored++;
        const p2 = [...node.path, m];
        seenF.set(k2, p2);
        next.push({ s: s2, path: p2 });
      }
    }
    layerF = next;
  }

  // Backward BFS from solved using inverse tables, storing paths in *forward move notation*
  // If we apply inverse tables by move m, that corresponds to undoing m in forward direction,
  // so when meeting, we’ll append [m] repeated 11? No: since we have inverse tables, we can
  // store the forward move m as the step to undo; final path will be forwardPath + reverse(reversePath)
  let layerB: Array<{ s: CubeState; path: Move[] }> = [{ s: solvedState(), path: [] }];
  const seenB = new Map<string, Move[]>();
  seenB.set(stateKey(solvedState()), []);

  for (let d = 0; d <= depthB; d++) {
    // Check for intersection at this depth
    for (const node of layerB) {
      const k = stateKey(node.s);
      const pf = seenF.get(k);
      if (pf) {
        // node.path is a sequence of moves applied with inverse tables from solved to reach node.s.
        // To go from start to solved: do pf, then undo those moves in reverse order.
        const undo = [...node.path].reverse();
        const sol = [...pf, ...undo];
        return { ok: true, solution: sol, explored, ms: Date.now() - t0, depth: sol.length };
      }
    }

    if (d === depthB) break;

    const next: Array<{ s: CubeState; path: Move[] }> = [];
    for (const node of layerB) {
      if (Date.now() > deadline) return { ok: false, reason: 'timeout', explored, ms: Date.now() - t0, depth: opts.maxDepth };
      for (const m of MOVES) {
        const s2 = applyMove(node.s, m, invTables); // move backward
        const k2 = stateKey(s2);
        if (seenB.has(k2)) continue;
        explored++;
        const p2 = [...node.path, m];
        seenB.set(k2, p2);
        next.push({ s: s2, path: p2 });
      }
    }
    layerB = next;
  }

  return { ok: false, reason: 'not_found', explored, ms: Date.now() - t0, depth: opts.maxDepth };
}
