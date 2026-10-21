import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictError } from 'src/modules/shared/domain/errors/errors';
import { ManeuverModifier } from '../../../domain/aggregates/maneuver-modifier';
import type { ManeuverModifierGuardPort } from '../../ports/maneuver-modifier-guard.port';
import type { ManeuverModifierRepository } from '../../ports/maneuver-modifier-repository';
import { CreateManeuverModifierCommand } from '../commands/create-maneuver-modifier.command';

@CommandHandler(CreateManeuverModifierCommand)
export class CreateManeuverModifierHandler implements ICommandHandler<CreateManeuverModifierCommand, ManeuverModifier> {
  private readonly logger = new Logger(CreateManeuverModifierHandler.name);

  constructor(
    @Inject('ManeuverModifierRepository') private readonly repository: ManeuverModifierRepository,
    @Inject('ManeuverModifierGuardPort') private readonly guard: ManeuverModifierGuardPort,
  ) {}

  async execute(command: CreateManeuverModifierCommand): Promise<ManeuverModifier> {
    this.logger.log(`Creating maneuver modifier ${command.definition.key} for user ${command.userId}`);
    this.guard.checkCreate(command.roles);
    const modifier = ManeuverModifier.create({ ...command.definition, owner: command.userId, accessType: command.accessType });
    if (await this.repository.findByKey(modifier.key)) {
      throw new ConflictError(`Maneuver modifier with key ${modifier.key} already exists`);
    }
    return await this.repository.save(modifier);
  }
}
