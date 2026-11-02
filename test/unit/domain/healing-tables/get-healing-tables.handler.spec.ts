import { describe, expect, it } from 'vitest';
import { GetHealingTablesHandler } from '../../../../src/modules/healing-tables/application/cqrs/handlers/get-healing-tables.handler.js';
import { GetHealingTablesQuery } from '../../../../src/modules/healing-tables/application/cqrs/queries/get-healing-tables.query.js';
import type { HealingTablesRepository } from '../../../../src/modules/healing-tables/application/ports/healing-tables-repository.port.js';
import type { HealingTables } from '../../../../src/modules/healing-tables/domain/value-objects/healing-tables.vo.js';
import { MongoHealingTablesRepository } from '../../../../src/modules/healing-tables/infrastructure/db/mongo.healing-tables.repository.js';
import { HealingTablesModel } from '../../../../src/modules/healing-tables/infrastructure/persistence/models/healing-tables.model.js';
import { ForbiddenError, NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';

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
  treatmentDifficulties: [{ procedure: 'stitches', injuryType: 'unknown', severity: 'light', difficulty: 'l' }],
  treatmentRules: {
    headDifficultySteps: 2,
    cauterizePenaltyPerBleeding: -1,
    bleedingProcedures: ['stitches'],
    tourniquetLocations: ['leg'],
  },
  treatmentDurations: [
    { procedure: 'stitches', rounds: 4, perBleeding: true },
    { procedure: 'surgery', rounds: null, perBleeding: false },
  ],
  cauterization: [
    { min: null, max: 9, result: 'failure', bleeding: 'unchanged', heatSeverity: 'E', hitsDice: 9 },
    { min: 10, max: null, result: 'success', bleeding: 'halved', heatSeverity: null, hitsDice: 0 },
  ],
  cauterizationUnusualRoll: 11,
  surgeryRequired: [{ injuryType: 'skin-tissue', severity: 'medium' }],
  treatmentLimits: {
    splint: { leg: { pace: 'sprint' }, arm: { limbUnusable: true } },
    cast: { leg: { pace: 'jog', cane: 'run', crutches: 'dash' }, maneuverPenaltyFactor: 0.3 },
  },
  tourniquet: { loosenEveryRounds: 3, graceRounds: 1 },
  stabilize: { difficulty: 'vh', successRounds: 3, absoluteRounds: 6 },
  salveModifier: { min: -3, max: 4 },
  combatItemAp: 1,
};

const SPEC_068_DEFAULTS = {
  treatmentDurations: [],
  cauterization: [],
  cauterizationUnusualRoll: null,
  surgeryRequired: [],
  treatmentLimits: null,
  tourniquet: null,
  stabilize: null,
  salveModifier: null,
  combatItemAp: null,
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
    expect(mapped.treatmentDifficulties).toEqual(TABLES.treatmentDifficulties);
    expect(mapped.treatmentRules).toEqual(TABLES.treatmentRules);
  });

  it('maps the spec 068 combat fields as stored', () => {
    const mapped = MongoHealingTablesRepository.mapToTables({ ...TABLES, _id: 'core-law' });
    expect(mapped).toEqual(TABLES);
  });

  it('maps a document imported before spec 068 with empty lists and null rules', () => {
    const older: HealingTablesModel = { ...TABLES, _id: 'core-law' };
    for (const key of Object.keys(SPEC_068_DEFAULTS)) delete (older as unknown as Record<string, unknown>)[key];
    const mapped = MongoHealingTablesRepository.mapToTables(older);
    expect(mapped).toEqual({ ...TABLES, ...SPEC_068_DEFAULTS });
  });

  it('fills missing optional values of the combat rows and drops incomplete limits', () => {
    const doc = {
      ...TABLES,
      _id: 'core-law',
      treatmentDurations: [{ procedure: 'herbs' }],
      cauterization: [{ result: 'absolute-success', bleeding: 'stopped' }],
      treatmentLimits: { splint: { leg: { pace: 'walk' } } },
    } as unknown as HealingTablesModel;
    const mapped = MongoHealingTablesRepository.mapToTables(doc);
    expect(mapped.treatmentDurations).toEqual([{ procedure: 'herbs', rounds: null, perBleeding: false }]);
    expect(mapped.cauterization).toEqual([
      { min: null, max: null, result: 'absolute-success', bleeding: 'stopped', heatSeverity: null, hitsDice: 0 },
    ]);
    expect(mapped.treatmentLimits).toBeNull();
  });

  it('maps a document imported before the treatment difficulties with no rows and neutral rules', () => {
    const older: HealingTablesModel = { ...TABLES, _id: 'core-law' };
    delete older.treatmentDifficulties;
    delete older.treatmentRules;
    const mapped = MongoHealingTablesRepository.mapToTables(older);
    expect(mapped.treatmentDifficulties).toEqual([]);
    expect(mapped.treatmentRules).toEqual({
      headDifficultySteps: 0,
      cauterizePenaltyPerBleeding: 0,
      bleedingProcedures: [],
      tourniquetLocations: [],
    });
  });
});
