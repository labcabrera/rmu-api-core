import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Page } from '../../../../shared/application/pagination/page.js';
import { EffectType } from '../../../domain/aggregates/effect-type.js';
import { GetEffectTypesQuery } from '../queries/get-effect-types.query.js';
import { EFFECT_TYPE_REPOSITORY, type EffectTypeRepository } from '../../ports/effect-type-repository.port.js';
import { EFFECT_TYPE_GUARD, type EffectTypeGuardPort } from '../../ports/effect-type-guard.port.js';

@QueryHandler(GetEffectTypesQuery)
export class GetEffectTypesHandler implements IQueryHandler<GetEffectTypesQuery, Page<EffectType>> {
  constructor(
    @Inject(EFFECT_TYPE_REPOSITORY) private readonly effectTypeRepository: EffectTypeRepository,
    @Inject(EFFECT_TYPE_GUARD) private readonly guard: EffectTypeGuardPort,
  ) {}

  async execute(query: GetEffectTypesQuery): Promise<Page<EffectType>> {
    const filter = this.guard.buildQueryPredicate(query.userId, query.roles);
    const sort = { id: 'asc' } as const;
    return await this.effectTypeRepository.findByRsql(query.rsql, query.page, query.size, filter, sort);
  }
}
