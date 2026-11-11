import { Inject, Injectable } from '@nestjs/common';
import type { RaceGuardPort } from '../../application/ports/race-guard.port.js';
import { Race } from '../../domain/aggregates/race.js';
import { RealmChildGuardBase } from '../../../realms/infrastructure/security/realm-child-guard.js';
import { REALM_ACCESS, type RealmAccessPort } from '../../../realms/application/ports/realm-access.port.js';
import type { QueryCriteria } from '../../../shared/application/criteria/query-criteria.js';

@Injectable()
export class RaceGuardAdapter extends RealmChildGuardBase<Race> implements RaceGuardPort {
  constructor(@Inject(REALM_ACCESS) realmAccess: RealmAccessPort) {
    super(realmAccess);
  }

  /** The races of the realms the user reads. */
  buildQueryPredicate(userId: string, roles: string[]): Promise<QueryCriteria> {
    return this.realmPredicate(userId, roles, false);
  }
}
