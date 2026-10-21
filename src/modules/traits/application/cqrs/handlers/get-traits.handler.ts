import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTraitsQuery } from '../queries/get-traits.query.js';
import { Trait } from '../../../domain/aggregates/trait.js';
import type { TraitRepository } from '../../ports/trait.repository.js';
import { Page } from '../../../../shared/domain/entities/page.js';
import type { TraitGuardPort } from '../../ports/trait-guard.port.js';

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
