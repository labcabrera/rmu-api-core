import { describe, expect, it } from '@jest/globals';
import { ResistanceRollResult } from 'src/modules/resistance-rolls/domain/value-objects/resistance-roll-result';

describe('ResistanceRollResult', () => {
  it('stores result code, modifiers, total result, and failure as immutable constructor values', () => {
    const modifiers = [{ key: 'poison-strength', value: -20 }];
    const result = new ResistanceRollResult('moderate-failure', modifiers, 24, 26);

    expect(result.result).toBe('moderate-failure');
    expect(result.modifiers).toBe(modifiers);
    expect(result.totalResult).toBe(24);
    expect(result.failure).toBe(26);
  });
});
