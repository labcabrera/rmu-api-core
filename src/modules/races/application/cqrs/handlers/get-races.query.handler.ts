import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Race } from 'src/modules/races/domain/aggregates/race';
import { GetRacesQuery } from '../queries/get-races.query';
import type { RaceRepository } from '../../ports/race-repository';
import { Page } from 'src/modules/shared/domain/entities/page';
import type { RaceGuardPort } from '../../ports/race-guard.port';

@QueryHandler(GetRacesQuery)
export class GetRacesHandler implements IQueryHandler<GetRacesQuery, Page<Race>> {
  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceGuardPort') private readonly raceGuardPort: RaceGuardPort,
  ) {}

  async execute(query: GetRacesQuery): Promise<Page<Race>> {
    const predicate = this.raceGuardPort.buildQueryPredicate(query.userId, query.roles);
    const sort = { name: 1 };
    return await this.raceRepository.findByRsql(query.rsql, query.page, query.size, predicate, sort);
  }
}
