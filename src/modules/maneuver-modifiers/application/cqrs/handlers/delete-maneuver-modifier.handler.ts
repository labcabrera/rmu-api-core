import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors';
import type { ManeuverModifierGuardPort } from '../../ports/maneuver-modifier-guard.port';
import type { ManeuverModifierRepository } from '../../ports/maneuver-modifier-repository';
import { DeleteManeuverModifierCommand } from '../commands/delete-maneuver-modifier.command';

@CommandHandler(DeleteManeuverModifierCommand)
export class DeleteManeuverModifierHandler implements ICommandHandler<DeleteManeuverModifierCommand, void> {
  private readonly logger = new Logger(DeleteManeuverModifierHandler.name);

  constructor(
    @Inject('ManeuverModifierRepository') private readonly repository: ManeuverModifierRepository,
    @Inject('ManeuverModifierGuardPort') private readonly guard: ManeuverModifierGuardPort,
  ) {}

  async execute(command: DeleteManeuverModifierCommand): Promise<void> {
    this.logger.log(`Deleting maneuver modifier ${command.id} for user ${command.userId}`);
    const current = await this.repository.findById(command.id);
    if (!current) throw new NotFoundError('ManeuverModifier', command.id);
    this.guard.checkDelete(current, command.userId, command.roles);
    await this.repository.deleteById(command.id);
  }
}
