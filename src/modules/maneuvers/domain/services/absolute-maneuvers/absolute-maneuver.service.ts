import { ValidationError } from 'src/modules/shared/domain/errors/errors';
import { AbsoluteManeuverResult } from '../../value-objects/absolute-maneuver-result.vo';
import { ABSOLUTE_MANEUVER_TABLE } from '../../value-objects/tables/generic-maneuver.table';
import { Injectable } from '@nestjs/common';
import { ADRENAL_MANEUVER_TABLE } from '../../value-objects/tables/adrenal-maneuver.table';
import { ANIMAL_MANEUVER_TABLE } from '../../value-objects/tables/animal-maneuver.table';
import { AbsoluteManeuverTable } from '../../value-objects/absolute-maneuver-table.vo';
import { AWARENESS_MANEUVER_TABLE } from '../../value-objects/tables/awareness-maneuver.table';
import { COMPOSITION_MANEUVER_TABLE } from '../../value-objects/tables/composition-maneuver.table';
import { CRAFTING_MANEUVER_TABLE } from '../../value-objects/tables/crafting-maneuver.table';

@Injectable()
export class AbsoluteManeuverService {
  tables: AbsoluteManeuverTable[] = [
    ABSOLUTE_MANEUVER_TABLE,
    ADRENAL_MANEUVER_TABLE,
    ANIMAL_MANEUVER_TABLE,
    AWARENESS_MANEUVER_TABLE,
    COMPOSITION_MANEUVER_TABLE,
    CRAFTING_MANEUVER_TABLE,
  ];

  execute(roll: number, unusualEvent: boolean, tableName?: string): AbsoluteManeuverResult {
    const table = this.getTable(tableName);
    const entry = table.table.find((row) => roll >= (row.min || -Infinity) && roll <= (row.max || Infinity));
    if (!entry) throw new Error('Roll out of bounds');

    return {
      ...entry.result,
      message: unusualEvent ? `${entry.result.message} ${table.unusualEvent}` : entry.result.message,
    };
  }

  getTable(tableName?: string) {
    const table = this.tables.find((t) => t.name == (tableName ? tableName : 'generic'));
    if (!table) throw new ValidationError('Invalid absolute maneuver table');
    return table;
  }

  getTableNames(): string[] {
    return this.tables.map((t) => t.name);
  }
}
