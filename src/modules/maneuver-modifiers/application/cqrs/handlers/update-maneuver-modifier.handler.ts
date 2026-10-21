import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictError, NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { ManeuverModifier } from '../../../domain/aggregates/maneuver-modifier';
import type { ManeuverModifierGuardPort } from '../../ports/maneuver-modifier-guard.port';
import type { ManeuverModifierRepository } from '../../ports/maneuver-modifier-repository';
import { UpdateManeuverModifierCommand } from '../commands/update-maneuver-modifier.command';

@CommandHandler(UpdateManeuverModifierCommand)
export class UpdateManeuverModifierHandler implements ICommandHandler<UpdateManeuverModifierCommand, ManeuverModifier> {
  private readonly logger = new Logger(UpdateManeuverModifierHandler.name);

  constructor(
    @Inject('ManeuverModifierRepository') private readonly repository: ManeuverModifierRepository,
    @Inject('ManeuverModifierGuardPort') private readonly guard: ManeuverModifierGuardPort,
  ) {}

  async execute(command: UpdateManeuverModifierCommand): Promise<ManeuverModifier> {
    this.logger.log(`Updating maneuver modifier ${command.id} for user ${command.userId}`);
    const current = await this.repository.findById(command.id);
    if (!current) throw new NotFoundError('ManeuverModifier', command.id);
    this.guard.checkUpdate(current, command.userId, command.roles);

    current.update(command.changes);
    const sameKey = await this.repository.findByKey(current.key);
    if (sameKey && sameKey.id !== current.id) {
      throw new ConflictError(`Maneuver modifier with key ${current.key} already exists`);
    }
    return await this.repository.update(current.id, current);
  }
}
