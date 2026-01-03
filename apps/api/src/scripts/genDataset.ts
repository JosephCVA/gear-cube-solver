import { writeFileSync } from 'node:fs';
import { mkdirSync } from 'node:fs';

import type { Move } from '@gear/core';
import {
  applyMove,
  encodeStateInts,
  encodeStateOneHot,
  encodeStateOneHotSize,
  GEAR_TABLES,
  MOVES,
  solvedState,
} from '@gear/core';

// Simple deterministic RNG (mulberry32)
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng: () => number, n: number) {
  return Math.floor(rng() * n);
}

function faceOf(m: Move) {
  return m[0];
}

function randomScramble(rng: () => number, length: number): Move[] {
  const out: Move[] = [];
  let lastFace: string | null = null;
  let prevFace: string | null = null;

  for (let i = 0; i < length; i++) {
    // pick a move with AA/ABA pruning
    for (;;) {
      const m = MOVES[randInt(rng, MOVES.length)];
      const f = faceOf(m);
      if (lastFace && f === lastFace) continue;
      if (prevFace && f === prevFace) continue;
      out.push(m);
      prevFace = lastFace;
      lastFace = f;
      break;
    }
  }
  return out;
}

function applyAlg(moves: Move[]) {
  let s = solvedState();
  for (const m of moves) s = applyMove(s, m, GEAR_TABLES);
  return s;
}

type Row = { x: number[]; y: number };

function main() {
  // CLI: tsx ... --out=data/train.jsonl --seed=123 --minDepth=1 --maxDepth=14 --perDepth=2000 --encoding=onehot
  const args = new Map<string, string>();
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i]!;
    const [k, v] = a.startsWith('--') ? a.slice(2).split('=') : [a, ''];
    if (k) args.set(k, v ?? '');
  }

  const outPath = args.get('out') || 'data/train.jsonl';
  const seed = Number(args.get('seed') || '123');
  const minDepth = Number(args.get('minDepth') || '1');
  const maxDepth = Number(args.get('maxDepth') || '14');
  const perDepth = Number(args.get('perDepth') || '2000');

  const encoding = (args.get('encoding') || 'ints').toLowerCase();
  if (encoding !== 'ints' && encoding !== 'onehot') {
    throw new Error(`Unknown encoding=${encoding}. Use --encoding=ints or --encoding=onehot`);
  }

  console.log(`encoding=${encoding} xSize=${encoding === 'onehot' ? encodeStateOneHotSize() : 38}`);

  const rng = mulberry32(seed);

  const dir = outPath.includes('/') ? outPath.split('/').slice(0, -1).join('/') : '.';
  if (dir && dir !== '.') mkdirSync(dir, { recursive: true });

  let total = 0;
  const lines: string[] = [];

  for (let d = minDepth; d <= maxDepth; d++) {
    for (let i = 0; i < perDepth; i++) {
      const scr = randomScramble(rng, d);
      const st = applyAlg(scr);
      const x = encoding === 'onehot' ? encodeStateOneHot(st) : encodeStateInts(st);
      const y = d; // baseline label: scramble length
      const row: Row = { x, y };
      lines.push(JSON.stringify(row));
      total++;
    }
    console.log(`depth ${d}: +${perDepth} (total ${total})`);
  }

  writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');
  console.log(`Wrote ${total} examples to ${outPath}`);
}

main();
