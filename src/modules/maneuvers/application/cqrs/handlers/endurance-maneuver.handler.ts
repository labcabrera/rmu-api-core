import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EnduranceManeuverQuery } from '../queries/endurance-maneuver.query';
import { EnduranceManeuverService } from 'src/modules/maneuvers/domain/services/endurance-maneuvers/endurance-maneuver.service';
import { EnduranceManeuverResult } from 'src/modules/maneuvers/domain/value-objects/endurance-maneuver-result.vo';

@QueryHandler(EnduranceManeuverQuery)
export class EnduranceManeuverHandler implements IQueryHandler<EnduranceManeuverQuery, EnduranceManeuverResult> {
  private readonly logger = new Logger(EnduranceManeuverHandler.name);

  constructor(@Inject() private readonly enduranceManeuverService: EnduranceManeuverService) {}

  execute(query: EnduranceManeuverQuery): Promise<EnduranceManeuverResult> {
    this.logger.log(`Executing endurance maneuver for roll ${query.roll}`);
    return Promise.resolve(this.enduranceManeuverService.execute(query.roll, query.unusualEvent));
  }
}
