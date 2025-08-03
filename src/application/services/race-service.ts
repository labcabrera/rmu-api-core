import { inject, injectable } from 'inversify';
import { Race, CreateRaceRequest, UpdateRaceRequest } from '@domain/entities/Race';
import { RaceRepository } from '@domain/ports/race-repository';
import { PaginationOptions, PaginatedResult, NotFoundError, ConflictError } from '@shared/types';
import { TYPES } from '@shared/types/container';

@injectable()
export class RaceService {
  constructor(@inject(TYPES.RaceRepository) private raceRepository: RaceRepository) {}

  async findById(id: string): Promise<Race> {
    const race = await this.raceRepository.findById(id);
    if (!race) {
      throw new NotFoundError('Race', id);
    }
    return race;
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Race>> {
    return this.raceRepository.findAll(options);
  }

  async create(request: CreateRaceRequest): Promise<Race> {
    const exists = await this.raceRepository.existsById(request.id);
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
