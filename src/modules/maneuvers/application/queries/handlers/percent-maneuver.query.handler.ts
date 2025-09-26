import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PercentManeuverQuery } from '../percent-maneuver.query';
import { PercentManeuverResult } from 'src/modules/maneuvers/domain/value-objects/percent-maneuver-result.vo';
import { PercentManeuverService } from 'src/modules/maneuvers/domain/services/percent-maneuver.service';

@QueryHandler(PercentManeuverQuery)
export class PercentManeuverQueryHandler implements IQueryHandler<PercentManeuverQuery, PercentManeuverResult> {
  private readonly logger = new Logger(PercentManeuverQueryHandler.name);

  constructor(@Inject() private readonly percentManeuverService: PercentManeuverService) {}

  execute(query: PercentManeuverQuery): Promise<PercentManeuverResult> {
    this.logger.log(`Executing percentage maneuver for roll ${query.roll}`);
    return Promise.resolve(this.percentManeuverService.execute(query.roll));
  }
}
