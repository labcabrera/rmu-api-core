import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { Page } from 'src/modules/core/domain/entities/page';
import { Race } from 'src/modules/races/domain/aggregates/race';
import * as raceRepository from '../../../../races/application/ports/out/race-repository';
import { GetRacesQuery } from '../../../../races/application/queries/get-races.query';

@QueryHandler(GetRacesQuery)
export class GetRacesQueryHandler implements IQueryHandler<GetRacesQuery, Page<Race>> {
  constructor(@Inject('RaceRepository') private readonly raceRepository: raceRepository.RaceRepository) {}

  async execute(query: GetRacesQuery): Promise<Page<Race>> {
    return await this.raceRepository.findByRsql(query.rsql, query.page, query.size);
  }
}
