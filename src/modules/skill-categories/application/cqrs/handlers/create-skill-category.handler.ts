import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { ConflictError } from '../../../../shared/domain/errors/errors.js';
import { CreateSkillCategoryCommand } from '../commands/create-skill-category.command.js';
import { SkillCategory } from '../../../domain/entities/skill-category.js';
import { ManeuverProfiles } from '../../../domain/value-objects/maneuver-profile.vo.js';
import { SKILL_CATEGORY_REPOSITORY, type SkillCategoryRepository } from '../../ports/skill-category-repository.port.js';

@CommandHandler(CreateSkillCategoryCommand)
export class CreateSkillCategoryHandler implements ICommandHandler<CreateSkillCategoryCommand, SkillCategory> {
  constructor(@Inject(SKILL_CATEGORY_REPOSITORY) private readonly skillCategoryRepository: SkillCategoryRepository) {}

  async execute(command: CreateSkillCategoryCommand): Promise<SkillCategory> {
    const current = await this.skillCategoryRepository.findById(command.id);
    if (current) {
      throw new ConflictError(`Skill Category with id ${command.id} already exists`);
    }
    ManeuverProfiles.validate(command.maneuver);
    const skillCategory = new SkillCategory(
      command.id,
      command.bonus,
      command.realmBonus ?? null,
      ManeuverProfiles.normalize(command.maneuver),
    );
    return await this.skillCategoryRepository.save(skillCategory);
  }
}
