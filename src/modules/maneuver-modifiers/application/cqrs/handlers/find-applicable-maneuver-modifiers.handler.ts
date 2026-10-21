import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors';
import type { SkillRepository } from '../../../../skills/application/ports/skill-repository';
import { ManeuverModifier } from '../../../domain/aggregates/maneuver-modifier';
import type { ManeuverModifierGuardPort } from '../../ports/maneuver-modifier-guard.port';
import type { ManeuverModifierRepository } from '../../ports/maneuver-modifier-repository';
import { FindApplicableManeuverModifiersQuery } from '../queries/find-applicable-maneuver-modifiers.query';

@QueryHandler(FindApplicableManeuverModifiersQuery)
export class FindApplicableManeuverModifiersHandler implements IQueryHandler<FindApplicableManeuverModifiersQuery, ManeuverModifier[]> {
  constructor(
    @Inject('ManeuverModifierRepository') private readonly repository: ManeuverModifierRepository,
    @Inject('ManeuverModifierGuardPort') private readonly guard: ManeuverModifierGuardPort,
    @Inject('SkillRepository') private readonly skillRepository: SkillRepository,
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
