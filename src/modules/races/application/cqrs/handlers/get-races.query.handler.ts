import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Page } from 'src/modules/core/domain/entities/page';
import { Race } from 'src/modules/races/domain/aggregates/race';
import { GetRacesQuery } from '../queries/get-races.query';
import type { RaceRepository } from '../../ports/race-repository';

@QueryHandler(GetRacesQuery)
export class GetRacesHandler implements IQueryHandler<GetRacesQuery, Page<Race>> {
  constructor(@Inject('RaceRepository') private readonly raceRepository: RaceRepository) {}

  async execute(query: GetRacesQuery): Promise<Page<Race>> {
    return await this.raceRepository.findByRsql(query.rsql, query.page, query.size);
  }
}
