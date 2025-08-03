import { inject, injectable } from 'inversify';
import { Race } from '@domain/entities/race';
import { RaceRepository } from '@domain/ports/outbound/race-repository';
import { Page } from '@domain/entities/page';
import { RaceQuery } from '@domain/queries/race-query';
import { NotFoundError } from '@domain/errors/errors';

@injectable()
export class RaceService {
  constructor(@inject('RaceRepository') private raceRepository: RaceRepository) {}

  async findById(id: string): Promise<Race> {
    const race = await this.raceRepository.findById(id);
    if (!race) {
      throw new NotFoundError('Race ', id);
    }
    return race;
  }

  async findAll(query: RaceQuery): Promise<Page<Race>> {
    return this.raceRepository.find(query);
  }
}
