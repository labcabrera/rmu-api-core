import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { checkCoreLawAccess } from '../../../../shared/domain/services/core-law-access.js';
import type { SkillDifficultyGuide } from '../../../domain/value-objects/skill-difficulty-guide.vo.js';
import { SKILL_DIFFICULTY_REPOSITORY, type SkillDifficultyRepository } from '../../ports/skill-difficulty-repository.port.js';
import { GetSkillDifficultiesQuery } from '../queries/get-skill-difficulties.query.js';

@QueryHandler(GetSkillDifficultiesQuery)
export class GetSkillDifficultiesHandler implements IQueryHandler<GetSkillDifficultiesQuery, SkillDifficultyGuide[]> {
  constructor(@Inject(SKILL_DIFFICULTY_REPOSITORY) private readonly repository: SkillDifficultyRepository) {}

  async execute(query: GetSkillDifficultiesQuery): Promise<SkillDifficultyGuide[]> {
    checkCoreLawAccess(query.roles);
    return this.repository.findAll();
  }
}
