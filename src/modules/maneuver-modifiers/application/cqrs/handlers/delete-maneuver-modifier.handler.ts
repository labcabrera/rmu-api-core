import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { MANEUVER_MODIFIER_GUARD, type ManeuverModifierGuardPort } from '../../ports/maneuver-modifier-guard.port.js';
import { MANEUVER_MODIFIER_REPOSITORY, type ManeuverModifierRepository } from '../../ports/maneuver-modifier-repository.port.js';
import { DeleteManeuverModifierCommand } from '../commands/delete-maneuver-modifier.command.js';

@CommandHandler(DeleteManeuverModifierCommand)
export class DeleteManeuverModifierHandler implements ICommandHandler<DeleteManeuverModifierCommand, void> {
  private readonly logger = new Logger(DeleteManeuverModifierHandler.name);

  constructor(
    @Inject(MANEUVER_MODIFIER_REPOSITORY) private readonly repository: ManeuverModifierRepository,
    @Inject(MANEUVER_MODIFIER_GUARD) private readonly guard: ManeuverModifierGuardPort,
  ) {}

  async execute(command: DeleteManeuverModifierCommand): Promise<void> {
    this.logger.log(`Deleting maneuver modifier ${command.id} for user ${command.userId}`);
    const current = await this.repository.findById(command.id);
    if (!current) throw new NotFoundError('ManeuverModifier', command.id);
    this.guard.checkDelete(current, command.userId, command.roles);
    await this.repository.deleteById(command.id);
  }
}
