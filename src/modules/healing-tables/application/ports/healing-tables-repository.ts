import { HealingTables } from '../../domain/value-objects/healing-tables.vo';

/** Healing tables stored in the database (collection healing-tables, one document per rulebook). */
export interface HealingTablesRepository {
  findById(id: string): Promise<HealingTables | null>;
}
