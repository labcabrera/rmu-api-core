import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Page } from '../../../../shared/domain/entities/page.js';
import { EffectType } from '../../../domain/aggregates/effect-type.js';
import { GetEffectTypesQuery } from '../queries/get-effect-types.query.js';
import type { EffectTypeRepository } from '../../ports/effect-type-repository.js';
import type { EffectTypeGuardPort } from '../../ports/effect-type-guard.port.js';

@QueryHandler(GetEffectTypesQuery)
export class GetEffectTypesHandler implements IQueryHandler<GetEffectTypesQuery, Page<EffectType>> {
  constructor(
    @Inject('EffectTypeRepository') private readonly effectTypeRepository: EffectTypeRepository,
    @Inject('EffectTypeGuardPort') private readonly guard: EffectTypeGuardPort,
  ) {}

  async execute(query: GetEffectTypesQuery): Promise<Page<EffectType>> {
    const filter = this.guard.buildQueryPredicate(query.userId, query.roles);
    const sort = { id: 'asc' } as const;
    return await this.effectTypeRepository.findByRsql(query.rsql, query.page, query.size, filter, sort);
  }
}
