import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTraitQuery } from '../queries/get-trait.query.js';
import { Trait } from '../../../domain/aggregates/trait.js';
import type { TraitRepository } from '../../ports/trait.repository.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import type { TraitGuardPort } from '../../ports/trait-guard.port.js';

@QueryHandler(GetTraitQuery)
export class GetTraitHandler implements IQueryHandler<GetTraitQuery, Trait> {
  constructor(
    @Inject('TraitRepository') private readonly traitRepository: TraitRepository,
    @Inject('TraitGuardPort') private readonly traitGuard: TraitGuardPort,
  ) {}

  async execute(query: GetTraitQuery): Promise<Trait> {
    const data = await this.traitRepository.findById(query.id);
    if (!data) {
      throw new NotFoundError('Trait', query.id);
    }
    this.traitGuard.checkRead(data, query.userId, query.roles);
    return data;
  }
}
