import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { EffectType } from 'src/modules/effect-types/domain/aggregates/effect-type';
import { DeleteEffectTypeCommand } from '../commands/delete-effect-type.command';
import type { EffectTypeRepository } from '../../ports/effect-type-repository';
import type { EffectTypeGuardPort } from '../../ports/effect-type-guard.port';

@CommandHandler(DeleteEffectTypeCommand)
export class DeleteEffectTypeHandler implements ICommandHandler<DeleteEffectTypeCommand, EffectType> {
  private readonly logger = new Logger(DeleteEffectTypeHandler.name);

  constructor(
    @Inject('EffectTypeRepository') private readonly effectTypeRepository: EffectTypeRepository,
    @Inject('EffectTypeGuardPort') private readonly guard: EffectTypeGuardPort,
  ) {}

  async execute(command: DeleteEffectTypeCommand): Promise<EffectType> {
    const current = await this.effectTypeRepository.findById(command.id);
    if (!current) throw new NotFoundError('EffectType', command.id);

    this.guard.checkDelete(current, command.userId, command.roles);

    await this.effectTypeRepository.deleteById(command.id);
    return current;
  }
}
