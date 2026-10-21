import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors';
import { checkCoreLawAccess } from '../../../domain/services/healing-tables-access';
import { HealingTables } from '../../../domain/value-objects/healing-tables.vo';
import type { HealingTablesRepository } from '../../ports/healing-tables-repository';
import { GetHealingTablesQuery } from '../queries/get-healing-tables.query';

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
