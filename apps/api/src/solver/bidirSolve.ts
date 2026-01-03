import type { CubeState, Move } from '@gear/core';
import {
  applyMove,
  GEAR_TABLES,
  invertMoveTables,
  isSolvedState,
  MOVES,
  solvedState,
  stateKey,
} from '@gear/core';

type ParentInfo = { prev: string; move: Move }; // move used to go prev -> this

type SolveResult =
  | { ok: true; solution: Move[]; explored: number; ms: number; depth: number }
  | { ok: false; reason: 'timeout' | 'not_found'; explored: number; ms: number; depth: number };

type Node = {
  key: string;
  s: CubeState;
  lastFace: string | null; // face used most recently to reach this node
  prevFace: string | null; // face used one step before lastFace
};

const faceOf = (m: Move) => m[0];

function reconstructPath(parents: Map<string, ParentInfo>, startKey: string, endKey: string): Move[] {
  const out: Move[] = [];
  let cur = endKey;
  while (cur !== startKey) {
    const p = parents.get(cur);
    if (!p) break; // should not happen
    out.push(p.move);
    cur = p.prev;
  }
  out.reverse();
  return out;
}

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

  const startKey = stateKey(start);
  const goal = solvedState();
  const goalKey = stateKey(goal);

  const depthF = Math.floor(opts.maxDepth / 2);
  const depthB = opts.maxDepth - depthF;

  // Front side
  const parentsF = new Map<string, ParentInfo>();
  const seenF = new Set<string>([startKey]);
  let frontierF: Node[] = [{ key: startKey, s: start, lastFace: null, prevFace: null }];

  // Back side (built using inverse tables, so expansion is “backwards”)
  const parentsB = new Map<string, ParentInfo>();
  const seenB = new Set<string>([goalKey]);
  let frontierB: Node[] = [{ key: goalKey, s: goal, lastFace: null, prevFace: null }];

  let explored = 0;

  // Expand forward depthF layers
  for (let d = 0; d < depthF; d++) {
    const next: Node[] = [];
    for (const node of frontierF) {
      if (Date.now() > deadline) {
        return { ok: false, reason: 'timeout', explored, ms: Date.now() - t0, depth: opts.maxDepth };
      }

      for (const m of MOVES) {
        const f = faceOf(m);

        // Prune AA and ABA
        if (node.lastFace && f === node.lastFace) continue;
        if (node.prevFace && f === node.prevFace) continue;

        const s2 = applyMove(node.s, m, GEAR_TABLES);
        const k2 = stateKey(s2);
        if (seenF.has(k2)) continue;

        seenF.add(k2);
        parentsF.set(k2, { prev: node.key, move: m });
        next.push({ key: k2, s: s2, lastFace: f, prevFace: node.lastFace });
        explored++;
      }
    }
    frontierF = next;
  }

  // Check immediate intersection
  for (const node of frontierB) {
    if (seenF.has(node.key)) {
      const pf = reconstructPath(parentsF, startKey, node.key);
      return { ok: true, solution: pf, explored, ms: Date.now() - t0, depth: pf.length };
    }
  }

  // Expand backward up to depthB layers, checking intersection each layer
  for (let d = 0; d <= depthB; d++) {
    // Check intersection at current backward frontier
    for (const node of frontierB) {
      if (seenF.has(node.key)) {
        const meetKey = node.key;
        const pf = reconstructPath(parentsF, startKey, meetKey);

        // Reconstruct path from goal -> meet using parentsB (built with invTables)
        const pb_goal_to_meet = reconstructPath(parentsB, goalKey, meetKey);

        // To go from meet -> goal in forward notation: reverse that list
        const pb_meet_to_goal = [...pb_goal_to_meet].reverse();

        const sol = [...pf, ...pb_meet_to_goal];
        return { ok: true, solution: sol, explored, ms: Date.now() - t0, depth: sol.length };
      }
    }

    if (d === depthB) break;

    const next: Node[] = [];
    for (const node of frontierB) {
      if (Date.now() > deadline) {
        return { ok: false, reason: 'timeout', explored, ms: Date.now() - t0, depth: opts.maxDepth };
      }

      for (const m of MOVES) {
        const f = faceOf(m);

        // Prune AA and ABA
        if (node.lastFace && f === node.lastFace) continue;
        if (node.prevFace && f === node.prevFace) continue;

        // Move “backwards” using inverse tables
        const s2 = applyMove(node.s, m, invTables);
        const k2 = stateKey(s2);
        if (seenB.has(k2)) continue;

        seenB.add(k2);
        parentsB.set(k2, { prev: node.key, move: m });
        next.push({ key: k2, s: s2, lastFace: f, prevFace: node.lastFace });
        explored++;
      }
    }
    frontierB = next;
  }

  return { ok: false, reason: 'not_found', explored, ms: Date.now() - t0, depth: opts.maxDepth };
}
