import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProfessionQuery } from '../queries/get-profession.query.js';
import { Profession } from '../../../domain/aggregates/profession.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { PROFESSION_REPOSITORY, type ProfessionRepository } from '../../ports/profession-repository.port.js';
import { PROFESSION_GUARD, type ProfessionGuardPort } from '../../ports/profession-guard.port.js';

@QueryHandler(GetProfessionQuery)
export class GetProfessionHandler implements IQueryHandler<GetProfessionQuery, Profession> {
  constructor(
    @Inject(PROFESSION_REPOSITORY) private readonly professionRepository: ProfessionRepository,
    @Inject(PROFESSION_GUARD) private readonly professionGuard: ProfessionGuardPort,
  ) {}

  async execute(query: GetProfessionQuery): Promise<Profession> {
    const data = await this.professionRepository.findById(query.id);
    if (!data) throw new NotFoundError('Profession', query.id);

    this.professionGuard.checkRead(data, query.userId, query.roles);
    return data;
  }
}
