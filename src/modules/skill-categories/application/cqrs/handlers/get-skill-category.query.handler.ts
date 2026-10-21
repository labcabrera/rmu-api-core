import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { SkillCategory } from '../../../domain/entities/skill-category.js';
import type { SkillCategoryRepository } from '../../../../realms/application/ports/skill-category-repository.js';
import { GetSkillCategoryQuery } from '../queries/get-skill-category.query.js';

@QueryHandler(GetSkillCategoryQuery)
export class GetSkillCategoryHandler implements IQueryHandler<GetSkillCategoryQuery, SkillCategory> {
  constructor(@Inject('SkillCategoryRepository') private readonly skillCategoryRepository: SkillCategoryRepository) {}

  async execute(query: GetSkillCategoryQuery): Promise<SkillCategory> {
    const data = await this.skillCategoryRepository.findById(query.id);
    if (!data) {
      throw new NotFoundError('SkillCategory', query.id);
    }
    return data;
  }
}
