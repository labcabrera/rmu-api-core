import { injectable, inject } from 'inversify';
import { TYPES } from '@shared/types/container';
import { SkillCategoryRepository } from '@domain/ports/SkillCategoryRepository';
import { SkillCategory, SkillCategoryCreateRequest, SkillCategoryUpdateRequest, PaginatedSkillCategoriesResponse } from '@domain/entities/SkillCategory';
import { NotFoundError, ConflictError } from '@shared/errors';

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

  async create(request: SkillCategoryCreateRequest): Promise<SkillCategory> {
    // Check if skill category with same id already exists
    const existingSkillCategory = await this.skillCategoryRepository.findById(request.id);
    if (existingSkillCategory) {
      throw new ConflictError(`Skill category with id ${request.id} already exists`);
    }

    const skillCategory: SkillCategory = {
      id: request.id,
      bonus: request.bonus
    };

    return await this.skillCategoryRepository.create(skillCategory);
  }

  async update(id: string, request: SkillCategoryUpdateRequest): Promise<SkillCategory> {
    const existingSkillCategory = await this.skillCategoryRepository.findById(id);
    if (!existingSkillCategory) {
      throw new NotFoundError(`Skill category with id ${id} not found`);
    }

    const updatedSkillCategory = await this.skillCategoryRepository.update(id, request);
    if (!updatedSkillCategory) {
      throw new NotFoundError(`Skill category with id ${id} not found`);
    }

    return updatedSkillCategory;
  }

  async deleteById(id: string): Promise<void> {
    const skillCategory = await this.skillCategoryRepository.findById(id);
    if (!skillCategory) {
      throw new NotFoundError(`Skill category with id ${id} not found`);
    }

    const deleted = await this.skillCategoryRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundError(`Skill category with id ${id} not found`);
    }
  }
}
