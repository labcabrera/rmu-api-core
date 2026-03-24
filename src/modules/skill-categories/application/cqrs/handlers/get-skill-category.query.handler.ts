import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { SkillCategory } from 'src/modules/skill-categories/dommain/entities/skill-category';
import type { SkillCategoryRepository } from '../../../../realms/application/ports/skill-category-repository';
import { GetSkillCategoryQuery } from '../queries/get-skill-category.query';

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
