import { SkillCategory } from 'src/modules/skills/domain/aggregates/skill-category';

export interface SkillCategoryRepository {
  findById(id: string): SkillCategory | null;

  find(): SkillCategory[];
}
