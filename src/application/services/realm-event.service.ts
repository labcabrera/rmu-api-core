import { Realm } from '@domain/entities/realm';

export interface RealmEventService {
  created(realm: Realm, username: string): Promise<void>;

  updated(realm: Realm, username: string, changes?: Partial<Realm>): Promise<void>;

  deleted(realmId: string, realm: Realm, username: string, reason?: string): Promise<void>;
}
