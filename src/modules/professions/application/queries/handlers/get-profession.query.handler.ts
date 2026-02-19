import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProfessionQuery } from '../get-profession.query';
import { Profession } from 'src/modules/professions/domain/entities/profession.entity';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import type { ProfessionRepository } from '../../ports/out/profession.repository';

@QueryHandler(GetProfessionQuery)
export class GetProfessionQueryHandler implements IQueryHandler<GetProfessionQuery, Profession> {
  constructor(@Inject('ProfessionRepository') private readonly professionRepository: ProfessionRepository) {}

  async execute(query: GetProfessionQuery): Promise<Profession> {
    const data = await this.professionRepository.findById(query.id);
    if (!data) {
      throw new NotFoundError('Profession', query.id);
    }
    return data;
  }
}
