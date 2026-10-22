import { Page } from '../../../shared/application/pagination/page.js';
import { SkillCategory } from '../../domain/entities/skill-category.js';

export const SKILL_CATEGORY_REPOSITORY = Symbol('SkillCategoryRepository');

export interface SkillCategoryRepository {
  findById(id: string): Promise<SkillCategory | null>;

  findByIds(ids: string[]): Promise<SkillCategory[]>;

  findByRsql(rsql: string | undefined, page: number, size: number): Promise<Page<SkillCategory>>;

  save(entity: SkillCategory): Promise<SkillCategory>;
}
