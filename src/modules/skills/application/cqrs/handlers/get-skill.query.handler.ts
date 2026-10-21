import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSkillQuery } from '../queries/get-skill.query';
import type { SkillRepository } from '../../ports/skill-repository';
import { SkillView } from '../../read-models/skill-view';
import { SkillViewService } from '../../services/skill-view.service';
import type { SkillGuardPort } from '../../ports/skill-guard';
import { NotFoundError } from '../../../../shared/domain/errors/errors';

@QueryHandler(GetSkillQuery)
export class GetSkillHandler implements IQueryHandler<GetSkillQuery, SkillView> {
  constructor(
    @Inject('SkillRepository') private readonly skillRepository: SkillRepository,
    @Inject('SkillGuardPort') private readonly skillGuard: SkillGuardPort,
    private readonly skillViewService: SkillViewService,
  ) {}

  async execute(query: GetSkillQuery): Promise<SkillView> {
    const skill = await this.skillRepository.findById(query.id);
    if (!skill) throw new NotFoundError('Skill', query.id);
    this.skillGuard.checkRead(skill, query.userId, query.roles);
    return await this.skillViewService.toView(skill);
  }
}
