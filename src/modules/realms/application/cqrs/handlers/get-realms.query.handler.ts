import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Realm } from 'src/modules/realms/domain/aggregates/realm';
import { GetRealmsQuery } from '../queries/get-realms.query';
import { Page } from 'src/modules/core/domain/entities/page';
import type { RealmRepository } from '../../ports/out/realm-repository';

@QueryHandler(GetRealmsQuery)
export class GetRealmsQueryHandler implements IQueryHandler<GetRealmsQuery, Page<Realm>> {
  constructor(@Inject('RealmRepository') private readonly realmRepository: RealmRepository) {}

  async execute(query: GetRealmsQuery): Promise<Page<Realm>> {
    return await this.realmRepository.findByRsql(query.rsql, query.page, query.size);
  }
}
