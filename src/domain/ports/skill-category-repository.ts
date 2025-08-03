import { Page } from '@domain/entities/page';
import { SkillCategory } from '@domain/entities/skill-category';
import { SkillCategoryQuery } from '@domain/queries/skill-category-query';

export interface SkillCategoryRepository {

  findById(id: string): Promise<SkillCategory | null>;

  find(query: SkillCategoryQuery, page: number, size: number): Promise<Page<SkillCategory>>;

}
