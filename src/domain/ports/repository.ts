import { Page } from '@domain/entities/page';

export interface Repository<I, Query> {
  findById(id: string): Promise<I>;

  find(query: Query): Promise<Page<I>>;

  save(entity: Partial<I>): Promise<I>;

  update(id: string, entity: Partial<I>): Promise<I>;

  deleteById(id: string): Promise<void>;
}
