import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Page } from '../../../../shared/domain/entities/page';
import { EffectType } from '../../../domain/aggregates/effect-type';
import { GetEffectTypesQuery } from '../queries/get-effect-types.query';
import type { EffectTypeRepository } from '../../ports/effect-type-repository';
import type { EffectTypeGuardPort } from '../../ports/effect-type-guard.port';

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
