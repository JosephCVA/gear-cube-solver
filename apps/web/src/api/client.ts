import type { Move, CubeState } from '@gear/core';


const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001';


export type ScrambleResponse = {
  seed: number;
  moves: string[];
  state: CubeState;
};

export type ValidateResponse = {
  valid: boolean;
  solved: boolean;
};

export async function postScramble(length = 25, seed?: number): Promise<ScrambleResponse> {
  const res = await fetch(`${API_BASE}/scramble`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ length, seed }),
  });
  if (!res.ok) throw new Error(`POST /scramble failed: ${res.status}`);
  return res.json();
}

export async function postValidate(state: CubeState): Promise<ValidateResponse> {
  const res = await fetch(`${API_BASE}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  });
  if (!res.ok) throw new Error(`POST /validate failed: ${res.status}`);
  return res.json();
}

export type SolveResponse =
  | { ok: true; solution: Move[]; explored: number; ms: number; depth: number }
  | { ok: false; reason?: string; error?: string; explored?: number; ms?: number; depth?: number };

export async function postSolve(
  state: CubeState,
  maxDepth = 10,
  timeLimitMs = 1500,
): Promise<SolveResponse> {
  const res = await fetch(`${API_BASE}/solve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state, maxDepth, timeLimitMs }),
  });
  if (!res.ok) throw new Error(`POST /solve failed: ${res.status}`);
  return res.json();
}
