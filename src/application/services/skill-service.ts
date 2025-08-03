import { injectable, inject } from 'inversify';
import { TYPES } from '@shared/types/container';
import { SkillRepository } from '@domain/ports/skill-repository';
import { Skill } from '@domain/entities/skill';
import { NotFoundError } from '@shared/errors';
import { Page } from '@domain/entities/page';
import { SkillQuery } from '@domain/queries/skill-query';

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
  async find(query: SkillQuery, page: number, size: number): Promise<Page<Skill>> {
    return await this.skillRepository.find(query, page, size);
  }

}