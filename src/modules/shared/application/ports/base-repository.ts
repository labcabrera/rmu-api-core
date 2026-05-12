import { QueryCriteria, SortCriteria } from '../criteria/query-criteria';
import { Page } from '../../domain/entities/page';

export interface BaseRepository<I> {
  findById(id: string): Promise<I | null>;

  findByRsql(rsql: string | undefined, page: number, size: number, filter?: QueryCriteria, sort?: SortCriteria): Promise<Page<I>>;

  save(entity: Partial<I>): Promise<I>;

  update(id: string, entity: Partial<I>): Promise<I>;

  deleteById(id: string): Promise<I | null>;
}
