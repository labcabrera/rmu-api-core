import { Realm } from '../../domain/aggregates/realm';

export interface RealmGuardPort {
  checkCreateRealm(roles: string[]);
  checkUpdateRealm(realm: Realm, userId: string, roles: string[]);
}
