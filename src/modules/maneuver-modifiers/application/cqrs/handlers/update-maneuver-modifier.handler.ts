import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { ConflictError, NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { ManeuverModifier } from '../../../domain/aggregates/maneuver-modifier.js';
import { MANEUVER_MODIFIER_GUARD, type ManeuverModifierGuardPort } from '../../ports/maneuver-modifier-guard.port.js';
import { MANEUVER_MODIFIER_REPOSITORY, type ManeuverModifierRepository } from '../../ports/maneuver-modifier-repository.port.js';
import { UpdateManeuverModifierCommand } from '../commands/update-maneuver-modifier.command.js';

@CommandHandler(UpdateManeuverModifierCommand)
export class UpdateManeuverModifierHandler implements ICommandHandler<UpdateManeuverModifierCommand, ManeuverModifier> {
  private readonly logger = new Logger(UpdateManeuverModifierHandler.name);

  constructor(
    @Inject(MANEUVER_MODIFIER_REPOSITORY) private readonly repository: ManeuverModifierRepository,
    @Inject(MANEUVER_MODIFIER_GUARD) private readonly guard: ManeuverModifierGuardPort,
  ) {}

  async execute(command: UpdateManeuverModifierCommand): Promise<ManeuverModifier> {
    this.logger.log(`Updating maneuver modifier ${command.id} for user ${command.userId}`);
    const current = await this.repository.findById(command.id);
    if (!current) throw new NotFoundError('ManeuverModifier', command.id);
    this.guard.checkUpdate(current, command.userId, command.roles);
    current.checkVersion(command.expectedVersion);

    // The key is checked before changing the modifier, so a conflict leaves it as it was.
    const { key } = current.resolve(command.changes);
    const sameKey = await this.repository.findByKey(key);
    if (sameKey && sameKey.id !== current.id) {
      throw new ConflictError(`Maneuver modifier with key ${key} already exists`, 'duplicate-key');
    }
    current.update(command.changes);
    return await this.repository.update(current);
  }
}
