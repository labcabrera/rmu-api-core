import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Page } from '../../../../shared/domain/entities/page.js';
import { GetSkillCategoriesQuery } from '../queries/get-skill-categories.query.js';
import { SkillCategory } from '../../../domain/entities/skill-category.js';
import type { SkillCategoryRepository } from '../../../../realms/application/ports/skill-category-repository.js';

@QueryHandler(GetSkillCategoriesQuery)
export class GetSkillCategoriesHandler implements IQueryHandler<GetSkillCategoriesQuery, Page<SkillCategory>> {
  constructor(@Inject('SkillCategoryRepository') private readonly skillCategoryRepository: SkillCategoryRepository) {}

  async execute(query: GetSkillCategoriesQuery): Promise<Page<SkillCategory>> {
    return await this.skillCategoryRepository.findByRsql(query.rsql, query.page, query.size);
  }
}
