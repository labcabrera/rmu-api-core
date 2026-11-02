import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSkillQuery } from '../queries/get-skill.query.js';
import { SKILL_REPOSITORY, type SkillRepository } from '../../ports/skill-repository.port.js';
import type { SkillView } from '../../read-models/skill-view.js';
import { SkillViewService } from '../../services/skill-view.service.js';
import { SKILL_GUARD, type SkillGuardPort } from '../../ports/skill-guard.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';

@QueryHandler(GetSkillQuery)
export class GetSkillHandler implements IQueryHandler<GetSkillQuery, SkillView> {
  constructor(
    @Inject(SKILL_REPOSITORY) private readonly skillRepository: SkillRepository,
    @Inject(SKILL_GUARD) private readonly skillGuard: SkillGuardPort,
    private readonly skillViewService: SkillViewService,
  ) {}

  async execute(query: GetSkillQuery): Promise<SkillView> {
    const skill = await this.skillRepository.findById(query.id);
    if (!skill) throw new NotFoundError('Skill', query.id);
    this.skillGuard.checkRead(skill, query.userId, query.roles);
    return await this.skillViewService.toView(skill);
  }
}
