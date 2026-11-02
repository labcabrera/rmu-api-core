import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Realm } from '../../../domain/aggregates/realm.js';
import { GetRealmQuery } from '../queries/get-realm.query.js';
import { REALM_REPOSITORY, type RealmRepository } from '../../ports/realm-repository.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { REALM_GUARD, type RealmGuardPort } from '../../ports/realm-guard.port.js';

@QueryHandler(GetRealmQuery)
export class GetRealmHandler implements IQueryHandler<GetRealmQuery, Realm> {
  constructor(
    @Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository,
    @Inject(REALM_GUARD) private readonly realmGuard: RealmGuardPort,
  ) {}

  async execute(query: GetRealmQuery): Promise<Realm> {
    const data = await this.realmRepository.findById(query.id);
    if (!data) {
      throw new NotFoundError('Realm', query.id);
    }
    this.realmGuard.checkRead(data, query.userId, query.roles);
    return data;
  }
}
