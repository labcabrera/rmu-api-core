import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { EffectType } from '../../../domain/aggregates/effect-type.js';
import { DeleteEffectTypeCommand } from '../commands/delete-effect-type.command.js';
import { EFFECT_TYPE_REPOSITORY, type EffectTypeRepository } from '../../ports/effect-type-repository.port.js';
import { EFFECT_TYPE_GUARD, type EffectTypeGuardPort } from '../../ports/effect-type-guard.port.js';

@CommandHandler(DeleteEffectTypeCommand)
export class DeleteEffectTypeHandler implements ICommandHandler<DeleteEffectTypeCommand, EffectType> {
  private readonly logger = new Logger(DeleteEffectTypeHandler.name);

  constructor(
    @Inject(EFFECT_TYPE_REPOSITORY) private readonly effectTypeRepository: EffectTypeRepository,
    @Inject(EFFECT_TYPE_GUARD) private readonly guard: EffectTypeGuardPort,
  ) {}

  async execute(command: DeleteEffectTypeCommand): Promise<EffectType> {
    const current = await this.effectTypeRepository.findById(command.id);
    if (!current) throw new NotFoundError('EffectType', command.id);

    this.guard.checkDelete(current, command.userId, command.roles);

    await this.effectTypeRepository.deleteById(command.id);
    return current;
  }
}
