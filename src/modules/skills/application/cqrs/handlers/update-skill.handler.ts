import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError, ValidationError } from '../../../../shared/domain/errors/errors';
import type { SkillRepository } from '../../ports/skill-repository';
import type { SkillCategoryRepository } from '../../../../realms/application/ports/skill-category-repository';
import { SkillView } from '../../read-models/skill-view';
import { SkillViewService } from '../../services/skill-view.service';
import type { SkillGuardPort } from '../../ports/skill-guard';
import { UpdateSkillCommand } from '../commands/update-skill.command';

@CommandHandler(UpdateSkillCommand)
export class UpdateSkillHandler implements ICommandHandler<UpdateSkillCommand, SkillView> {
  private readonly logger = new Logger(UpdateSkillHandler.name);

  constructor(
    @Inject('SkillRepository') private readonly skillRepository: SkillRepository,
    @Inject('SkillCategoryRepository') private readonly skillCategoryRepository: SkillCategoryRepository,
    @Inject('SkillGuardPort') private readonly skillGuard: SkillGuardPort,
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

    current.update({
      categoryId: command.categoryId,
      bonus: command.bonus,
      specialization: command.specialization,
      accessType: command.accessType,
      maneuver: command.maneuver,
    });

    const updated = await this.skillRepository.update(current.id, current);
    return await this.skillViewService.toView(updated);
  }
}
