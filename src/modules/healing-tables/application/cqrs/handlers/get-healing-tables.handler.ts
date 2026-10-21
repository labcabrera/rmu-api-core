import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { checkCoreLawAccess } from '../../../domain/services/healing-tables-access.js';
import type { HealingTables } from '../../../domain/value-objects/healing-tables.vo.js';
import type { HealingTablesRepository } from '../../ports/healing-tables-repository.js';
import { GetHealingTablesQuery } from '../queries/get-healing-tables.query.js';

@QueryHandler(GetHealingTablesQuery)
export class GetHealingTablesHandler implements IQueryHandler<GetHealingTablesQuery, HealingTables> {
  constructor(@Inject('HealingTablesRepository') private readonly repository: HealingTablesRepository) {}

  async execute(query: GetHealingTablesQuery): Promise<HealingTables> {
    checkCoreLawAccess(query.roles);
    const tables = await this.repository.findById(query.id);
    if (!tables) throw new NotFoundError('Healing tables', query.id);
    return tables;
  }
}
