import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetCultureQuery } from '../queries/get-culture.query';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { Culture } from 'src/modules/cultures/domain/aggregates/culture';
import type { CultureGuardPort } from '../../ports/culture-guard.port';
import type { CultureRepository } from '../../ports/culture-repository';

@QueryHandler(GetCultureQuery)
export class GetCultureHandler implements IQueryHandler<GetCultureQuery, Culture> {
  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
  ) {}

  async execute(query: GetCultureQuery): Promise<Culture> {
    const current = await this.cultureRepository.findById(query.id);
    if (!current) throw new NotFoundError('Culture', query.id);
    this.cultureGuard.checkRead(current, query.userId, query.roles);
    return current;
  }
}
