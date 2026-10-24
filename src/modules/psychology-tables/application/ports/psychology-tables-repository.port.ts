import type { PsychologyTables } from '../../domain/value-objects/psychology-tables.vo.js';

export const PSYCHOLOGY_TABLES_REPOSITORY = Symbol('PsychologyTablesRepository');

/** Psychology tables stored in the database (collection psychology-tables, one document per rulebook). */
export interface PsychologyTablesRepository {
  findById(id: string): Promise<PsychologyTables | null>;
}
