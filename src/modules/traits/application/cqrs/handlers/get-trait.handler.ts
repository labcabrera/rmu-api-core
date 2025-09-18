import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { NotFoundError } from 'src/modules/core/domain/errors/errors';
import { GetTraitQuery } from '../queries/get-trait.query';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';
import type { TraitRepository } from '../../ports/trait.repository';

@QueryHandler(GetTraitQuery)
export class GetTraitHandler implements IQueryHandler<GetTraitQuery, Trait> {
  constructor(@Inject('TraitRepository') private readonly traitRepository: TraitRepository) {}

  async execute(query: GetTraitQuery): Promise<Trait> {
    const data = await this.traitRepository.findById(query.id);
    if (!data) {
      throw new NotFoundError('Trait', query.id);
    }
    return data;
  }
}
