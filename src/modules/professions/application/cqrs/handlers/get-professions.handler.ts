import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProfessionsQuery } from '../queries/get-professions.query.js';
import { Profession } from '../../../domain/aggregates/profession.js';
import { PROFESSION_REPOSITORY, type ProfessionRepository } from '../../ports/profession-repository.port.js';
import { Page } from '../../../../shared/application/pagination/page.js';

@QueryHandler(GetProfessionsQuery)
export class GetProfessionsHandler implements IQueryHandler<GetProfessionsQuery, Page<Profession>> {
  constructor(@Inject(PROFESSION_REPOSITORY) private readonly professionRepository: ProfessionRepository) {}

  async execute(query: GetProfessionsQuery): Promise<Page<Profession>> {
    const sort = { _id: 'asc' } as const;
    return await this.professionRepository.findByRsql(query.rsql, query.page, query.size, undefined, sort);
  }
}
