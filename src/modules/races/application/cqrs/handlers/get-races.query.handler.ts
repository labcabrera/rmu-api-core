import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Race } from '../../../domain/aggregates/race.js';
import { GetRacesQuery } from '../queries/get-races.query.js';
import type { RaceRepository } from '../../ports/race-repository.js';
import { Page } from '../../../../shared/domain/entities/page.js';
import type { RaceGuardPort } from '../../ports/race-guard.port.js';

@QueryHandler(GetRacesQuery)
export class GetRacesHandler implements IQueryHandler<GetRacesQuery, Page<Race>> {
  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceGuardPort') private readonly raceGuardPort: RaceGuardPort,
  ) {}

  async execute(query: GetRacesQuery): Promise<Page<Race>> {
    const predicate = this.raceGuardPort.buildQueryPredicate(query.userId, query.roles);
    const sort = { name: 'asc' } as const;
    return await this.raceRepository.findByRsql(query.rsql, query.page, query.size, predicate, sort);
  }
}
