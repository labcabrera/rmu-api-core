import { Page } from '@domain/entities/page';
import { SkillCategory } from '@domain/entities/skill-category';

export interface SkillCategoryRepository {
  findById(id: string): Promise<SkillCategory | null>;

  findAll(): Promise<Page<SkillCategory>>;
}
