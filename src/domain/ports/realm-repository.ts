import { Page } from '@domain/entities/page';
import { Realm } from '@domain/entities/realm';
import { RealmQuery } from '@domain/queries/realm-query';

export interface RealmRepository {
  findById(id: string): Promise<Realm | null>;
  find(query: RealmQuery): Promise<Page<Realm>>;
  save(realm: Partial<Realm>): Promise<Realm>;
  update(id: string, realm: Partial<Realm>): Promise<Realm>;
  deleteById(id: string): Promise<boolean>;
}
