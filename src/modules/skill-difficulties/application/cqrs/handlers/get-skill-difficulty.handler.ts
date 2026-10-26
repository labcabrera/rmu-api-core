import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { checkCoreLawAccess } from '../../../../shared/domain/services/core-law-access.js';
import { GENERAL_GUIDE_ID, type SkillDifficultyGuide } from '../../../domain/value-objects/skill-difficulty-guide.vo.js';
import { SKILL_DIFFICULTY_REPOSITORY, type SkillDifficultyRepository } from '../../ports/skill-difficulty-repository.port.js';
import { GetSkillDifficultyQuery } from '../queries/get-skill-difficulty.query.js';

/** The examples of a skill, or the general scale (marked as fallback) when the skill has none. */
@QueryHandler(GetSkillDifficultyQuery)
export class GetSkillDifficultyHandler implements IQueryHandler<GetSkillDifficultyQuery, SkillDifficultyGuide> {
  constructor(@Inject(SKILL_DIFFICULTY_REPOSITORY) private readonly repository: SkillDifficultyRepository) {}

  async execute(query: GetSkillDifficultyQuery): Promise<SkillDifficultyGuide> {
    checkCoreLawAccess(query.roles);
    const guide = await this.repository.findById(query.skillId);
    if (guide) return guide;
    const general = await this.repository.findById(GENERAL_GUIDE_ID);
    if (!general) throw new NotFoundError('Skill difficulty guide', query.skillId);
    return { ...general, fallback: query.skillId !== GENERAL_GUIDE_ID };
  }
}
