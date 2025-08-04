import { inject, injectable } from 'inversify';
import { Race } from '@domain/entities/race';
import { RaceRepository } from '@domain/ports/outbound/race-repository';
import { Page } from '@domain/entities/page';
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

  async findByRsql(rsql: string, page: number, size: number): Promise<Page<Race>> {
    return this.raceRepository.findByRsql(rsql, page, size);
  }
}
