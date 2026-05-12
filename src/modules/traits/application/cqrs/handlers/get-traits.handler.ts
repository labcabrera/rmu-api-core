import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTraitsQuery } from '../queries/get-traits.query';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';
import type { TraitRepository } from '../../ports/trait.repository';
import { Page } from 'src/modules/shared/domain/entities/page';
import type { TraitGuardPort } from '../../ports/trait-guard.port';

@QueryHandler(GetTraitsQuery)
export class GetTraitsHandler implements IQueryHandler<GetTraitsQuery, Page<Trait>> {
  constructor(
    @Inject('TraitRepository') private readonly traitRepository: TraitRepository,
    @Inject('TraitGuardPort') private readonly traitGuard: TraitGuardPort,
  ) {}

  async execute(query: GetTraitsQuery): Promise<Page<Trait>> {
    const predicate = this.traitGuard.buildQueryPredicate(query.userId, query.roles);
    return await this.traitRepository.findByRsql(query.rsql, query.page, query.size, predicate);
  }
}
