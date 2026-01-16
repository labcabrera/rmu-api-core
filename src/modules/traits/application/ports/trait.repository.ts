import { Page } from 'src/modules/shared/domain/entities/page';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';

export interface TraitRepository {
  findById(id: string): Promise<Trait | null>;

  findByRsql(rsql: string | undefined, page: number, size: number): Promise<Page<Trait>>;

  save(entity: Trait): Promise<Trait>;

  update(traitId: string, update: Partial<Trait>): Promise<Trait>;

  deleteById(id: string): Promise<Trait | null>;
}
