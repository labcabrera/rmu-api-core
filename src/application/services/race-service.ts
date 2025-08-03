import { inject, injectable } from 'inversify';
import { Race, CreateRaceRequest, UpdateRaceRequest } from '@domain/entities/race';
import { RaceRepository } from '@domain/ports/race-repository';
import { Page } from '@domain/entities/page';
import { RaceQuery } from '@domain/queries/race-query';
import { ConflictError, NotFoundError } from '@domain/errors/errors';

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

  async create(request: CreateRaceRequest): Promise<Race> {
    const exists = await this.raceRepository.findById(request.id);
    if (exists) {
      throw new ConflictError(`Race with id '${request.id}' already exists`);
    }
    return this.raceRepository.save(request);
  }

  async update(id: string, request: UpdateRaceRequest): Promise<Race> {
    const race = await this.raceRepository.update(id, request);
    if (!race) {
      throw new NotFoundError('Race', id);
    }
    return race;
  }

  async deleteById(id: string): Promise<void> {
    const deleted = await this.raceRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundError('Race', id);
    }
  }
}
