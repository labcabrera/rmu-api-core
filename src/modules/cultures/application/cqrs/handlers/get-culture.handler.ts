import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetCultureQuery } from '../queries/get-culture.query.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { CULTURE_GUARD, type CultureGuardPort } from '../../ports/culture-guard.port.js';
import { CULTURE_REPOSITORY, type CultureRepository } from '../../ports/culture-repository.port.js';
import { CultureViewService } from '../../services/culture-view.service.js';
import type { CultureView } from '../../read-models/culture-view.js';

@QueryHandler(GetCultureQuery)
export class GetCultureHandler implements IQueryHandler<GetCultureQuery, CultureView> {
  constructor(
    @Inject(CULTURE_REPOSITORY) private readonly cultureRepository: CultureRepository,
    @Inject(CULTURE_GUARD) private readonly cultureGuard: CultureGuardPort,
    private readonly cultureViewService: CultureViewService,
  ) {}

  async execute(query: GetCultureQuery): Promise<CultureView> {
    const current = await this.cultureRepository.findById(query.id);
    if (!current) throw new NotFoundError('Culture', query.id);
    this.cultureGuard.checkRead(current, query.userId, query.roles);
    return this.cultureViewService.toView(current);
  }
}
