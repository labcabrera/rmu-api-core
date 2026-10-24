import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { checkCoreLawAccess } from '../../../../shared/domain/services/core-law-access.js';
import type { PsychologyTables } from '../../../domain/value-objects/psychology-tables.vo.js';
import { PSYCHOLOGY_TABLES_REPOSITORY, type PsychologyTablesRepository } from '../../ports/psychology-tables-repository.port.js';
import { GetPsychologyTablesQuery } from '../queries/get-psychology-tables.query.js';

@QueryHandler(GetPsychologyTablesQuery)
export class GetPsychologyTablesHandler implements IQueryHandler<GetPsychologyTablesQuery, PsychologyTables> {
  constructor(@Inject(PSYCHOLOGY_TABLES_REPOSITORY) private readonly repository: PsychologyTablesRepository) {}

  async execute(query: GetPsychologyTablesQuery): Promise<PsychologyTables> {
    checkCoreLawAccess(query.roles);
    const tables = await this.repository.findById(query.id);
    if (!tables) throw new NotFoundError('Psychology tables', query.id);
    return tables;
  }
}
