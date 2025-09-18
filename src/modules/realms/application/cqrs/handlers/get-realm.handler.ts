import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Realm } from 'src/modules/realms/domain/aggregates/realm';
import { GetRealmQuery } from '../queries/get-realm.query';
import { NotFoundError } from 'src/modules/core/domain/errors/errors';
import type { RealmRepository } from '../../ports/out/realm-repository';

@QueryHandler(GetRealmQuery)
export class GetRealmHandler implements IQueryHandler<GetRealmQuery, Realm> {
  constructor(@Inject('RealmRepository') private readonly realmRepository: RealmRepository) {}

  async execute(query: GetRealmQuery): Promise<Realm> {
    const data = await this.realmRepository.findById(query.id);
    if (!data) {
      throw new NotFoundError('Realm', query.id);
    }
    return data;
  }
}
