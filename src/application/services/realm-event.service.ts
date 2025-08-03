import { Realm } from '@domain/entities/realm';

/**
 * Service for handling realm-specific domain events
 */
export interface RealmEventService {
  /**
   * Handle realm created event
   */
  created(realm: Realm, username: string): Promise<void>;

  /**
   * Handle realm updated event
   */
  updated(realm: Realm, username: string, changes?: Partial<Realm>): Promise<void>;

  /**
   * Handle realm deleted event
   */
  deleted(realmId: string, realm: Realm, username: string, reason?: string): Promise<void>;
}
