import type { HealingTables } from '../../domain/value-objects/healing-tables.vo.js';

/** Healing tables stored in the database (collection healing-tables, one document per rulebook). */
export interface HealingTablesRepository {
  findById(id: string): Promise<HealingTables | null>;
}
