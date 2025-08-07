import { Page } from 'src/modules/core/domain/entities/page';
import { SkillCategory } from 'src/modules/core/domain/entities/skill-category';

export interface SkillCategoryRepository {
  findById(id: string): SkillCategory | null;

  findAll(): Page<SkillCategory>;
}
