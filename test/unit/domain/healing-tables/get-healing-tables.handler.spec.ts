import { describe, expect, it } from 'vitest';
import { GetHealingTablesHandler } from '../../../../src/modules/healing-tables/application/cqrs/handlers/get-healing-tables.handler';
import { GetHealingTablesQuery } from '../../../../src/modules/healing-tables/application/cqrs/queries/get-healing-tables.query';
import type { HealingTablesRepository } from '../../../../src/modules/healing-tables/application/ports/healing-tables-repository';
import { HealingTables } from '../../../../src/modules/healing-tables/domain/value-objects/healing-tables.vo';
import { MongoHealingTablesRepository } from '../../../../src/modules/healing-tables/infrastructure/db/mongo.healing-tables.repository';
import { HealingTablesModel } from '../../../../src/modules/healing-tables/infrastructure/persistence/models/healing-tables.model';
import { ForbiddenError, NotFoundError } from '../../../../src/modules/shared/domain/errors/errors';

// Fixture values, not the rulebook ones
const days = { bone: 1, 'cut-burn': 2, 'muscle-tendon': 3, organ: 4, 'poison-disease': 5, 'skin-tissue': 6 };
const TABLES: HealingTables = {
  recoveryDays: [{ min: null, max: null, days }],
  severityMultipliers: { light: 1, medium: 2, severe: 3 },
  headMultiplier: 2,
  severity: [{ severity: 'light', maxPenalty: null, maxBleeding: null }],
  healingTypeModifiers: { none: -1, medicine: 0, 'medicine-absolute': 1, 'magic-or-herbs': 2, 'magic-and-herbs': 3 },
  herbalismBonus: 5,
  permanentInjury: [{ min: null, max: null, result: 'failure', fraction: 0.5 }],
  restHpPercentPerPeriod: 10,
  restPeriodHours: 2,
  fullRestDayMultiplier: 2,
  talentMultipliers: { 'fast-healer': 0.5 },
};

const repository = (tables: HealingTables | null): HealingTablesRepository => ({ findById: () => Promise.resolve(tables) });

describe('GetHealingTablesHandler', () => {
  it('returns the stored tables to Core Law users and administrators', async () => {
    const handler = new GetHealingTablesHandler(repository(TABLES));
    await expect(handler.execute(new GetHealingTablesQuery('user', ['rmu-core-law']))).resolves.toEqual(TABLES);
    await expect(handler.execute(new GetHealingTablesQuery('service', ['rmu-admin']))).resolves.toEqual(TABLES);
  });

  it('rejects users without Core Law access', async () => {
    const handler = new GetHealingTablesHandler(repository(TABLES));
    await expect(handler.execute(new GetHealingTablesQuery('guest', ['rmu-user']))).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('fails with not found when the tables have not been imported', async () => {
    const handler = new GetHealingTablesHandler(repository(null));
    await expect(handler.execute(new GetHealingTablesQuery('user', ['rmu-core-law']))).rejects.toBeInstanceOf(NotFoundError);
  });

  it('maps a stored document without its _id and with open bounds as null', () => {
    const doc = { ...TABLES, _id: 'core-law', recoveryDays: [{ days } as never] } as HealingTablesModel;
    const mapped = MongoHealingTablesRepository.mapToTables(doc);
    expect(mapped).not.toHaveProperty('_id');
    expect(mapped.recoveryDays).toEqual([{ min: null, max: null, days }]);
  });
});
