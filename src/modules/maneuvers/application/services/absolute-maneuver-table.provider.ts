import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/errors.js';
import { AbsoluteManeuverService, DEFAULT_ABSOLUTE_MANEUVER_TABLE } from '../../domain/services/absolute-maneuver.service.js';
import { AbsoluteManeuverTable } from '../../domain/value-objects/absolute-maneuver-table.vo.js';
import type { ManeuverTableRepository } from '../ports/maneuver-table-repository.js';

/** Looks absolute maneuver tables up in code first and then in the database. */
@Injectable()
export class AbsoluteManeuverTableProvider {
  constructor(
    private readonly absoluteManeuverService: AbsoluteManeuverService,
    @Inject('ManeuverTableRepository') private readonly maneuverTableRepository: ManeuverTableRepository,
  ) {}

  async getTable(tableName?: string): Promise<AbsoluteManeuverTable> {
    const name = tableName || DEFAULT_ABSOLUTE_MANEUVER_TABLE;
    const table = this.absoluteManeuverService.findTable(name) ?? (await this.maneuverTableRepository.findByName(name));
    if (!table) throw new NotFoundError('Absolute maneuver table', name);
    return table;
  }

  /** Code table names followed by the stored ones that do not clash with them. */
  async getTableNames(): Promise<string[]> {
    const codeNames = this.absoluteManeuverService.getTableNames();
    const storedNames = await this.maneuverTableRepository.findNames();
    return [...codeNames, ...storedNames.filter(name => !codeNames.includes(name)).sort()];
  }
}
