import { Page } from 'src/modules/shared/domain/entities/page';
import { SkillCategory } from 'src/modules/skills/domain/aggregates/skill-category';

export interface SkillCategoryRepository {
  findById(id: string): Promise<SkillCategory | null>;

  findByRsql(rsql: string | undefined, page: number, size: number): Promise<Page<SkillCategory>>;
}
