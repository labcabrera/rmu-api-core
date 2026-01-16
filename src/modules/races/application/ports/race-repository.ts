import { Race } from 'src/modules/races/domain/aggregates/race';
import { Page } from 'src/modules/shared/domain/entities/page';

export interface RaceRepository {
  findById(id: string): Promise<Race | null>;

  findByRsql(rsql: string | undefined, page: number, size: number): Promise<Page<Race>>;

  save(entity: Race): Promise<Race>;

  update(id: string, entity: Partial<Race>): Promise<Race>;

  deleteById(id: string): Promise<Race | null>;
}
