import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AbsoluteManeuverResult } from 'src/modules/maneuvers/domain/value-objects/absolute-maneuver-result.vo';
import { AbsoluteManeuverService } from 'src/modules/maneuvers/domain/services/absolute-maneuver.service';
import { AbsoluteManeuverQuery } from '../queries/absolute-maneuver.query';

@QueryHandler(AbsoluteManeuverQuery)
export class AbsoluteManeuverHandler implements IQueryHandler<AbsoluteManeuverQuery, AbsoluteManeuverResult> {
  private readonly logger = new Logger(AbsoluteManeuverHandler.name);

  constructor(@Inject() private readonly absoluteManeuverService: AbsoluteManeuverService) {}

  execute(query: AbsoluteManeuverQuery): Promise<AbsoluteManeuverResult> {
    this.logger.log(`Executing absolute maneuver for roll ${query.roll}`);
    return Promise.resolve(this.absoluteManeuverService.execute(query.roll, query.unusualEvent));
  }
}
