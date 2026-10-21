import { Logger } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EnduranceManeuverQuery } from '../queries/endurance-maneuver.query.js';
import { EnduranceManeuverService } from '../../../domain/services/endurance-maneuver.service.js';
import type { EnduranceManeuverResult } from '../../../domain/value-objects/endurance-maneuver-result.vo.js';

@QueryHandler(EnduranceManeuverQuery)
export class EnduranceManeuverHandler implements IQueryHandler<EnduranceManeuverQuery, EnduranceManeuverResult> {
  private readonly logger = new Logger(EnduranceManeuverHandler.name);

  constructor(private readonly enduranceManeuverService: EnduranceManeuverService) {}

  execute(query: EnduranceManeuverQuery): Promise<EnduranceManeuverResult> {
    this.logger.log(`Executing endurance maneuver for roll ${query.roll}`);
    return Promise.resolve(this.enduranceManeuverService.execute(query.roll, query.unusualEvent));
  }
}
