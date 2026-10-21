import type { BaseRepository } from '../../../shared/application/ports/base-repository.js';
import { QueryCriteria } from '../../../shared/application/criteria/query-criteria.js';
import { ManeuverModifier } from '../../domain/aggregates/maneuver-modifier.js';

export interface ManeuverModifierRepository extends BaseRepository<ManeuverModifier> {
  findByKey(key: string): Promise<ManeuverModifier | null>;

  /** Modifiers whose scope contains the skill or the category, sorted by key. */
  findApplicable(skillId: string | undefined, categoryId: string | undefined, filter?: QueryCriteria): Promise<ManeuverModifier[]>;
}
