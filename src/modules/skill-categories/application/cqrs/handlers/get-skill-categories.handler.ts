import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Page } from '../../../../shared/application/pagination/page.js';
import { GetSkillCategoriesQuery } from '../queries/get-skill-categories.query.js';
import { SkillCategory } from '../../../domain/entities/skill-category.js';
import { SKILL_CATEGORY_REPOSITORY, type SkillCategoryRepository } from '../../ports/skill-category-repository.port.js';

@QueryHandler(GetSkillCategoriesQuery)
export class GetSkillCategoriesHandler implements IQueryHandler<GetSkillCategoriesQuery, Page<SkillCategory>> {
  constructor(@Inject(SKILL_CATEGORY_REPOSITORY) private readonly skillCategoryRepository: SkillCategoryRepository) {}

  async execute(query: GetSkillCategoriesQuery): Promise<Page<SkillCategory>> {
    return await this.skillCategoryRepository.findByRsql(query.rsql, query.page, query.size);
  }
}
