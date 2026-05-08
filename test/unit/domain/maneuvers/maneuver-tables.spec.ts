import { describe, expect, it } from '@jest/globals';
import { AbsoluteManeuverTable } from 'src/modules/maneuvers/domain/value-objects/absolute-maneuver-table.vo';
import { ABSOLUTE_MANEUVER_TABLE } from 'src/modules/maneuvers/domain/value-objects/tables/generic-maneuver.table';
import { ADRENAL_MANEUVER_TABLE } from 'src/modules/maneuvers/domain/value-objects/tables/adrenal-maneuver.table';
import { ANIMAL_MANEUVER_TABLE } from 'src/modules/maneuvers/domain/value-objects/tables/animal-maneuver.table';
import { AWARENESS_MANEUVER_TABLE } from 'src/modules/maneuvers/domain/value-objects/tables/awareness-maneuver.table';
import { COMPOSITION_MANEUVER_TABLE } from 'src/modules/maneuvers/domain/value-objects/tables/composition-maneuver.table';
import { CRAFTING_MANEUVER_TABLE } from 'src/modules/maneuvers/domain/value-objects/tables/crafting-maneuver.table';
import { GYMNASTIC_MANEUVER_TABLE } from 'src/modules/maneuvers/domain/value-objects/tables/gymnastic-maneuver.table';
import { LORE_MANEUVER_TABLE } from 'src/modules/maneuvers/domain/value-objects/tables/lore-maneuver.table';
import { MEDICAL_MANEUVER_TABLE } from 'src/modules/maneuvers/domain/value-objects/tables/medical-maneuver.table';

const tables = [
  ABSOLUTE_MANEUVER_TABLE,
  ADRENAL_MANEUVER_TABLE,
  ANIMAL_MANEUVER_TABLE,
  AWARENESS_MANEUVER_TABLE,
  COMPOSITION_MANEUVER_TABLE,
  CRAFTING_MANEUVER_TABLE,
  GYMNASTIC_MANEUVER_TABLE,
  LORE_MANEUVER_TABLE,
  MEDICAL_MANEUVER_TABLE,
];

describe('absolute maneuver tables', () => {
  it('are value objects with a name, unusual event, and five ordered result entries', () => {
    tables.forEach(table => {
      expect(table).toBeInstanceOf(AbsoluteManeuverTable);
      expect(table.name).toEqual(expect.any(String));
      expect(table.unusualEvent).toEqual(expect.any(String));
      expect(table.table).toHaveLength(5);
      expect(table.table.map(entry => entry.result.result)).toEqual([
        'absolute-failure',
        'failure',
        'partial-success',
        'success',
        'absolute-success',
      ]);
    });
  });

  it('cover low and high open-ended rolls', () => {
    tables.forEach(table => {
      expect(table.table[0].min).toBeNull();
      expect(table.table[0].max).toBe(0);
      expect(table.table[4].max === null || table.table[4].max === Infinity).toBe(true);
    });
  });

  it('preserve effect metadata for tables with mechanical outcomes', () => {
    expect(ADRENAL_MANEUVER_TABLE.table[4].result.effects).toEqual([{ status: 'adrenalDoubleBenefits', rounds: 1 }]);
    expect(ANIMAL_MANEUVER_TABLE.table[0].result.effects).toEqual([{ status: 'receivedAttack', value: 30 }]);
    expect(CRAFTING_MANEUVER_TABLE.table[2].result.effects).toEqual([{ status: 'itemBreakage', value: -10 }]);
    expect(GYMNASTIC_MANEUVER_TABLE.table[0].result.effects).toEqual([{ status: 'stunned', rounds: 2 }]);
    expect(MEDICAL_MANEUVER_TABLE.table[1].result.effects).toEqual([{ status: 'recoveryRollModifier', value: -100 }]);
  });
});
