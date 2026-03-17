import { BaseRepository } from 'src/modules/shared/application/ports/base-repository';
import { Enumeration } from '../../domain/aggregates/enumeration';

export interface EnumerationRepository extends BaseRepository<Enumeration> {
  findByNameCategoryAndRealm(name: string, category: string, realmId: string | null): Promise<Enumeration | null>;
}
