import { EntityGuard } from 'src/modules/shared/application/ports/entity-guard';
import { Realm } from '../../domain/aggregates/realm';

export type RealmGuardPort = EntityGuard<Realm>;
