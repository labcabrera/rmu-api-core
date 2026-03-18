import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError, ValidationError } from 'src/modules/shared/domain/errors/errors';
import type { SkillRepository } from '../../ports/skill-repository';
import { Skill } from 'src/modules/skills/domain/aggregates/skill';
import type { SkillCategoryRepository } from '../../../../realms/application/ports/skill-category-repository';
import type { SkillGuardPort } from '../../ports/skill-guard';
import { UpdateSkillCommand } from '../commands/update-skill.command';

@CommandHandler(UpdateSkillCommand)
export class UpdateSkillHandler implements ICommandHandler<UpdateSkillCommand, Skill> {
  private readonly logger = new Logger(UpdateSkillHandler.name);

  constructor(
    @Inject('SkillRepository') private readonly skillRepository: SkillRepository,
    @Inject('SkillCategoryRepository') private readonly skillCategoryRepository: SkillCategoryRepository,
    @Inject('SkillGuardPort') private readonly skillGuard: SkillGuardPort,
  ) {}

  async execute(command: UpdateSkillCommand): Promise<Skill> {
    this.logger.log(`Updating skill ${command.id} for user ${command.userId}`);

    const current = await this.skillRepository.findById(command.id);
    if (!current) throw new NotFoundError('Skill', command.id);

    this.skillGuard.checkUpdate(current, command.userId, command.roles);

    if (command.categoryId) {
      const category = await this.skillCategoryRepository.findById(command.categoryId);
      if (!category) throw new ValidationError(`Skill category with id ${command.categoryId} does not exist`);
    }

    current.update({
      categoryId: command.categoryId,
      bonus: command.bonus,
      specialization: command.specialization,
      accessType: command.accessType,
    });

    return await this.skillRepository.update(current.id, current);
  }
}
