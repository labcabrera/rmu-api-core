import { describe, expect, it } from 'vitest';
import { GetAlchemyTablesHandler } from '../../../../src/modules/alchemy-tables/application/cqrs/handlers/get-alchemy-tables.handler.js';
import { GetAlchemyTablesQuery } from '../../../../src/modules/alchemy-tables/application/cqrs/queries/get-alchemy-tables.query.js';
import type { AlchemyTablesRepository } from '../../../../src/modules/alchemy-tables/application/ports/alchemy-tables-repository.port.js';
import {
  ALCHEMY_FAILURE_TABLES,
  type AlchemyFailureRow,
  type AlchemyFailureTable,
  type AlchemyTables,
} from '../../../../src/modules/alchemy-tables/domain/value-objects/alchemy-tables.vo.js';
import { MongoAlchemyTablesRepository } from '../../../../src/modules/alchemy-tables/infrastructure/db/mongo.alchemy-tables.repository.js';
import type { AlchemyTablesModel } from '../../../../src/modules/alchemy-tables/infrastructure/persistence/models/alchemy-tables.model.js';
import { ForbiddenError, NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';

// Made-up rows and multipliers, not the rulebook ones
const ROWS: AlchemyFailureRow[] = [
  { min: 1, max: 40, text: 'Fixture: nothing happens' },
  { min: 41, max: 60, text: 'Fixture: a lucky spark', serendipity: 'minor' },
  { min: 61, max: null, text: 'Fixture: the workshop smokes' },
];

const emptyTables = (): Record<AlchemyFailureTable, AlchemyFailureRow[]> =>
  Object.fromEntries(ALCHEMY_FAILURE_TABLES.map(table => [table, []])) as unknown as Record<AlchemyFailureTable, AlchemyFailureRow[]>;

const TABLES: AlchemyTables = {
  id: 'alchemy',
  failureTables: { ...emptyTables(), general: ROWS },
  powerLevels: { average: 2, superior: 1.2, heroic: 0.9, legendary: 0.6, epic: 0.4 },
  version: 3,
};

const repository = (tables: AlchemyTables | null): AlchemyTablesRepository => ({ find: () => Promise.resolve(tables) });

describe('GetAlchemyTablesHandler', () => {
  it('returns the stored tables to Core Law users and administrators', async () => {
    const handler = new GetAlchemyTablesHandler(repository(TABLES));
    await expect(handler.execute(new GetAlchemyTablesQuery('user', ['rmu-core-law']))).resolves.toEqual(TABLES);
    await expect(handler.execute(new GetAlchemyTablesQuery('service', ['rmu-admin']))).resolves.toEqual(TABLES);
  });

  it('rejects users without Core Law access', async () => {
    const handler = new GetAlchemyTablesHandler(repository(TABLES));
    await expect(handler.execute(new GetAlchemyTablesQuery('guest', ['rmu-user']))).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('fails with alchemy-tables-not-found when the tables have not been imported', async () => {
    const handler = new GetAlchemyTablesHandler(repository(null));
    const error = handler.execute(new GetAlchemyTablesQuery('user', ['rmu-core-law']));
    await expect(error).rejects.toBeInstanceOf(NotFoundError);
    await expect(error).rejects.toMatchObject({ statusCode: 404, code: 'alchemy-tables-not-found' });
  });
});

describe('MongoAlchemyTablesRepository.mapToTables', () => {
  it('maps a stored document as it is', () => {
    const { id: _id, ...rest } = TABLES;
    expect(MongoAlchemyTablesRepository.mapToTables({ _id, ...rest })).toEqual(TABLES);
  });

  it('sorts the rows by min, sets a missing max to null, fills the missing tables and defaults the version to 0', () => {
    const doc = {
      _id: 'alchemy',
      failureTables: {
        potion: [
          { min: 51, text: 'Fixture: open row', serendipity: null },
          { min: 1, max: 50, text: 'Fixture: low row', serendipity: 'major' },
        ],
      },
      powerLevels: TABLES.powerLevels,
    } as unknown as AlchemyTablesModel;

    const tables = MongoAlchemyTablesRepository.mapToTables(doc);

    expect(Object.keys(tables.failureTables)).toEqual([...ALCHEMY_FAILURE_TABLES]);
    expect(tables.failureTables.potion).toEqual([
      { min: 1, max: 50, text: 'Fixture: low row', serendipity: 'major' },
      { min: 51, max: null, text: 'Fixture: open row' },
    ]);
    expect(tables.failureTables.bonus).toEqual([]);
    expect(tables).toMatchObject({ id: 'alchemy', powerLevels: TABLES.powerLevels, version: 0 });
  });
});
