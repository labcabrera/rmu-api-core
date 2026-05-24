import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictError } from 'src/modules/shared/domain/errors/errors';
import { EffectType } from 'src/modules/effect-types/domain/aggregates/effect-type';
import { CreateEffectTypeCommand } from '../commands/create-effect-type.command';
import type { EffectTypeRepository } from '../../ports/effect-type-repository';
import type { EffectTypeGuardPort } from '../../ports/effect-type-guard.port';

@CommandHandler(CreateEffectTypeCommand)
export class CreateEffectTypeHandler implements ICommandHandler<CreateEffectTypeCommand, EffectType> {
  private readonly logger = new Logger(CreateEffectTypeHandler.name);

  constructor(
    @Inject('EffectTypeRepository') private readonly effectTypeRepository: EffectTypeRepository,
    @Inject('EffectTypeGuardPort') private readonly guard: EffectTypeGuardPort,
  ) {}

  async execute(command: CreateEffectTypeCommand): Promise<EffectType> {
    this.guard.checkCreate(command.roles);

    const current = await this.effectTypeRepository.findById(command.id);
    if (current) {
      throw new ConflictError(`Effect type with id ${command.id} already exists`);
    }

    const effectType = EffectType.create({
      id: command.id,
      isPersistent: command.isPersistent,
      value: command.value,
      modifier: command.modifier,
      rounds: command.rounds,
      text: command.text,
      location: command.location,
      delay: command.delay,
      owner: command.userId,
      accessType: command.accessType,
      entitySource: 'user',
    });

    return await this.effectTypeRepository.save(effectType);
  }
}
