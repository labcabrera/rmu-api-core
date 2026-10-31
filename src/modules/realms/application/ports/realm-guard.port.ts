import type { EntityGuard } from '../../../shared/application/ports/entity-guard.port.js';
import { Realm } from '../../domain/aggregates/realm.js';

export const REALM_GUARD = Symbol('RealmGuardPort');

export interface RealmGuardPort extends EntityGuard<Realm> {
  /** Only an admin sets or changes `generic` (spec 055). */
  checkGeneric(roles: string[]): void;
}
