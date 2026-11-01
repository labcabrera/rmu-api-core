import type { AlchemyTables } from '../../domain/value-objects/alchemy-tables.vo.js';

export const ALCHEMY_TABLES_REPOSITORY = Symbol('AlchemyTablesRepository');

/** Alchemy tables stored in the database (collection alchemy-tables, one document `alchemy`). */
export interface AlchemyTablesRepository {
  /** The tables; null when they have not been imported */
  find(): Promise<AlchemyTables | null>;
}
