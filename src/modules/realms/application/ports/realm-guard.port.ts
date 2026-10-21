import type { EntityGuard } from '../../../shared/application/ports/entity-guard.js';
import { Realm } from '../../domain/aggregates/realm.js';

export type RealmGuardPort = EntityGuard<Realm>;
