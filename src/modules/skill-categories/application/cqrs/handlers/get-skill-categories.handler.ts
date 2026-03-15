import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Page } from 'src/modules/shared/domain/entities/page';
import { GetSkillCategoriesQuery } from '../queries/get-skill-categories.query';
import { SkillCategory } from 'src/modules/skill-categories/dommain/entities/skill-category';
import type { SkillCategoryRepository } from '../../../../realms/application/ports/skill-category-repository';

@QueryHandler(GetSkillCategoriesQuery)
export class GetSkillCategoriesHandler implements IQueryHandler<GetSkillCategoriesQuery, Page<SkillCategory>> {
  constructor(@Inject('SkillCategoryRepository') private readonly skillCategoryRepository: SkillCategoryRepository) {}

  async execute(query: GetSkillCategoriesQuery): Promise<Page<SkillCategory>> {
    return await this.skillCategoryRepository.findByRsql(query.rsql, query.page, query.size);
  }
}
