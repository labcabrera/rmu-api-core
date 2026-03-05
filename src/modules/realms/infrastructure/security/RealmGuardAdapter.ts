import { Injectable } from '@nestjs/common';
import { ForbiddenError } from 'src/modules/shared/domain/errors/errors';
import { RealmGuardPort } from '../../application/ports/realm-guard.port';
import { Realm } from '../../domain/aggregates/realm';

@Injectable()
export class RealmGuardAdapter implements RealmGuardPort {
  checkCreateRealm(roles: string[]) {
    if (!roles.includes('rmu-admin')) {
      throw new ForbiddenError('You do not have permission to create a realm');
    }
  }
  checkUpdateRealm(realm: Realm, userId: string, roles: string[]) {
    if (roles.includes('rmu-admin')) return;
    if (realm.owner === userId) return;
    throw new ForbiddenError('You do not have permission to update this realm');
  }
}
