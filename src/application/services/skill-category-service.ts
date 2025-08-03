import { injectable, inject } from 'inversify';
import { TYPES } from '@shared/types/container';
import { SkillCategoryRepository } from '@domain/ports/skill-category-repository';
import { SkillCategory, PaginatedSkillCategoriesResponse } from '@domain/entities/SkillCategory';
import { NotFoundError } from '@shared/errors';

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

  async findAll(): Promise<SkillCategory[]> {
    return await this.skillCategoryRepository.findAll();
  }

  async findAllPaginated(page: number = 0, size: number = 10): Promise<PaginatedSkillCategoriesResponse> {
    const result = await this.skillCategoryRepository.findAllPaginated(page, size);
    return {
      content: result.content,
      pagination: {
        page,
        size,
        totalElements: result.totalElements
      }
    };
  }
}
