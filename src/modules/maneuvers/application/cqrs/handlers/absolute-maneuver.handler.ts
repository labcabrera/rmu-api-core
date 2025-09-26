import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AbsoluteManeuverResult } from 'src/modules/maneuvers/domain/value-objects/absolute-maneuver-result.vo';
import { AbsoluteManeuverService } from 'src/modules/maneuvers/domain/services/absolute-maneuver.service';
import { AbsoluteManeuverQuery } from '../queries/absolute-maneuver.query';
import { ManeuverService } from 'src/modules/maneuvers/domain/services/maneuver-service';
import { ValidationError } from 'src/modules/core/domain/errors/errors';
import { AwarenessManeuverService } from 'src/modules/maneuvers/domain/services/awareness-maneuver.service';
import { AnimalManeuverService } from 'src/modules/maneuvers/domain/services/animal-maneuver.service';
import { AdrenalManeuverService } from 'src/modules/maneuvers/domain/services/adrenal-maneuver.service';
import { CraftingManeuverService } from 'src/modules/maneuvers/domain/services/crafting-maneuver.service';
import { GymnasticManeuverService } from 'src/modules/maneuvers/domain/services/gymnastic-maneuver.service';

@QueryHandler(AbsoluteManeuverQuery)
export class AbsoluteManeuverHandler implements IQueryHandler<AbsoluteManeuverQuery, AbsoluteManeuverResult> {
  private readonly logger = new Logger(AbsoluteManeuverHandler.name);

  constructor(
    @Inject() private readonly absoluteManeuverService: AbsoluteManeuverService,
    @Inject() private readonly animalManeuverService: AnimalManeuverService,
    @Inject() private readonly awarenessManeuverService: AwarenessManeuverService,
    @Inject() private readonly adrenalManeuverService: AdrenalManeuverService,
    @Inject() private readonly craftingManeuverService: CraftingManeuverService,
    @Inject() private readonly gymnasticManeuverService: GymnasticManeuverService,
  ) {}

  execute(query: AbsoluteManeuverQuery): Promise<AbsoluteManeuverResult> {
    this.logger.log(`Executing absolute maneuver for roll ${query.roll}`);
    const service = this.getService(query);
    return Promise.resolve(service.execute(query.roll, query.unusualEvent));
  }

  private getService(query: AbsoluteManeuverQuery): ManeuverService {
    if (!query.table) {
      return this.absoluteManeuverService;
    }
    switch (query.table) {
      case 'adrenal':
        return this.adrenalManeuverService;
      case 'animal':
        return this.animalManeuverService;
      case 'awareness':
        return this.awarenessManeuverService;
      case 'crafting':
        return this.craftingManeuverService;
      case 'gymnastic':
        return this.gymnasticManeuverService;
      default:
        throw new ValidationError('Invalid table type');
    }
  }
}
