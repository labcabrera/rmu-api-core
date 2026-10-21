import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { ConflictError, ValidationError } from '../../../../shared/domain/errors/errors.js';
import { CreateSkillCommand } from '../commands/create-skill.command.js';
import type { SkillRepository } from '../../ports/skill-repository.js';
import { Skill } from '../../../domain/aggregates/skill.js';
import type { SkillCategoryRepository } from '../../../../realms/application/ports/skill-category-repository.js';
import type { SkillView } from '../../read-models/skill-view.js';
import { SkillViewService } from '../../services/skill-view.service.js';
import type { SkillGuardPort } from '../../ports/skill-guard.js';

@CommandHandler(CreateSkillCommand)
export class CreateSkillHandler implements ICommandHandler<CreateSkillCommand, SkillView> {
  private readonly logger = new Logger(CreateSkillHandler.name);

  constructor(
    @Inject('SkillRepository') private readonly skillRepository: SkillRepository,
    @Inject('SkillCategoryRepository') private readonly skillCategoryRepository: SkillCategoryRepository,
    @Inject('SkillGuardPort') private readonly skillGuard: SkillGuardPort,
    private readonly skillViewService: SkillViewService,
  ) {}

  async execute(command: CreateSkillCommand): Promise<SkillView> {
    this.logger.log(`Creating skill ${command.id} for user ${command.userId}`);
    this.skillGuard.checkCreate(command.roles);

    const current = await this.skillRepository.findById(command.id);
    if (current) throw new ConflictError(`Skill with id ${command.id} already exists`);

    const category = await this.skillCategoryRepository.findById(command.categoryId);
    if (!category) throw new ValidationError(`Skill category with id ${command.categoryId} does not exist`);

    const skill = Skill.create({
      id: command.id,
      categoryId: command.categoryId,
      bonus: command.bonus,
      specialization: command.specialization,
      owner: command.userId,
      accessType: command.accessType,
      maneuver: command.maneuver,
    });
    const saved = await this.skillRepository.save(skill);
    return await this.skillViewService.toView(saved);
  }
}
