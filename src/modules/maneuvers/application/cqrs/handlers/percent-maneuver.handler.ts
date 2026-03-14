import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PercentManeuverResult } from 'src/modules/maneuvers/domain/value-objects/percent-maneuver-result.vo';
import { PercentManeuverService } from 'src/modules/maneuvers/domain/services/percent-maneuver.service';
import { PercentManeuverQuery } from '../queries/percent-maneuver.query';

@QueryHandler(PercentManeuverQuery)
export class PercentManeuverHandler implements IQueryHandler<PercentManeuverQuery, PercentManeuverResult> {
  private readonly logger = new Logger(PercentManeuverHandler.name);

  constructor(@Inject() private readonly percentManeuverService: PercentManeuverService) {}

  execute(query: PercentManeuverQuery): Promise<PercentManeuverResult> {
    this.logger.log(`Executing percentage maneuver for roll ${query.roll}`);
    return Promise.resolve(this.percentManeuverService.execute(query.roll));
  }
}
