import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSkillsQuery } from '../queries/get-skills.query';
import type { SkillRepository } from '../../ports/skill-repository';
import { Page } from 'src/modules/shared/domain/entities/page';
import { Skill } from 'src/modules/skills/domain/aggregates/skill';

@QueryHandler(GetSkillsQuery)
export class GetSkillsHandler implements IQueryHandler<GetSkillsQuery, Page<Skill>> {
  constructor(@Inject('SkillRepository') private readonly skillRepository: SkillRepository) {}

  async execute(query: GetSkillsQuery): Promise<Page<Skill>> {
    return await this.skillRepository.findByRsql(query.rsql, query.page, query.size);
  }
}
