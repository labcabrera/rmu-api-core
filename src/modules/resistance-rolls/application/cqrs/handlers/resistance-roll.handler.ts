import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResistanceRollQuery } from '../queries/resistance-roll.query';
import { ResistanceRollService } from 'src/modules/resistance-rolls/domain/services/resistance-roll.service';
import { ResistanceRollResult } from 'src/modules/resistance-rolls/domain/value-objects/resistance-roll-result';

@QueryHandler(ResistanceRollQuery)
export class ResistanceRollHandler implements IQueryHandler<ResistanceRollQuery, ResistanceRollResult> {
  private readonly logger = new Logger(ResistanceRollHandler.name);

  constructor(@Inject() private readonly resistanceRollService: ResistanceRollService) {}

  execute(query: ResistanceRollQuery): Promise<ResistanceRollResult> {
    this.logger.log(`Executing resistance roll`);
    const result = this.resistanceRollService.execute(query);
    return Promise.resolve(result);
  }
}
