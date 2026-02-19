import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Race } from 'src/modules/races/domain/aggregates/race';
import { GetRaceQuery } from '../queries/get-race.query';
import type { RaceRepository } from '../../ports/race-repository';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';

@QueryHandler(GetRaceQuery)
export class GetRaceHandler implements IQueryHandler<GetRaceQuery, Race> {
  constructor(@Inject('RaceRepository') private readonly raceRepository: RaceRepository) {}

  async execute(query: GetRaceQuery): Promise<Race> {
    const data = await this.raceRepository.findById(query.id);
    if (!data) {
      throw new NotFoundError('Race', query.id);
    }
    return data;
  }
}
