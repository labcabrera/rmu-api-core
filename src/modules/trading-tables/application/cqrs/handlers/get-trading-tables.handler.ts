import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { checkCoreLawAccess } from '../../../../shared/domain/services/core-law-access.js';
import type { TradingTables } from '../../../domain/value-objects/trading-tables.vo.js';
import { TRADING_TABLES_REPOSITORY, type TradingTablesRepository } from '../../ports/trading-tables-repository.port.js';
import { GetTradingTablesQuery } from '../queries/get-trading-tables.query.js';

@QueryHandler(GetTradingTablesQuery)
export class GetTradingTablesHandler implements IQueryHandler<GetTradingTablesQuery, TradingTables> {
  constructor(@Inject(TRADING_TABLES_REPOSITORY) private readonly repository: TradingTablesRepository) {}

  async execute(query: GetTradingTablesQuery): Promise<TradingTables> {
    // Rulebook content, gated like the other rulebook tables (core has no Treasure Law group yet)
    checkCoreLawAccess(query.roles);
    const tables = await this.repository.findById(query.id);
    if (!tables) throw new NotFoundError('Trading tables', query.id);
    return tables;
  }
}
