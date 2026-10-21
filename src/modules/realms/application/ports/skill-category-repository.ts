import { Page } from '../../../shared/domain/entities/page.js';
import { SkillCategory } from '../../../skill-categories/domain/entities/skill-category.js';

export interface SkillCategoryRepository {
  findById(id: string): Promise<SkillCategory | null>;

  findByIds(ids: string[]): Promise<SkillCategory[]>;

  findByRsql(rsql: string | undefined, page: number, size: number): Promise<Page<SkillCategory>>;

  save(entity: SkillCategory): Promise<SkillCategory>;
}
