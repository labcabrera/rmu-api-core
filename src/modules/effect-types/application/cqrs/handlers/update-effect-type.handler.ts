import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { EffectType } from '../../../domain/aggregates/effect-type.js';
import { UpdateEffectTypeCommand } from '../commands/update-effect-type.command.js';
import { EFFECT_TYPE_REPOSITORY, type EffectTypeRepository } from '../../ports/effect-type-repository.port.js';
import { EFFECT_TYPE_GUARD, type EffectTypeGuardPort } from '../../ports/effect-type-guard.port.js';

@CommandHandler(UpdateEffectTypeCommand)
export class UpdateEffectTypeHandler implements ICommandHandler<UpdateEffectTypeCommand, EffectType> {
  private readonly logger = new Logger(UpdateEffectTypeHandler.name);

  constructor(
    @Inject(EFFECT_TYPE_REPOSITORY) private readonly effectTypeRepository: EffectTypeRepository,
    @Inject(EFFECT_TYPE_GUARD) private readonly guard: EffectTypeGuardPort,
  ) {}

  async execute(command: UpdateEffectTypeCommand): Promise<EffectType> {
    const current = await this.effectTypeRepository.findById(command.id);
    if (!current) throw new NotFoundError('EffectType', command.id);

    this.guard.checkUpdate(current, command.userId, command.roles);

    current.checkVersion(command.expectedVersion);

    const modified = current.update({
      isPersistent: command.isPersistent,
      isStackable: command.isStackable,
      value: command.value,
      modifier: command.modifier,
      rounds: command.rounds,
      text: command.text,
      location: command.location,
      delay: command.delay,
      accessType: command.accessType,
    });
    if (!modified) return current;

    return await this.effectTypeRepository.update(current);
  }
}
