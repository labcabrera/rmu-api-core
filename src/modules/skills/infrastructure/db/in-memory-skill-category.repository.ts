import { Injectable } from '@nestjs/common';
import { SkillCategoryRepository } from 'src/modules/skills/application/ports/skill-category-repository';
import { SKILL_CATEGORIES, SkillCategory } from 'src/modules/skills/domain/aggregates/skill-category';

@Injectable()
export class InMemorySkillCategoryRepository implements SkillCategoryRepository {
  findById(id: string): SkillCategory | null {
    const skillCategory = SKILL_CATEGORIES.find((sc) => sc.id === id);
    return skillCategory || null;
  }

  find(): SkillCategory[] {
    return SKILL_CATEGORIES;
  }
}
