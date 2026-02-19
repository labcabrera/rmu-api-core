import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Realm } from 'src/modules/realms/domain/aggregates/realm';
import { GetRealmsQuery } from '../queries/get-realms.query';
import type { RealmRepository } from '../../ports/realm-repository';
import { Page } from 'src/modules/shared/domain/entities/page';

@QueryHandler(GetRealmsQuery)
export class GetRealmsHandler implements IQueryHandler<GetRealmsQuery, Page<Realm>> {
  constructor(@Inject('RealmRepository') private readonly realmRepository: RealmRepository) {}

  async execute(query: GetRealmsQuery): Promise<Page<Realm>> {
    return await this.realmRepository.findByRsql(query.rsql, query.page, query.size);
  }
}
