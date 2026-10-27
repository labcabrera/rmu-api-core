import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { checkCoreLawAccess } from '../../../../shared/domain/services/core-law-access.js';
import type { PoisonTables } from '../../../domain/value-objects/poison-tables.vo.js';
import { POISON_TABLES_REPOSITORY, type PoisonTablesRepository } from '../../ports/poison-tables-repository.port.js';
import { GetPoisonTablesQuery } from '../queries/get-poison-tables.query.js';

@QueryHandler(GetPoisonTablesQuery)
export class GetPoisonTablesHandler implements IQueryHandler<GetPoisonTablesQuery, PoisonTables> {
  constructor(@Inject(POISON_TABLES_REPOSITORY) private readonly repository: PoisonTablesRepository) {}

  async execute(query: GetPoisonTablesQuery): Promise<PoisonTables> {
    checkCoreLawAccess(query.roles);
    const tables = await this.repository.findById(query.id);
    if (!tables) throw new NotFoundError('Poison tables', query.id);
    return tables;
  }
}
