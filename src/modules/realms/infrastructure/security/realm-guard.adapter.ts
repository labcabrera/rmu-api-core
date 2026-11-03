import { Injectable } from '@nestjs/common';
import type { RealmGuardPort } from '../../application/ports/realm-guard.port.js';
import { Realm } from '../../domain/aggregates/realm.js';
import { QueryCriteria } from '../../../shared/application/criteria/query-criteria.js';
import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard.js';
import { RMU_ADMIN } from '../../../shared/domain/entities/user-roles.js';
import { ForbiddenError } from '../../../shared/domain/errors/errors.js';
import { SYSTEM_ENTITY_ADMIN_ONLY } from '../../../shared/domain/services/entity-permissions.js';

@Injectable()
export class RealmGuardAdapter extends BaseEntityGuard<Realm> implements RealmGuardPort {
  /** The base filter, plus the realms of the strategic games where the user is a member (spec 071). */
  buildQueryPredicate(userId: string, roles: string[]): QueryCriteria {
    if (roles.includes(RMU_ADMIN)) return QueryCriteria.empty();
    return QueryCriteria.anyOf([
      QueryCriteria.eq('accessType', 'public'),
      QueryCriteria.eq('owner', userId),
      QueryCriteria.eq('shares.userId', userId),
      QueryCriteria.eq('gameReaderIds', userId),
    ]);
  }

  checkGeneric(roles: string[]) {
    if (roles.includes(RMU_ADMIN)) return;
    throw new ForbiddenError('Only an admin can mark a realm as generic');
  }

  checkDeleteWithSystemRaces(roles: string[], systemRaces: number) {
    if (systemRaces === 0) return;
    if (roles.includes(RMU_ADMIN)) return;
    throw new ForbiddenError(`Only an admin can delete a realm with ${systemRaces} system races`, SYSTEM_ENTITY_ADMIN_ONLY);
  }
}
