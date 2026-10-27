import { describe, expect, it } from 'vitest';
import { GetPoisonTablesHandler } from '../../../../src/modules/poison-tables/application/cqrs/handlers/get-poison-tables.handler.js';
import { GetPoisonTablesQuery } from '../../../../src/modules/poison-tables/application/cqrs/queries/get-poison-tables.query.js';
import type { PoisonTablesRepository } from '../../../../src/modules/poison-tables/application/ports/poison-tables-repository.port.js';
import type { PoisonTables } from '../../../../src/modules/poison-tables/domain/value-objects/poison-tables.vo.js';
import { MongoPoisonTablesRepository } from '../../../../src/modules/poison-tables/infrastructure/db/mongo.poison-tables.repository.js';
import { PoisonTablesModel } from '../../../../src/modules/poison-tables/infrastructure/persistence/models/poison-tables.model.js';
import { ForbiddenError, NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';

// Fixture values, not the rulebook ones
const TABLES: PoisonTables = {
  rows: [
    {
      category: 'nerve',
      severity: 'mild',
      start: { min: 2, max: 4, unit: 'round' },
      duration: { min: 1, max: 3, unit: 'hour' },
      penalty: { min: -7, max: -7 },
      hitsPerRound: null,
      hitsRounds: null,
      condition: null,
      conditionDelay: null,
      conditionDuration: null,
      permanent: false,
    },
    {
      category: 'nerve',
      severity: 'extreme',
      start: { min: 5, max: 6, unit: 'minute' },
      duration: null,
      penalty: null,
      hitsPerRound: { min: 1, max: 2 },
      hitsRounds: { min: 3, max: 3 },
      condition: 'dead',
      conditionDelay: { min: 1, max: 1, unit: 'round' },
      conditionDuration: null,
      permanent: true,
    },
  ],
};

const repository = (tables: PoisonTables | null): PoisonTablesRepository => ({ findById: () => Promise.resolve(tables) });

describe('GetPoisonTablesHandler', () => {
  it('returns the stored tables to Core Law users and administrators', async () => {
    const handler = new GetPoisonTablesHandler(repository(TABLES));
    await expect(handler.execute(new GetPoisonTablesQuery('user', ['rmu-core-law']))).resolves.toEqual(TABLES);
    await expect(handler.execute(new GetPoisonTablesQuery('service', ['rmu-admin']))).resolves.toEqual(TABLES);
  });

  it('rejects users without Core Law access', async () => {
    const handler = new GetPoisonTablesHandler(repository(TABLES));
    await expect(handler.execute(new GetPoisonTablesQuery('guest', ['rmu-user']))).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('fails with not found when the tables have not been imported', async () => {
    const handler = new GetPoisonTablesHandler(repository(null));
    await expect(handler.execute(new GetPoisonTablesQuery('user', ['rmu-core-law']))).rejects.toBeInstanceOf(NotFoundError);
  });

  it('maps a stored document without its _id, missing ranges as null and permanent as a boolean', () => {
    const doc = { _id: 'core-law', rows: [{ category: 'muscle', severity: 'mild', start: { min: 1, max: 2, unit: 'hour' } }] };
    const mapped = MongoPoisonTablesRepository.mapToTables(doc as unknown as PoisonTablesModel);
    expect(mapped).toEqual({
      rows: [
        {
          category: 'muscle',
          severity: 'mild',
          start: { min: 1, max: 2, unit: 'hour' },
          duration: null,
          penalty: null,
          hitsPerRound: null,
          hitsRounds: null,
          condition: null,
          conditionDelay: null,
          conditionDuration: null,
          permanent: false,
        },
      ],
    });
    expect(MongoPoisonTablesRepository.mapToTables({ _id: 'core-law', ...TABLES })).toEqual(TABLES);
  });
});
