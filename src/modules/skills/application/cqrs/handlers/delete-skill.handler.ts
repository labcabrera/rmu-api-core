import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { SKILL_REPOSITORY, type SkillRepository } from '../../ports/skill-repository.port.js';
import { SKILL_GUARD, type SkillGuardPort } from '../../ports/skill-guard.port.js';
import { DeleteSkillCommand } from '../commands/delete-skill.command.js';

@CommandHandler(DeleteSkillCommand)
export class DeleteSkillHandler implements ICommandHandler<DeleteSkillCommand, void> {
  private readonly logger = new Logger(DeleteSkillHandler.name);

  constructor(
    @Inject(SKILL_REPOSITORY) private readonly skillRepository: SkillRepository,
    @Inject(SKILL_GUARD) private readonly skillGuard: SkillGuardPort,
  ) {}

  async execute(command: DeleteSkillCommand): Promise<void> {
    this.logger.log(`Deleting skill ${command.skillId} for user ${command.userId}`);

    const current = await this.skillRepository.findById(command.skillId);
    if (!current) throw new NotFoundError('Skill', command.skillId);

    this.skillGuard.checkDelete(current, command.userId, command.roles);

    await this.skillRepository.deleteById(command.skillId);
  }
}
