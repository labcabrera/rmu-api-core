import type { FightingStyleCatalog } from '../../domain/value-objects/fighting-styles.vo.js';

export const FIGHTING_STYLES_REPOSITORY = Symbol('FightingStylesRepository');

/** Fighting style catalogs stored in the database (collection fighting-styles, one document per rulebook). */
export interface FightingStylesRepository {
  findById(id: string): Promise<FightingStyleCatalog | null>;
}
