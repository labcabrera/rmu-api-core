import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTraitQuery } from '../queries/get-trait.query.js';
import { Trait } from '../../../domain/aggregates/trait.js';
import { TRAIT_REPOSITORY, type TraitRepository } from '../../ports/trait-repository.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { TRAIT_GUARD, type TraitGuardPort } from '../../ports/trait-guard.port.js';

@QueryHandler(GetTraitQuery)
export class GetTraitHandler implements IQueryHandler<GetTraitQuery, Trait> {
  constructor(
    @Inject(TRAIT_REPOSITORY) private readonly traitRepository: TraitRepository,
    @Inject(TRAIT_GUARD) private readonly traitGuard: TraitGuardPort,
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
