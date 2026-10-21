import { BaseRepository } from 'src/modules/shared/application/ports/base-repository';
import { QueryCriteria } from 'src/modules/shared/application/criteria/query-criteria';
import { ManeuverModifier } from '../../domain/aggregates/maneuver-modifier';

export interface ManeuverModifierRepository extends BaseRepository<ManeuverModifier> {
  findByKey(key: string): Promise<ManeuverModifier | null>;

  /** Modifiers whose scope contains the skill or the category, sorted by key. */
  findApplicable(skillId: string | undefined, categoryId: string | undefined, filter?: QueryCriteria): Promise<ManeuverModifier[]>;
}
