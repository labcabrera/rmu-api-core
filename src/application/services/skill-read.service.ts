import { injectable, inject } from 'inversify';
import { SkillRepository } from '@application/ports/outbound/skill-repository';
import { Skill } from '@domain/entities/skill';
import { NotFoundError } from '@domain/errors/errors';
import { Page } from '@domain/entities/page';

@injectable()
export class SkillReadService {
  constructor(@inject('SkillRepository') private skillRepository: SkillRepository) {}

  async findById(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findById(id);
    if (!skill) {
      throw new NotFoundError('Skill', id);
    }
    return skill;
  }
  async find(categoryId: string | undefined, page: number, size: number): Promise<Page<Skill>> {
    return await this.skillRepository.find(categoryId, page, size);
  }
}
