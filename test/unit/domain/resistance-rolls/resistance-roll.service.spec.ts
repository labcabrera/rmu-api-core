import { describe, expect, it } from '@jest/globals';
import { ResistanceRollQuery } from 'src/modules/resistance-rolls/application/cqrs/queries/resistance-roll.query';
import { ResistanceRollService } from 'src/modules/resistance-rolls/domain/services/resistance-roll.service';

const query = (roll: number, attackLevel = 1, targetLevel = 1, modifiers: { key: string; value: number }[] | null = null) =>
  new ResistanceRollQuery(attackLevel, targetLevel, modifiers, roll, 'user-id', []);

describe('ResistanceRollService', () => {
  const service = new ResistanceRollService();

  it('adds attack level, target level, and roll modifiers to the total', () => {
    const result = service.execute(query(40, 5, 2, [{ key: 'spell-modifier', value: -15 }]));

    expect(result.modifiers).toEqual([
      { key: 'spell-modifier', value: -15 },
      { key: 'attack-level', value: -10 },
      { key: 'target-level', value: 4 },
      { key: 'roll', value: 40 },
    ]);
    expect(result.totalResult).toBe(19);
    expect(result.failure).toBe(31);
    expect(result.result).toBe('moderate-failure');
  });

  it('does not mutate query modifiers when building the result', () => {
    const modifiers = [{ key: 'racial-bonus', value: 10 }];

    const result = service.execute(query(45, 1, 1, modifiers));

    expect(modifiers).toEqual([{ key: 'racial-bonus', value: 10 }]);
    expect(result.modifiers).not.toBe(modifiers);
  });

  it('classifies success and failure thresholds from computed failure', () => {
    expect(service.execute(query(50)).result).toBe('success');
    expect(service.execute(query(49)).result).toBe('mild-failure');
    expect(service.execute(query(25)).result).toBe('mild-failure');
    expect(service.execute(query(24)).result).toBe('moderate-failure');
    expect(service.execute(query(0)).result).toBe('moderate-failure');
    expect(service.execute(query(-1)).result).toBe('severe-failure');
    expect(service.execute(query(-50)).result).toBe('severe-failure');
    expect(service.execute(query(-51)).result).toBe('extreme-failure');
  });

  it('clamps failure to zero when total result exceeds the resistance target', () => {
    const result = service.execute(query(150, 10, 1));

    expect(result.totalResult).toBe(132);
    expect(result.failure).toBe(0);
    expect(result.result).toBe('success');
  });
});
