import { injectable, inject } from 'inversify';
import { TYPES } from '@shared/types/container';
import { SkillRepository } from '@domain/ports/SkillRepository';
import { Skill, PaginatedSkillsResponse } from '@domain/entities/Skill';
import { NotFoundError } from '@shared/errors';

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
}
