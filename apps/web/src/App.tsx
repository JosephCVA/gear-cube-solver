import { useMemo, useReducer, useState, useEffect } from 'react';
import './App.css';
import type { CubeState, Move } from '@gear/core';
import { applyMove, applyAlg, GEAR_TABLES, solvedState, MOVES, invertMoveAsAlg } from '@gear/core';
import { postScramble, postValidate, postSolve } from './api/client';

export default function App() {
  type Local = {
    state: CubeState;
    history: Move[];
    redo: Move[];
    baseline?: CubeState;
    pending?: Move[];
    index?: number;
  };


  type Action =
    | { type: 'reset' }
    | { type: 'setState'; state: CubeState } // used after API scramble
    | { type: 'move'; move: Move }
    | { type: 'undo' }
    | { type: 'redo' }
    | { type: 'loadSequence'; base: CubeState; moves: Move[] }
    | { type: 'nextStep' }
    | { type: 'prevStep' };


  function localReducer(cur: Local, action: Action): Local {
    switch (action.type) {
      case 'reset': {
        return { state: solvedState(), history: [], redo: [] };
      }
      case 'setState': {
        return { state: action.state, history: [], redo: [] };
      }
      case 'move': {
        return {
          state: applyMove(cur.state, action.move, GEAR_TABLES),
          history: [...cur.history, action.move],
          redo: [], // new move clears redo
        };
      }
      case 'undo': {
        if (cur.history.length === 0) return cur;
        const last = cur.history[cur.history.length - 1]!;
        return {
          state: applyAlg(cur.state, invertMoveAsAlg(last), GEAR_TABLES),
          history: cur.history.slice(0, -1),
          redo: [...cur.redo, last],
        };
      }
      case 'redo': {
        if (cur.redo.length === 0) return cur;
        const last = cur.redo[cur.redo.length - 1]!;
        return {
          state: applyMove(cur.state, last, GEAR_TABLES),
          history: [...cur.history, last],
          redo: cur.redo.slice(0, -1),
        };
      }
      case 'loadSequence': {
      return {
        state: action.base,
        history: [],
        redo: [],
        baseline: action.base,
        pending: action.moves,
        index: 0,
      };
    }
    case 'nextStep': {
      if (!cur.pending || cur.index! >= cur.pending.length) return cur;
      const m = cur.pending[cur.index!]!;
      return {
        ...cur,
        state: applyMove(cur.state, m, GEAR_TABLES),
        index: cur.index! + 1,
      };
    }
    case 'prevStep': {
      if (!cur.pending || cur.index! <= 0) return cur;
      const m = cur.pending[cur.index! - 1]!;
      return {
        ...cur,
        state: applyAlg(cur.state, invertMoveAsAlg(m), GEAR_TABLES),
        index: cur.index! - 1,
      };
    }
      default:
        return cur;
    }
  }

  const [local, dispatch] = useReducer(localReducer, {
    state: solvedState(),
    history: [],
    redo: [],
    baseline: undefined,
    pending: undefined,
    index: 0,
  });



  const [moves, setMoves] = useState<string[]>([]);
  const [seed, setSeed] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('Ready');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playDelayMs, setPlayDelayMs] = useState(400);


  const prettyState = useMemo(() => JSON.stringify(local.state, null, 2), [local.state]);


  async function onScramble() {
    setIsPlaying(false);

    try {
      setStatus('Scrambling...');
      const r = await postScramble(10, 123);
      setSeed(r.seed);
      setMoves(r.moves);
      dispatch({
        type: 'loadSequence',
        base: solvedState(),
        moves: r.moves as Move[],
      });

      setStatus('Scrambled');
      
    } catch (e: any) {
      setStatus(`Error: ${e?.message ?? String(e)}`);
    }
  }

  async function onValidate() {
    setIsPlaying(false);
    try {
      setStatus('Validating...');
      const r = await postValidate(local.state);
      setStatus(`valid=${r.valid} solved=${r.solved}`);
    } catch (e: any) {
      setStatus(`Error: ${e?.message ?? String(e)}`);
    }
  }

  function onReset() {
    setIsPlaying(false);
    dispatch({ type: 'reset' });
    setMoves([]);
    setSeed(null);
    setStatus('Ready');
  }

  function onDoMove(m: Move) {
    setIsPlaying(false);
    dispatch({ type: 'move', move: m });
  }

  function onUndo() {
    setIsPlaying(false);
    dispatch({ type: 'undo' });
  }

  function onRedo() {
    setIsPlaying(false);
    dispatch({ type: 'redo' });
  }

  async function onSolve() {
    setIsPlaying(false);
    try {
      setStatus('Solving...');
      const r = await postSolve(local.state, 10, 1500);

      if (!r.ok) {
        setStatus(`Solve failed: ${r.reason ?? r.error ?? 'unknown'}`);
        return;
      }

      // Load solution playback from CURRENT state
      dispatch({ type: 'loadSequence', base: local.state, moves: r.solution });

      setStatus(`Solved plan: depth=${r.depth} explored=${r.explored} ms=${r.ms}`);
    } catch (e: any) {
      setStatus(`Error: ${e?.message ?? String(e)}`);
    }
  }

  useEffect(() => {
    if (!isPlaying) return;
    if (!local.pending) return;
    if (local.index === local.pending.length) {
      setIsPlaying(false);
      return;
    }

    const id = setTimeout(() => {
      dispatch({ type: 'nextStep' });
    }, playDelayMs);

    return () => clearTimeout(id);
  }, [isPlaying, local.index, local.pending, playDelayMs]);


  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Gear Cube Solver</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <button onClick={onScramble}>Scramble (len=10 seed=123)</button>
        <button onClick={onValidate}>Validate</button>
        <button onClick={onReset}>Reset</button>
        <button onClick={onUndo} disabled={local.history.length === 0}>Undo</button>
        <button onClick={onRedo} disabled={local.redo.length === 0}>Redo</button>
        <button onClick={onSolve}>Solve</button>
        <button
          onClick={() => setIsPlaying((p) => !p)}
          disabled={!local.pending || local.pending.length === 0}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Speed
          <input
            type="range"
            min={100}
            max={1200}
            step={100}
            value={playDelayMs}
            onChange={(e) => setPlayDelayMs(Number(e.target.value))}
          />
          {playDelayMs}ms
        </label>

        <button
          onClick={() => dispatch({ type: 'prevStep' })}
          disabled={!local.pending || local.index === 0}
        >
          Previous
        </button>

        <button
          onClick={() => dispatch({ type: 'nextStep' })}
          disabled={!local.pending || local.index === local.pending?.length}
        >
          Next
        </button>

        <div>
          Step {local.index ?? 0} / {local.pending?.length ?? 0}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {MOVES.map((m) => (
          <button key={m} onClick={() => onDoMove(m)}>
            {m}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <div>
          <b>Status:</b> {status}
        </div>
        <div>
          <b>Seed:</b> {seed ?? '-'}
        </div>
        <div>
          <b>Scramble moves:</b> {moves.join(' ') || '-'}
        </div>
        <div>
          <b>Local move history:</b> {local.history.join(' ') || '-'}
        </div>
        <div>
          <b>Redo stack:</b> {local.redo.join(' ') || '-'}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div><b>Sequence:</b> {local.pending?.join(' ') || '-'}</div>
        <div><b>Step:</b> {local.index ?? 0} / {local.pending?.length ?? 0}</div>
        <div>
          <b>Next move:</b>{' '}
          {local.pending && local.index !== undefined && local.index < local.pending.length
            ? local.pending[local.index]
            : '-'}
        </div>
      </div>

      <pre
        style={{
          padding: 12,
          border: '1px solid #ddd',
          borderRadius: 8,
          background: '#1b1b1bff',
          overflowX: 'auto',
        }}
      >
        {prettyState}
      </pre>



    </div>
  );
}
