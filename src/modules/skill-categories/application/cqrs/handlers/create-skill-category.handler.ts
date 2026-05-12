import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictError } from 'src/modules/shared/domain/errors/errors';
import { CreateSkillCategoryCommand } from '../commands/create-skill-category.command';
import { SkillCategory } from 'src/modules/skill-categories/domain/entities/skill-category';
import type { SkillCategoryRepository } from '../../../../realms/application/ports/skill-category-repository';

@CommandHandler(CreateSkillCategoryCommand)
export class CreateSkillCategoryHandler implements ICommandHandler<CreateSkillCategoryCommand, SkillCategory> {
  constructor(@Inject('SkillCategoryRepository') private readonly skillCategoryRepository: SkillCategoryRepository) {}

  async execute(command: CreateSkillCategoryCommand): Promise<SkillCategory> {
    const current = await this.skillCategoryRepository.findById(command.id);
    if (current) {
      throw new ConflictError(`Skill Category with id ${command.id} already exists`);
    }
    const skillCategory = new SkillCategory(command.id, command.bonus);
    return await this.skillCategoryRepository.save(skillCategory);
  }
}
