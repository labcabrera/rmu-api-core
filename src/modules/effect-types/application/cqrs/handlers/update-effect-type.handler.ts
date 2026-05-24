import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { EffectType } from 'src/modules/effect-types/domain/aggregates/effect-type';
import { UpdateEffectTypeCommand } from '../commands/update-effect-type.command';
import type { EffectTypeRepository } from '../../ports/effect-type-repository';
import type { EffectTypeGuardPort } from '../../ports/effect-type-guard.port';

@CommandHandler(UpdateEffectTypeCommand)
export class UpdateEffectTypeHandler implements ICommandHandler<UpdateEffectTypeCommand, EffectType> {
  private readonly logger = new Logger(UpdateEffectTypeHandler.name);

  constructor(
    @Inject('EffectTypeRepository') private readonly effectTypeRepository: EffectTypeRepository,
    @Inject('EffectTypeGuardPort') private readonly guard: EffectTypeGuardPort,
  ) {}

  async execute(command: UpdateEffectTypeCommand): Promise<EffectType> {
    const current = await this.effectTypeRepository.findById(command.id);
    if (!current) throw new NotFoundError('EffectType', command.id);

    this.guard.checkUpdate(current, command.userId, command.roles);

    current.update({
      isPersistent: command.isPersistent,
      value: command.value,
      modifier: command.modifier,
      rounds: command.rounds,
      text: command.text,
      location: command.location,
      delay: command.delay,
      accessType: command.accessType,
    });

    return await this.effectTypeRepository.update(command.id, current);
  }
}
