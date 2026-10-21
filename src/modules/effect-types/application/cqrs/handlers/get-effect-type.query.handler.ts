import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { EffectType } from '../../../domain/aggregates/effect-type.js';
import { GetEffectTypeQuery } from '../queries/get-effect-type.query.js';
import type { EffectTypeRepository } from '../../ports/effect-type-repository.js';
import type { EffectTypeGuardPort } from '../../ports/effect-type-guard.port.js';

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
