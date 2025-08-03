import { injectable, inject } from 'inversify';
import { TYPES } from '@shared/types/container';
import { SkillCategoryRepository } from '@domain/ports/skill-category-repository';
import { SkillCategory } from '@domain/entities/skill-category';
import { NotFoundError } from '@shared/errors';
import { SkillCategoryQuery } from '@domain/queries/skill-category-query';
import { Page } from '@domain/entities/page';

@injectable()
export class SkillCategoryService {
  constructor(
    @inject(TYPES.SkillCategoryRepository) private skillCategoryRepository: SkillCategoryRepository
  ) {}

  async findById(id: string): Promise<SkillCategory> {
    const skillCategory = await this.skillCategoryRepository.findById(id);
    if (!skillCategory) {
      throw new NotFoundError(`Skill category with id ${id} not found`);
    }
    return skillCategory;
  }

  async find(query: SkillCategoryQuery, page: number, size: number): Promise<Page<SkillCategory>> {
    return await this.skillCategoryRepository.find(query, page, size);
  }
}
