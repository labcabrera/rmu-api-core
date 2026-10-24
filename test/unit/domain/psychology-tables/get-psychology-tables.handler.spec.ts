import { describe, expect, it } from 'vitest';
import { GetPsychologyTablesHandler } from '../../../../src/modules/psychology-tables/application/cqrs/handlers/get-psychology-tables.handler.js';
import { GetPsychologyTablesQuery } from '../../../../src/modules/psychology-tables/application/cqrs/queries/get-psychology-tables.query.js';
import type { PsychologyTablesRepository } from '../../../../src/modules/psychology-tables/application/ports/psychology-tables-repository.port.js';
import type { PsychologyTables } from '../../../../src/modules/psychology-tables/domain/value-objects/psychology-tables.vo.js';
import { MongoPsychologyTablesRepository } from '../../../../src/modules/psychology-tables/infrastructure/db/mongo.psychology-tables.repository.js';
import { PsychologyTablesModel } from '../../../../src/modules/psychology-tables/infrastructure/persistence/models/psychology-tables.model.js';
import { ForbiddenError, NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';

// Fixture values, not the rulebook ones
const TABLES: PsychologyTables = {
  frightLevels: [{ key: 'fixture-danger', level: 2 }],
  frightLevelModifiers: [{ key: 'fixture-magic', level: 1 }],
  fearResults: [{ min: 1, max: null, severity: 'mild', result: 'balk', rallyModifier: -1 }],
  morale: [{ min: null, max: null, result: 'success', outcome: 'obeys', moraleModifier: 1, moraleModifierDays: 2 }],
  moraleUnusualEvent: { roll: 11, outcome: 'fixture' },
  rally: [{ min: null, max: null, result: 'failure', fearSeverityChange: 0 }],
  rallyUnusualEvent: { roll: 11, outcome: 'fixture', leaderFearRrBonus: 1, leaderHits: 1, durationDays: 1 },
  rallyGroupModifier: { followersPerStep: 3, modifier: -1 },
  resistance: [{ min: 1, max: null, result: 'mild-failure', severity: 'mild' }],
  resistanceRoll: {
    requiredTotal: 10,
    attackLevelMultiplier: -1,
    targetLevelMultiplier: 1,
    ownRealmBonus: 1,
    stats: { physical: 'a', fear: 'b', channeling: 'c', essence: 'd', mentalism: 'e' },
    fearIgnoresInjuryPenalties: true,
  },
};

const repository = (tables: PsychologyTables | null): PsychologyTablesRepository => ({ findById: () => Promise.resolve(tables) });

describe('GetPsychologyTablesHandler', () => {
  it('returns the stored tables to Core Law users and administrators', async () => {
    const handler = new GetPsychologyTablesHandler(repository(TABLES));
    await expect(handler.execute(new GetPsychologyTablesQuery('user', ['rmu-core-law']))).resolves.toEqual(TABLES);
    await expect(handler.execute(new GetPsychologyTablesQuery('service', ['rmu-admin']))).resolves.toEqual(TABLES);
  });

  it('rejects users without Core Law access', async () => {
    const handler = new GetPsychologyTablesHandler(repository(TABLES));
    await expect(handler.execute(new GetPsychologyTablesQuery('guest', ['rmu-user']))).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('fails with not found when the tables have not been imported', async () => {
    const handler = new GetPsychologyTablesHandler(repository(null));
    await expect(handler.execute(new GetPsychologyTablesQuery('user', ['rmu-core-law']))).rejects.toBeInstanceOf(NotFoundError);
  });

  it('maps a stored document without its _id, with open bounds and missing morale fields as defaults', () => {
    const doc = {
      ...TABLES,
      _id: 'core-law',
      fearResults: [{ severity: 'mild', result: 'balk', rallyModifier: 0 }],
      morale: [{ result: 'failure', outcome: 'refuses' }],
      rally: [{ result: 'failure', fearSeverityChange: 0 }],
      resistance: [{ min: 1, result: 'mild-failure', severity: 'mild' }],
    } as unknown as PsychologyTablesModel;
    const mapped = MongoPsychologyTablesRepository.mapToTables(doc);
    expect(mapped).not.toHaveProperty('_id');
    expect(mapped.fearResults).toEqual([{ min: null, max: null, severity: 'mild', result: 'balk', rallyModifier: 0 }]);
    expect(mapped.morale).toEqual([
      { min: null, max: null, result: 'failure', outcome: 'refuses', moraleModifier: 0, moraleModifierDays: null },
    ]);
    expect(mapped.rally).toEqual([{ min: null, max: null, result: 'failure', fearSeverityChange: 0 }]);
    expect(mapped.resistance).toEqual([{ min: 1, max: null, result: 'mild-failure', severity: 'mild' }]);
    expect(mapped.resistanceRoll).toEqual(TABLES.resistanceRoll);
  });

  it('maps a document with empty lists to empty arrays', () => {
    const doc = {
      ...TABLES,
      _id: 'core-law',
      frightLevels: undefined,
      frightLevelModifiers: undefined,
    } as unknown as PsychologyTablesModel;
    const mapped = MongoPsychologyTablesRepository.mapToTables({
      ...doc,
      fearResults: undefined,
      morale: undefined,
      rally: undefined,
      resistance: undefined,
    } as unknown as PsychologyTablesModel);
    expect(mapped.frightLevels).toEqual([]);
    expect(mapped.frightLevelModifiers).toEqual([]);
    expect(mapped.fearResults).toEqual([]);
    expect(mapped.morale).toEqual([]);
    expect(mapped.rally).toEqual([]);
    expect(mapped.resistance).toEqual([]);
  });
});
