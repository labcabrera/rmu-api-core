import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProfessionQuery } from '../queries/get-profession.query';
import { Profession } from '../../../domain/aggregates/profession';
import { NotFoundError } from '../../../../shared/domain/errors/errors';
import type { ProfessionRepository } from '../../ports/profession.repository';

@QueryHandler(GetProfessionQuery)
export class GetProfessionHandler implements IQueryHandler<GetProfessionQuery, Profession> {
  constructor(@Inject('ProfessionRepository') private readonly professionRepository: ProfessionRepository) {}

  async execute(query: GetProfessionQuery): Promise<Profession> {
    const data = await this.professionRepository.findById(query.id);
    if (!data) throw new NotFoundError('Profession', query.id);

    return data;
  }
}
