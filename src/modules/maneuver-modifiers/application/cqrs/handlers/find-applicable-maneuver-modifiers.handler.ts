import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { SKILL_REPOSITORY, type SkillRepository } from '../../../../skills/application/ports/skill-repository.port.js';
import { ManeuverModifier } from '../../../domain/aggregates/maneuver-modifier.js';
import { MANEUVER_MODIFIER_GUARD, type ManeuverModifierGuardPort } from '../../ports/maneuver-modifier-guard.port.js';
import { MANEUVER_MODIFIER_REPOSITORY, type ManeuverModifierRepository } from '../../ports/maneuver-modifier-repository.port.js';
import { FindApplicableManeuverModifiersQuery } from '../queries/find-applicable-maneuver-modifiers.query.js';

@QueryHandler(FindApplicableManeuverModifiersQuery)
export class FindApplicableManeuverModifiersHandler implements IQueryHandler<FindApplicableManeuverModifiersQuery, ManeuverModifier[]> {
  constructor(
    @Inject(MANEUVER_MODIFIER_REPOSITORY) private readonly repository: ManeuverModifierRepository,
    @Inject(MANEUVER_MODIFIER_GUARD) private readonly guard: ManeuverModifierGuardPort,
    @Inject(SKILL_REPOSITORY) private readonly skillRepository: SkillRepository,
  ) {}

  async execute(query: FindApplicableManeuverModifiersQuery): Promise<ManeuverModifier[]> {
    let categoryId = query.categoryId;
    if (query.skillId && !categoryId) {
      const skill = await this.skillRepository.findById(query.skillId);
      if (!skill) throw new NotFoundError('Skill', query.skillId);
      categoryId = skill.categoryId;
    }
    const filter = this.guard.buildQueryPredicate(query.userId, query.roles);
    return await this.repository.findApplicable(query.skillId, categoryId, filter);
  }
}
