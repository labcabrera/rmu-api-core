import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Race } from 'src/modules/races/domain/aggregates/race';
import { GetRaceQuery } from '../queries/get-race.query';
import type { RaceRepository } from '../../ports/race-repository';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import type { RaceGuardPort } from '../../ports/race-guard.port';

@QueryHandler(GetRaceQuery)
export class GetRaceHandler implements IQueryHandler<GetRaceQuery, Race> {
  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceGuardPort') private readonly raceGuardPort: RaceGuardPort,
  ) {}

  async execute(query: GetRaceQuery): Promise<Race> {
    const current = await this.raceRepository.findById(query.id);
    if (!current) throw new NotFoundError('Race', query.id);

    this.raceGuardPort.checkRead(current, query.userId, query.roles);

    return current;
  }
}
