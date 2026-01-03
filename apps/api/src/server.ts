import Fastify from 'fastify';
import cors from '@fastify/cors';
import { coreHello } from '@gear/core';
import { GEAR_TABLES, applyAlg, scrambleMoves, solvedState, isSolvedState, isValidState } from '@gear/core';
import { idaStarSolve } from './solver/idaStar';
import { solve } from './solver';
import type { SolveRequestBody } from './solver/types';


const app = Fastify({ logger: true });

app.register(cors, {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
});


app.get('/health', async () => {
  return { ok: true, core: coreHello() };
});

app.post('/scramble', async (req) => {
  const body = (req.body ?? {}) as { length?: number; seed?: number };
  const length = typeof body.length === 'number' ? body.length : 25;
  const seed = typeof body.seed === 'number' ? body.seed : Math.floor(Math.random() * 1_000_000_000);

  const moves = scrambleMoves(length, seed);
  const state = applyAlg(solvedState(), moves, GEAR_TABLES);

  return { seed, moves, state };
});

app.post('/validate', async (req) => {
  const body = (req.body ?? {}) as { state?: unknown };
  const state = body.state as any;

  const valid = state && isValidState(state);
  const solved = valid ? isSolvedState(state) : false;

  return { valid, solved };
});

app.post('/solve', async (req) => {
  const body = (req.body ?? {}) as SolveRequestBody;
  return solve(body);
});



const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? '0.0.0.0';

app.listen({ port, host }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
