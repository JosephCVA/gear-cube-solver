import { describe, expect, it } from 'vitest';
import { coreHello } from '../src/index';

describe('core', () => {
  it('smoke', () => {
    expect(coreHello()).toBe('core ok');
  });
});
