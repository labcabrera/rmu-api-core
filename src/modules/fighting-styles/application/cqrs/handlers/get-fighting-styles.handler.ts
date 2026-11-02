import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { checkCoreLawAccess } from '../../../../shared/domain/services/core-law-access.js';
import type { FightingStyleCatalog } from '../../../domain/value-objects/fighting-styles.vo.js';
import { FIGHTING_STYLES_REPOSITORY, type FightingStylesRepository } from '../../ports/fighting-styles-repository.port.js';
import { GetFightingStylesQuery } from '../queries/get-fighting-styles.query.js';

@QueryHandler(GetFightingStylesQuery)
export class GetFightingStylesHandler implements IQueryHandler<GetFightingStylesQuery, FightingStyleCatalog> {
  constructor(@Inject(FIGHTING_STYLES_REPOSITORY) private readonly repository: FightingStylesRepository) {}

  async execute(query: GetFightingStylesQuery): Promise<FightingStyleCatalog> {
    checkCoreLawAccess(query.roles);
    const catalog = await this.repository.findById(query.id);
    if (!catalog) throw new NotFoundError('Fighting styles', query.id);
    return catalog;
  }
}
