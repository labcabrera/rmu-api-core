import { injectable } from 'inversify';
import { SkillCategoryRepository } from '@domain/ports/skill-category-repository';
import { SKILL_CATEGORIES, SkillCategory } from '@domain/entities/skill-category';
import { Page } from '@domain/entities/page';
import { SkillCategoryQuery } from '@domain/queries/skill-category-query';

@injectable()
export class InMemorySkillCategoryRepository implements SkillCategoryRepository {
  async findById(id: string): Promise<SkillCategory | null> {
    const skillCategory = SKILL_CATEGORIES.find(sc => sc.id === id);
    return skillCategory || null;
  }

  async find(query: SkillCategoryQuery, page: number, size: number): Promise<Page<SkillCategory>> {
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = SKILL_CATEGORIES.slice(startIndex, endIndex);
    return {
      content,
      pagination: {
        page,
        size,
        totalPages: Math.ceil(SKILL_CATEGORIES.length / size),
        totalElements: SKILL_CATEGORIES.length,
      },
    };
  }
}
