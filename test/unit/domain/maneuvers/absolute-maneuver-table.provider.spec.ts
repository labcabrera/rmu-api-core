import { describe, expect, it } from 'vitest';
import { AbsoluteManeuverTableProvider } from '../../../../src/modules/maneuvers/application/services/absolute-maneuver-table.provider.js';
import type { ManeuverTableRepository } from '../../../../src/modules/maneuvers/application/ports/maneuver-table-repository.js';
import { AbsoluteManeuverService } from '../../../../src/modules/maneuvers/domain/services/absolute-maneuver.service.js';
import { AbsoluteManeuverTable } from '../../../../src/modules/maneuvers/domain/value-objects/absolute-maneuver-table.vo.js';
import { MongoManeuverTableRepository } from '../../../../src/modules/maneuvers/infrastructure/db/mongo.maneuver-table.repository.js';
import { ManeuverTableModel } from '../../../../src/modules/maneuvers/infrastructure/persistence/models/maneuver-table.model.js';
import { NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';

// Invented table: not book data.
const storedDoc: ManeuverTableModel = {
  _id: 'test-table',
  table: [
    { min: null, max: 10, result: { result: 'absolute-failure', message: 'Test absolute failure.' } },
    { min: 11, max: 50, result: { result: 'failure', message: 'Test failure.' } },
    { min: 51, max: 90, result: { result: 'partial-success', message: 'Test partial.', effects: [{ status: 'retryBonus', value: 5 }] } },
    { min: 91, max: 150, result: { result: 'success', message: 'Test success.' } },
    { min: 151, max: null, result: { result: 'absolute-success', message: 'Test absolute success.' } },
  ],
  unusualEvent: 'Test unusual event.',
};

const repository: ManeuverTableRepository = {
  findByName: (name: string) => Promise.resolve(name === storedDoc._id ? MongoManeuverTableRepository.mapToTable(storedDoc) : null),
  findNames: () => Promise.resolve(['test-table', 'generic']),
};

describe('AbsoluteManeuverTableProvider', () => {
  const service = new AbsoluteManeuverService();
  const provider = new AbsoluteManeuverTableProvider(service, repository);

  it('maps stored documents to absolute maneuver tables', () => {
    const table = MongoManeuverTableRepository.mapToTable(storedDoc);

    expect(table).toBeInstanceOf(AbsoluteManeuverTable);
    expect(table.name).toBe('test-table');
    expect(table.table).toHaveLength(5);
    expect(table.unusualEvent).toBe('Test unusual event.');
  });

  it('prefers code tables and falls back to stored ones', async () => {
    expect((await provider.getTable()).name).toBe('generic');
    expect(await provider.getTable('adrenal')).toBe(service.getTable('adrenal'));
    expect((await provider.getTable('test-table')).name).toBe('test-table');
  });

  it('fails with NotFoundError for unknown tables', async () => {
    await expect(provider.getTable('unknown')).rejects.toThrow(NotFoundError);
  });

  it('resolves rolls, effects and unusual events against stored tables', async () => {
    const table = await provider.getTable('test-table');

    expect(service.resolve(table, 5, false)).toEqual({ result: 'absolute-failure', message: 'Test absolute failure.' });
    expect(service.resolve(table, 60, false)).toEqual({
      result: 'partial-success',
      message: 'Test partial.',
      effects: [{ status: 'retryBonus', value: 5 }],
    });
    expect(service.resolve(table, 200, true)).toEqual({
      result: 'absolute-success',
      message: 'Test absolute success. Test unusual event.',
      unusualEvent: 'Test unusual event.',
    });
  });

  it('lists code tables followed by the stored ones without duplicates', async () => {
    const names = await provider.getTableNames();

    expect(names.slice(0, service.getTableNames().length)).toEqual(service.getTableNames());
    expect(names.filter(name => name === 'generic')).toHaveLength(1);
    expect(names[names.length - 1]).toBe('test-table');
  });
});
