import type { EntityGuard } from '../../../shared/application/ports/entity-guard.port.js';
import { Realm } from '../../domain/aggregates/realm.js';

export const REALM_GUARD = Symbol('RealmGuardPort');

export type RealmGuardPort = EntityGuard<Realm>;
