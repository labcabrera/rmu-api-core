import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Realm } from '../../../domain/aggregates/realm.js';
import { GetRealmQuery } from '../queries/get-realm.query.js';
import { REALM_REPOSITORY, type RealmRepository } from '../../ports/realm-repository.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';

@QueryHandler(GetRealmQuery)
export class GetRealmHandler implements IQueryHandler<GetRealmQuery, Realm> {
  constructor(@Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository) {}

  async execute(query: GetRealmQuery): Promise<Realm> {
    const data = await this.realmRepository.findById(query.id);
    if (!data) {
      throw new NotFoundError('Realm', query.id);
    }
    return data;
  }
}
