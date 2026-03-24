import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import type { SkillRepository } from '../../ports/skill-repository';
import type { SkillCategoryRepository } from '../../../../realms/application/ports/skill-category-repository';
import type { SkillGuardPort } from '../../ports/skill-guard';
import { DeleteSkillCommand } from '../commands/delete-skill.command';

@CommandHandler(DeleteSkillCommand)
export class DeleteSkillHandler implements ICommandHandler<DeleteSkillCommand, void> {
  private readonly logger = new Logger(DeleteSkillHandler.name);

  constructor(
    @Inject('SkillRepository') private readonly skillRepository: SkillRepository,
    @Inject('SkillCategoryRepository') private readonly skillCategoryRepository: SkillCategoryRepository,
    @Inject('SkillGuardPort') private readonly skillGuard: SkillGuardPort,
  ) {}

  async execute(command: DeleteSkillCommand): Promise<void> {
    this.logger.log(`Deleting skill ${command.skillId} for user ${command.userId}`);

    const current = await this.skillRepository.findById(command.skillId);
    if (!current) throw new NotFoundError('Skill', command.skillId);

    this.skillGuard.checkDelete(current, command.userId, command.roles);

    await this.skillRepository.deleteById(command.skillId);
  }
}
