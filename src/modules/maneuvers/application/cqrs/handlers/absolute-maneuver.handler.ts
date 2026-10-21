import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AbsoluteManeuverResult } from '../../../domain/value-objects/absolute-maneuver-result.vo';
import { AbsoluteManeuverService } from '../../../domain/services/absolute-maneuver.service';
import { AbsoluteManeuverQuery } from '../queries/absolute-maneuver.query';
import { AbsoluteManeuverTableProvider } from '../../services/absolute-maneuver-table.provider';

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
