import { Page } from '@domain/entities/page';
import { Race } from '@domain/entities/race';
import { RaceQuery } from '@domain/queries/race-query';

export interface RaceRepository {
  findById(id: string): Promise<Race | null>;

  find(query: RaceQuery): Promise<Page<Race>>;

  save(race: Partial<Race>): Promise<Race>;

  update(id: string, race: Partial<Race>): Promise<Race>;

  deleteById(id: string): Promise<boolean>;
}
