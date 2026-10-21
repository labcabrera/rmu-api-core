import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetCultureQuery } from '../queries/get-culture.query';
import { NotFoundError } from '../../../../shared/domain/errors/errors';
import type { CultureGuardPort } from '../../ports/culture-guard.port';
import type { CultureRepository } from '../../ports/culture-repository';
import { CultureViewService } from '../../services/culture-view.service';
import { CultureView } from '../../read-models/culture-view';

@QueryHandler(GetCultureQuery)
export class GetCultureHandler implements IQueryHandler<GetCultureQuery, CultureView> {
  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
    private readonly cultureViewService: CultureViewService,
  ) {}

  async execute(query: GetCultureQuery): Promise<CultureView> {
    const current = await this.cultureRepository.findById(query.id);
    if (!current) throw new NotFoundError('Culture', query.id);
    this.cultureGuard.checkRead(current, query.userId, query.roles);
    return this.cultureViewService.toView(current);
  }
}
