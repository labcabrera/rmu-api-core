import { NotFoundError, ValidationError } from '../../../shared/domain/errors/errors.js';
import type { AbsoluteManeuverResult } from '../value-objects/absolute-maneuver-result.vo.js';
import { ABSOLUTE_MANEUVER_TABLE } from '../value-objects/tables/generic-maneuver.table.js';
import { Injectable } from '@nestjs/common';
import { ADRENAL_MANEUVER_TABLE } from '../value-objects/tables/adrenal-maneuver.table.js';
import { ANIMAL_MANEUVER_TABLE } from '../value-objects/tables/animal-maneuver.table.js';
import { AbsoluteManeuverTable } from '../value-objects/absolute-maneuver-table.vo.js';
import { AWARENESS_MANEUVER_TABLE } from '../value-objects/tables/awareness-maneuver.table.js';
import { COMPOSITION_MANEUVER_TABLE } from '../value-objects/tables/composition-maneuver.table.js';
import { CRAFTING_MANEUVER_TABLE } from '../value-objects/tables/crafting-maneuver.table.js';
import { GYMNASTIC_MANEUVER_TABLE } from '../value-objects/tables/gymnastic-maneuver.table.js';
import { LORE_MANEUVER_TABLE } from '../value-objects/tables/lore-maneuver.table.js';
import { MEDICAL_MANEUVER_TABLE } from '../value-objects/tables/medical-maneuver.table.js';

export const DEFAULT_ABSOLUTE_MANEUVER_TABLE = 'generic';

@Injectable()
export class AbsoluteManeuverService {
  tables: AbsoluteManeuverTable[] = [
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

  /** Resolves a roll against a code table (generic when no name is given). */
  execute(roll: number, unusualEvent: boolean, tableName?: string): AbsoluteManeuverResult {
    return this.resolve(this.getTable(tableName), roll, unusualEvent);
  }

  /** Resolves a roll against any table, code or stored. */
  resolve(table: AbsoluteManeuverTable, roll: number, unusualEvent: boolean): AbsoluteManeuverResult {
    const entry = table.table.find(row => roll >= (row.min ?? -Infinity) && roll <= (row.max ?? Infinity));
    if (!entry) throw new ValidationError(`Roll ${roll} out of bounds for absolute maneuver table ${table.name}`);

    const result: AbsoluteManeuverResult = { ...entry.result };
    if (entry.result.effects) result.effects = entry.result.effects.map(effect => ({ ...effect }));
    if (unusualEvent && table.unusualEvent) {
      result.message = `${entry.result.message} ${table.unusualEvent}`;
      result.unusualEvent = table.unusualEvent;
    }
    return result;
  }

  /** Code table by name; throws NotFoundError when it is not a code table. */
  getTable(tableName?: string): AbsoluteManeuverTable {
    const name = tableName || DEFAULT_ABSOLUTE_MANEUVER_TABLE;
    const table = this.findTable(name);
    if (!table) throw new NotFoundError('Absolute maneuver table', name);
    return table;
  }

  findTable(tableName: string): AbsoluteManeuverTable | undefined {
    return this.tables.find(t => t.name === tableName);
  }

  getTableNames(): string[] {
    return this.tables.map(t => t.name);
  }
}
