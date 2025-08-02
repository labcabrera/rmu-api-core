import { injectable } from 'inversify';
import { SkillCategoryRepository } from '@domain/ports/SkillCategoryRepository';
import { SkillCategory } from '@domain/entities/SkillCategory';
import { SKILL_CATEGORIES } from '@shared/constants/skill-categories';

@injectable()
export class InMemorySkillCategoryRepository implements SkillCategoryRepository {
  private skillCategories: SkillCategory[] = [...SKILL_CATEGORIES];

  async findById(id: string): Promise<SkillCategory | null> {
    const skillCategory = this.skillCategories.find(sc => sc.id === id);
    return skillCategory || null;
  }

  async findAll(): Promise<SkillCategory[]> {
    return [...this.skillCategories];
  }

  async findAllPaginated(page: number, size: number): Promise<{ content: SkillCategory[]; totalElements: number }> {
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = this.skillCategories.slice(startIndex, endIndex);
    
    return {
      content,
      totalElements: this.skillCategories.length
    };
  }

  async create(skillCategory: SkillCategory): Promise<SkillCategory> {
    // Check if skill category already exists
    const existingIndex = this.skillCategories.findIndex(sc => sc.id === skillCategory.id);
    if (existingIndex !== -1) {
      throw new Error(`Skill category with id ${skillCategory.id} already exists`);
    }

    this.skillCategories.push(skillCategory);
    return skillCategory;
  }

  async update(id: string, skillCategoryUpdate: Partial<SkillCategory>): Promise<SkillCategory | null> {
    const index = this.skillCategories.findIndex(sc => sc.id === id);
    if (index === -1) {
      return null;
    }

    this.skillCategories[index] = { ...this.skillCategories[index], ...skillCategoryUpdate };
    return this.skillCategories[index];
  }

  async deleteById(id: string): Promise<boolean> {
    const index = this.skillCategories.findIndex(sc => sc.id === id);
    if (index === -1) {
      return false;
    }

    this.skillCategories.splice(index, 1);
    return true;
  }
}
