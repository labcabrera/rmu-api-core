import { FilterQuery } from 'mongoose';
import { Realm } from 'src/modules/realms/domain/aggregates/realm';
import { Page } from 'src/modules/shared/domain/entities/page';

export interface RealmRepository {
  findById(id: string): Promise<Realm | null>;

  findByRsql(rsql: string | undefined, page: number, size: number, filter?: FilterQuery<any>): Promise<Page<Realm>>;

  save(entity: Realm): Promise<Realm>;

  update(realmId: string, update: Partial<Realm>): Promise<Realm>;

  deleteById(id: string): Promise<Realm | null>;
}
