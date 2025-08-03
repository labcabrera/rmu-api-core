import { injectable } from 'inversify';
import { SkillCategoryRepository } from '@domain/ports/skill-category-repository';
import { SkillCategory } from '@domain/entities/skill-category';
import { SKILL_CATEGORIES } from '@shared/constants/skill-categories';
import { Page } from '@domain/entities/page';
import { SkillCategoryQuery } from '@domain/queries/skill-category-query';

@injectable()
export class InMemorySkillCategoryRepository implements SkillCategoryRepository {
  private skillCategories: SkillCategory[] = [...SKILL_CATEGORIES];

  async findById(id: string): Promise<SkillCategory | null> {
    const skillCategory = this.skillCategories.find(sc => sc.id === id);
    return skillCategory || null;
  }

  async find(query: SkillCategoryQuery, page: number, size: number): Promise<Page<SkillCategory>> {
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = this.skillCategories.slice(startIndex, endIndex);
    return {
      content,
      pagination: {
        page,
        size,
        totalPages: Math.ceil(this.skillCategories.length / size),
        totalElements: this.skillCategories.length
      }
    };
  }

}
