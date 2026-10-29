import type { TradingTables } from '../../domain/value-objects/trading-tables.vo.js';

export const TRADING_TABLES_REPOSITORY = Symbol('TradingTablesRepository');

/** Trading tables stored in the database (collection trading-tables, one document per rulebook). */
export interface TradingTablesRepository {
  findById(id: string): Promise<TradingTables | null>;
}
