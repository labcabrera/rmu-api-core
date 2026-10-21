import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProfessionsQuery } from '../queries/get-professions.query.js';
import { Profession } from '../../../domain/aggregates/profession.js';
import type { ProfessionRepository } from '../../ports/profession.repository.js';
import { Page } from '../../../../shared/domain/entities/page.js';

@QueryHandler(GetProfessionsQuery)
export class GetProfessionsHandler implements IQueryHandler<GetProfessionsQuery, Page<Profession>> {
  constructor(@Inject('ProfessionRepository') private readonly professionRepository: ProfessionRepository) {}

  async execute(query: GetProfessionsQuery): Promise<Page<Profession>> {
    const sort = { _id: 'asc' } as const;
    return await this.professionRepository.findByRsql(query.rsql, query.page, query.size, undefined, sort);
  }
}
