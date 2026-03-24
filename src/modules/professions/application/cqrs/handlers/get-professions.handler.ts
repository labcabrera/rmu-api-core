import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProfessionsQuery } from '../../cqrs/queries/get-professions.query';
import { Profession } from 'src/modules/professions/domain/aggregates/profession';
import type { ProfessionRepository } from '../../ports/profession.repository';
import { Page } from 'src/modules/shared/domain/entities/page';

@QueryHandler(GetProfessionsQuery)
export class GetProfessionsHandler implements IQueryHandler<GetProfessionsQuery, Page<Profession>> {
  constructor(@Inject('ProfessionRepository') private readonly professionRepository: ProfessionRepository) {}

  async execute(query: GetProfessionsQuery): Promise<Page<Profession>> {
    const sort = { _id: 1 };
    return await this.professionRepository.findByRsql(query.rsql, query.page, query.size, undefined, sort);
  }
}
