import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Race } from '../../../domain/aggregates/race.js';
import { GetRaceQuery } from '../queries/get-race.query.js';
import type { RaceRepository } from '../../ports/race-repository.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import type { RaceGuardPort } from '../../ports/race-guard.port.js';

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
