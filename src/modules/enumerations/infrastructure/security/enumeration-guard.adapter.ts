import { Inject, Injectable } from '@nestjs/common';
import type { EnumerationGuardPort } from '../../application/ports/enumeration-guard.port.js';
import { Enumeration } from '../../domain/aggregates/enumeration.js';
import { RealmChildGuardBase } from '../../../realms/infrastructure/security/realm-child-guard.js';
import { REALM_ACCESS, type RealmAccessPort } from '../../../realms/application/ports/realm-access.port.js';
import type { QueryCriteria } from '../../../shared/application/criteria/query-criteria.js';

@Injectable()
export class EnumerationGuardAdapter extends RealmChildGuardBase<Enumeration> implements EnumerationGuardPort {
  constructor(@Inject(REALM_ACCESS) realmAccess: RealmAccessPort) {
    super(realmAccess);
  }

  /** The global enumerations the user reads, and those of the realms the user reads. */
  buildQueryPredicate(userId: string, roles: string[]): Promise<QueryCriteria> {
    return this.realmPredicate(userId, roles, true);
  }
}
