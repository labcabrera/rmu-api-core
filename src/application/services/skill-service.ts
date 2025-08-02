import { injectable, inject } from 'inversify';
import { TYPES } from '@shared/types/container';
import { SkillRepository } from '@domain/ports/SkillRepository';
import { Skill, SkillCreateRequest, SkillUpdateRequest, PaginatedSkillsResponse } from '@domain/entities/Skill';
import { NotFoundError, ConflictError } from '@shared/errors';

@injectable()
export class SkillService {
  constructor(
    @inject(TYPES.SkillRepository) private skillRepository: SkillRepository
  ) {}

  async findById(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findById(id);
    if (!skill) {
      throw new NotFoundError(`Skill with id ${id} not found`);
    }
    return skill;
  }

  async findAll(): Promise<Skill[]> {
    return await this.skillRepository.findAll();
  }

  async findAllPaginated(page: number = 0, size: number = 10): Promise<PaginatedSkillsResponse> {
    const result = await this.skillRepository.findAllPaginated(page, size);
    return {
      content: result.content,
      pagination: {
        page,
        size,
        totalElements: result.totalElements
      }
    };
  }

  async create(request: SkillCreateRequest): Promise<Skill> {
    // Check if skill with same id already exists
    const existingSkill = await this.skillRepository.findById(request.id);
    if (existingSkill) {
      throw new ConflictError(`Skill with id ${request.id} already exists`);
    }

    const skill: Skill = {
      id: request.id,
      categoryId: request.categoryId,
      bonus: request.bonus,
      specializations: request.specializations
    };

    return await this.skillRepository.create(skill);
  }

  async update(id: string, request: SkillUpdateRequest): Promise<Skill> {
    const existingSkill = await this.skillRepository.findById(id);
    if (!existingSkill) {
      throw new NotFoundError(`Skill with id ${id} not found`);
    }

    const updatedSkill = await this.skillRepository.update(id, request);
    if (!updatedSkill) {
      throw new NotFoundError(`Skill with id ${id} not found`);
    }

    return updatedSkill;
  }

  async deleteById(id: string): Promise<void> {
    const skill = await this.skillRepository.findById(id);
    if (!skill) {
      throw new NotFoundError(`Skill with id ${id} not found`);
    }

    const deleted = await this.skillRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundError(`Skill with id ${id} not found`);
    }
  }
}
