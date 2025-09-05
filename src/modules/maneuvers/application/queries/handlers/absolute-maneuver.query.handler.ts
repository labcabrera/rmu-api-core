import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AbsoluteManeuverQuery } from '../absolute-maneuver.query';
import { AbsoluteManeuverResult } from 'src/modules/maneuvers/domain/entities/absolute-maneuver-result.entity';
import { AbsoluteManeuverService } from 'src/modules/maneuvers/domain/services/absolute-maneuver.service';

@QueryHandler(AbsoluteManeuverQuery)
export class AbsoluteManeuverQueryHandler implements IQueryHandler<AbsoluteManeuverQuery, AbsoluteManeuverResult> {
  private readonly logger = new Logger(AbsoluteManeuverQueryHandler.name);

  constructor(@Inject() private readonly absoluteManeuverService: AbsoluteManeuverService) {}

  execute(query: AbsoluteManeuverQuery): Promise<AbsoluteManeuverResult> {
    this.logger.log(`Executing absolute maneuver for roll ${query.roll}`);
    return Promise.resolve(this.absoluteManeuverService.execute(query.roll));
  }
}
