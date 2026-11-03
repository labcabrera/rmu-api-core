import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RMU_ADMIN } from '../../../../shared/domain/entities/user-roles.js';
import { ForbiddenError, NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { type AccessLevel, resolveAccess } from '../../../../shared/domain/services/entity-access.js';
import { REALM_REPOSITORY, type RealmRepository } from '../../ports/realm-repository.port.js';
import { GetRealmAccessQuery } from '../queries/get-realm-access.query.js';

/** The level of a user as a non-admin (the caller knows the roles of its user and lets an admin through itself). */
@QueryHandler(GetRealmAccessQuery)
export class GetRealmAccessHandler implements IQueryHandler<GetRealmAccessQuery, AccessLevel> {
  constructor(@Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository) {}

  async execute(query: GetRealmAccessQuery): Promise<AccessLevel> {
    if (!query.roles.includes(RMU_ADMIN)) throw new ForbiddenError('Only other APIs ask for the access of a user');
    const realm = await this.realmRepository.findById(query.realmId);
    if (!realm) throw new NotFoundError('Realm', query.realmId);
    return resolveAccess(realm, query.subjectId, []);
  }
}
