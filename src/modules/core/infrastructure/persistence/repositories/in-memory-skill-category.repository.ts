import { Injectable } from '@nestjs/common';
import { SkillCategoryRepository } from 'src/modules/core/application/ports/outbound/skill-category-repository';
import { Page } from 'src/modules/core/domain/entities/page';
import { SkillCategory, SKILL_CATEGORIES } from 'src/modules/core/domain/entities/skill-category';

@Injectable()
export class InMemorySkillCategoryRepository implements SkillCategoryRepository {
  findById(id: string): SkillCategory | null {
    const skillCategory = SKILL_CATEGORIES.find((sc) => sc.id === id);
    return skillCategory || null;
  }

  findAll(): Page<SkillCategory> {
    return new Page<SkillCategory>(SKILL_CATEGORIES, 0, SKILL_CATEGORIES.length, SKILL_CATEGORIES.length);
  }
}
