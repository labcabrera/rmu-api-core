import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictError, ValidationError } from 'src/modules/shared/domain/errors/errors';
import { CreateSkillCommand } from '../commands/create-skill.command';
import type { SkillRepository } from '../../ports/skill-repository';
import { Skill } from 'src/modules/skills/domain/aggregates/skill';
import type { SkillCategoryRepository } from '../../../../realms/application/ports/skill-category-repository';
import type { SkillGuardPort } from '../../ports/skill-guard';

@CommandHandler(CreateSkillCommand)
export class CreateSkillHandler implements ICommandHandler<CreateSkillCommand, Skill> {
  constructor(
    @Inject('SkillRepository') private readonly skillRepository: SkillRepository,
    @Inject('SkillCategoryRepository') private readonly skillCategoryRepository: SkillCategoryRepository,
    @Inject('SkillGuardPort') private readonly skillGuard: SkillGuardPort,
  ) {}

  async execute(command: CreateSkillCommand): Promise<Skill> {
    this.skillGuard.checkSkillCreation(command.userId, command.roles);

    const current = await this.skillRepository.findById(command.id);
    if (current) throw new ConflictError(`Skill with id ${command.id} already exists`);

    console.log('command.roles:', command.roles);

    const category = await this.skillCategoryRepository.findById(command.categoryId);
    if (!category) throw new ValidationError(`Skill category with id ${command.categoryId} does not exist`);

    const skill: Skill = {
      id: command.id,
      categoryId: command.categoryId,
      bonus: command.bonus,
      specialization: command.specialization,
    };
    return await this.skillRepository.save(skill);
  }
}
