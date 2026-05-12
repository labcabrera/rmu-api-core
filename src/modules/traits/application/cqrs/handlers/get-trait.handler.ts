import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTraitQuery } from '../queries/get-trait.query';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';
import type { TraitRepository } from '../../ports/trait.repository';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import type { TraitGuardPort } from '../../ports/trait-guard.port';

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
