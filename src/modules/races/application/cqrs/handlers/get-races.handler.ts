import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Race } from '../../../domain/aggregates/race.js';
import { GetRacesQuery } from '../queries/get-races.query.js';
import { RACE_REPOSITORY, type RaceRepository } from '../../ports/race-repository.port.js';
import { Page } from '../../../../shared/application/pagination/page.js';
import { RACE_GUARD, type RaceGuardPort } from '../../ports/race-guard.port.js';

@QueryHandler(GetRacesQuery)
export class GetRacesHandler implements IQueryHandler<GetRacesQuery, Page<Race>> {
  constructor(
    @Inject(RACE_REPOSITORY) private readonly raceRepository: RaceRepository,
    @Inject(RACE_GUARD) private readonly raceGuardPort: RaceGuardPort,
  ) {}

  async execute(query: GetRacesQuery): Promise<Page<Race>> {
    const predicate = this.raceGuardPort.buildQueryPredicate(query.userId, query.roles);
    const sort = { name: 'asc' } as const;
    return await this.raceRepository.findByRsql(query.rsql, query.page, query.size, predicate, sort);
  }
}
