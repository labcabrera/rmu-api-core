import { Injectable } from '@nestjs/common';
import type { RealmGuardPort } from '../../application/ports/realm-guard.port.js';
import { Realm } from '../../domain/aggregates/realm.js';
import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard.js';
import { RMU_ADMIN } from '../../../shared/domain/entities/user-roles.js';
import { ForbiddenError } from '../../../shared/domain/errors/errors.js';

@Injectable()
export class RealmGuardAdapter extends BaseEntityGuard<Realm> implements RealmGuardPort {
  checkGeneric(roles: string[]) {
    if (roles.includes(RMU_ADMIN)) return;
    throw new ForbiddenError('Only an admin can mark a realm as generic');
  }
}
