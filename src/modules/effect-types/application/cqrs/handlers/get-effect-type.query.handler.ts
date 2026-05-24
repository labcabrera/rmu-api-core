import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { EffectType } from 'src/modules/effect-types/domain/aggregates/effect-type';
import { GetEffectTypeQuery } from '../queries/get-effect-type.query';
import type { EffectTypeRepository } from '../../ports/effect-type-repository';
import type { EffectTypeGuardPort } from '../../ports/effect-type-guard.port';

@QueryHandler(GetEffectTypeQuery)
export class GetEffectTypeHandler implements IQueryHandler<GetEffectTypeQuery, EffectType> {
  constructor(
    @Inject('EffectTypeRepository') private readonly effectTypeRepository: EffectTypeRepository,
    @Inject('EffectTypeGuardPort') private readonly guard: EffectTypeGuardPort,
  ) {}

  async execute(query: GetEffectTypeQuery): Promise<EffectType> {
    const current = await this.effectTypeRepository.findById(query.id);
    if (!current) throw new NotFoundError('EffectType', query.id);
    this.guard.checkRead(current, query.userId, query.roles);
    return current;
  }
}
