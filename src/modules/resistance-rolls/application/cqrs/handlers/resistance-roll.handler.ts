import { Logger } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResistanceRollQuery } from '../queries/resistance-roll.query.js';
import { ResistanceRollService } from '../../../domain/services/resistance-roll.service.js';
import { ResistanceRollResult } from '../../../domain/value-objects/resistance-roll-result.js';

@QueryHandler(ResistanceRollQuery)
export class ResistanceRollHandler implements IQueryHandler<ResistanceRollQuery, ResistanceRollResult> {
  private readonly logger = new Logger(ResistanceRollHandler.name);

  constructor(private readonly resistanceRollService: ResistanceRollService) {}

  execute(query: ResistanceRollQuery): Promise<ResistanceRollResult> {
    this.logger.log(`Executing resistance roll`);
    const result = this.resistanceRollService.execute(query);
    return Promise.resolve(result);
  }
}
