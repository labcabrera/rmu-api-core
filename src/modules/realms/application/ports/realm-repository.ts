import { Page } from 'src/modules/core/domain/entities/page';
import { Realm } from 'src/modules/realms/domain/aggregates/realm';

export interface RealmRepository {
  findById(id: string): Promise<Realm | null>;

  findByRsql(rsql: string | undefined, page: number, size: number): Promise<Page<Realm>>;

  save(entity: Realm): Promise<Realm>;

  update(realmId: string, update: Partial<Realm>): Promise<Realm>;

  deleteById(id: string): Promise<Realm | null>;
}
