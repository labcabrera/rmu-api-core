import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetProfessionsQuery } from '../get-professions.query';
import { Profession } from 'src/modules/professions/domain/entities/profession.entity';
import * as pr from '../../ports/out/profession.repository';

@QueryHandler(GetProfessionsQuery)
export class GetProfessionsQueryHandler implements IQueryHandler<GetProfessionsQuery, Profession[]> {
  constructor(@Inject('ProfessionRepository') private readonly professionRepository: pr.ProfessionRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: GetProfessionsQuery): Promise<Profession[]> {
    return await this.professionRepository.findAll();
  }
}
