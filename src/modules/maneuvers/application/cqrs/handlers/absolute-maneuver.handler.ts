import { Logger } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { AbsoluteManeuverResult } from '../../../domain/value-objects/absolute-maneuver-result.vo.js';
import { AbsoluteManeuverService } from '../../../domain/services/absolute-maneuver.service.js';
import { AbsoluteManeuverQuery } from '../queries/absolute-maneuver.query.js';
import { AbsoluteManeuverTableProvider } from '../../services/absolute-maneuver-table.provider.js';

@QueryHandler(AbsoluteManeuverQuery)
export class AbsoluteManeuverHandler implements IQueryHandler<AbsoluteManeuverQuery, AbsoluteManeuverResult> {
  private readonly logger = new Logger(AbsoluteManeuverHandler.name);

  constructor(
    private readonly absoluteManeuverService: AbsoluteManeuverService,
    private readonly tableProvider: AbsoluteManeuverTableProvider,
  ) {}

  async execute(query: AbsoluteManeuverQuery): Promise<AbsoluteManeuverResult> {
    this.logger.log(`Executing absolute maneuver for roll ${query.roll} (table ${query.table ?? 'generic'})`);
    const table = await this.tableProvider.getTable(query.table);
    return this.absoluteManeuverService.resolve(table, query.roll, query.unusualEvent);
  }
}
