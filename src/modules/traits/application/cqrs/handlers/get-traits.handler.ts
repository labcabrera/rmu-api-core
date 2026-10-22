import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTraitsQuery } from '../queries/get-traits.query.js';
import { Trait } from '../../../domain/aggregates/trait.js';
import { TRAIT_REPOSITORY, type TraitRepository } from '../../ports/trait-repository.port.js';
import { Page } from '../../../../shared/application/pagination/page.js';
import { TRAIT_GUARD, type TraitGuardPort } from '../../ports/trait-guard.port.js';

@QueryHandler(GetTraitsQuery)
export class GetTraitsHandler implements IQueryHandler<GetTraitsQuery, Page<Trait>> {
  constructor(
    @Inject(TRAIT_REPOSITORY) private readonly traitRepository: TraitRepository,
    @Inject(TRAIT_GUARD) private readonly traitGuard: TraitGuardPort,
  ) {}

  async execute(query: GetTraitsQuery): Promise<Page<Trait>> {
    const predicate = this.traitGuard.buildQueryPredicate(query.userId, query.roles);
    return await this.traitRepository.findByRsql(query.rsql, query.page, query.size, predicate);
  }
}
