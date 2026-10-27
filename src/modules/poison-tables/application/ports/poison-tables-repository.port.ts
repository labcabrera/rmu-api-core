import type { PoisonTables } from '../../domain/value-objects/poison-tables.vo.js';

export const POISON_TABLES_REPOSITORY = Symbol('PoisonTablesRepository');

/** Poison tables stored in the database (collection poison-tables, one document per rulebook). */
export interface PoisonTablesRepository {
  findById(id: string): Promise<PoisonTables | null>;
}
