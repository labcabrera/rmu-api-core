import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Page } from 'src/modules/core/domain/entities/page';
import { GetTraitsQuery } from '../queries/get-traits.query';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';
import type { TraitRepository } from '../../ports/trait.repository';

@QueryHandler(GetTraitsQuery)
export class GetTraitsHandler implements IQueryHandler<GetTraitsQuery, Page<Trait>> {
  constructor(@Inject('TraitRepository') private readonly traitRepository: TraitRepository) {}

  async execute(query: GetTraitsQuery): Promise<Page<Trait>> {
    return await this.traitRepository.findByRsql(query.rsql, query.page, query.size);
  }
}
