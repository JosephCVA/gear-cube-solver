import { coreHello } from '@gear/core';
import './App.css';

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Gear Cube Solver</h1>
      <p>Core says: {coreHello()}</p>
    </div>
  );
}
