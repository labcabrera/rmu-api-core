import { injectable } from 'inversify';
import { SkillCategoryRepository } from '@domain/ports/outbound/skill-category-repository';
import { SKILL_CATEGORIES, SkillCategory } from '@domain/entities/skill-category';
import { Page } from '@domain/entities/page';

@injectable()
export class InMemorySkillCategoryRepository implements SkillCategoryRepository {
  async findById(id: string): Promise<SkillCategory | null> {
    const skillCategory = SKILL_CATEGORIES.find(sc => sc.id === id);
    return skillCategory || null;
  }

  async findAll(): Promise<Page<SkillCategory>> {
    const content = SKILL_CATEGORIES;
    return {
      content,
      pagination: {
        page: 0,
        size: content.length,
        totalPages: 1,
        totalElements: content.length,
      },
    };
  }
}
