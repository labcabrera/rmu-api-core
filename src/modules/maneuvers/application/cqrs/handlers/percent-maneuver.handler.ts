import { Logger } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { PercentManeuverResult } from '../../../domain/value-objects/percent-maneuver-result.vo.js';
import { PercentManeuverService } from '../../../domain/services/percent-maneuver.service.js';
import { PercentManeuverQuery } from '../queries/percent-maneuver.query.js';

@QueryHandler(PercentManeuverQuery)
export class PercentManeuverHandler implements IQueryHandler<PercentManeuverQuery, PercentManeuverResult> {
  private readonly logger = new Logger(PercentManeuverHandler.name);

  constructor(private readonly percentManeuverService: PercentManeuverService) {}

  execute(query: PercentManeuverQuery): Promise<PercentManeuverResult> {
    this.logger.log(`Executing percentage maneuver for roll ${query.roll}`);
    return Promise.resolve(this.percentManeuverService.execute(query.roll));
  }
}
