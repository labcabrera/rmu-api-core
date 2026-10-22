import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError, ValidationError } from '../../../../shared/domain/errors/errors.js';
import { SKILL_REPOSITORY, type SkillRepository } from '../../ports/skill-repository.port.js';
import {
  SKILL_CATEGORY_REPOSITORY,
  type SkillCategoryRepository,
} from '../../../../skill-categories/application/ports/skill-category-repository.port.js';
import type { SkillView } from '../../read-models/skill-view.js';
import { SkillViewService } from '../../services/skill-view.service.js';
import { SKILL_GUARD, type SkillGuardPort } from '../../ports/skill-guard.port.js';
import { UpdateSkillCommand } from '../commands/update-skill.command.js';

@CommandHandler(UpdateSkillCommand)
export class UpdateSkillHandler implements ICommandHandler<UpdateSkillCommand, SkillView> {
  private readonly logger = new Logger(UpdateSkillHandler.name);

  constructor(
    @Inject(SKILL_REPOSITORY) private readonly skillRepository: SkillRepository,
    @Inject(SKILL_CATEGORY_REPOSITORY) private readonly skillCategoryRepository: SkillCategoryRepository,
    @Inject(SKILL_GUARD) private readonly skillGuard: SkillGuardPort,
    private readonly skillViewService: SkillViewService,
  ) {}

  async execute(command: UpdateSkillCommand): Promise<SkillView> {
    this.logger.log(`Updating skill ${command.id} for user ${command.userId}`);

    const current = await this.skillRepository.findById(command.id);
    if (!current) throw new NotFoundError('Skill', command.id);

    this.skillGuard.checkUpdate(current, command.userId, command.roles);

    if (command.categoryId) {
      const category = await this.skillCategoryRepository.findById(command.categoryId);
      if (!category) throw new ValidationError(`Skill category with id ${command.categoryId} does not exist`);
    }

    const modified = current.update({
      categoryId: command.categoryId,
      bonus: command.bonus,
      specialization: command.specialization,
      accessType: command.accessType,
      maneuver: command.maneuver,
    });

    if (!modified) return await this.skillViewService.toView(current);
    const updated = await this.skillRepository.update(current.id, current);
    return await this.skillViewService.toView(updated);
  }
}
