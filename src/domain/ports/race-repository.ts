import { Race, CreateRaceRequest, UpdateRaceRequest } from '@domain/entities/race';
import { PaginationOptions, PaginatedResult } from '@shared/types';

export interface RaceRepository {
  findById(id: string): Promise<Race | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<Race>>;
  save(race: CreateRaceRequest): Promise<Race>;
  update(id: string, race: UpdateRaceRequest): Promise<Race | null>;
  deleteById(id: string): Promise<boolean>;
  existsById(id: string): Promise<boolean>;
}
