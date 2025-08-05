import { injectable, inject } from 'inversify';
import { SkillCategoryRepository } from '@application/ports/outbound/skill-category-repository';
import { SkillCategory } from '@domain/entities/skill-category';
import { NotFoundError } from '@domain/errors/errors';
import { Page } from '@domain/entities/page';

@injectable()
export class SkillCategoryService {
  constructor(
    @inject('SkillCategoryRepository') private skillCategoryRepository: SkillCategoryRepository
  ) {}

  async findById(id: string): Promise<SkillCategory> {
    const skillCategory = await this.skillCategoryRepository.findById(id);
    if (!skillCategory) {
      throw new NotFoundError('Skill Category', id);
    }
    return skillCategory;
  }

  async findAll(): Promise<Page<SkillCategory>> {
    return await this.skillCategoryRepository.findAll();
  }
}
