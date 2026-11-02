import type { EntityGuard } from '../../../shared/application/ports/entity-guard.port.js';
import { Realm } from '../../domain/aggregates/realm.js';

export const REALM_GUARD = Symbol('RealmGuardPort');

export interface RealmGuardPort extends EntityGuard<Realm> {
  /** Only an admin sets or changes `generic` (spec 055). */
  checkGeneric(roles: string[]): void;

  /** A realm with rulebook races (`system`) is deleted only by an admin (spec 063): 403 `system-entity-admin-only`. */
  checkDeleteWithSystemRaces(roles: string[], systemRaces: number): void;
}
