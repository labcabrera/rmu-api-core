import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { ENUMERATION_REPOSITORY, type EnumerationRepository } from '../../ports/enumeration-repository.port.js';
import { ENUMERATION_GUARD, type EnumerationGuardPort } from '../../ports/enumeration-guard.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { Enumeration } from '../../../domain/aggregates/enumeration.js';
import { DeleteEnumerationCommand } from '../commands/delete-enumeration.command.js';

@CommandHandler(DeleteEnumerationCommand)
export class DeleteEnumerationHandler implements ICommandHandler<DeleteEnumerationCommand, Enumeration> {
  private readonly logger = new Logger(DeleteEnumerationHandler.name);

  constructor(
    @Inject(ENUMERATION_REPOSITORY) private readonly enumerationRepository: EnumerationRepository,
    @Inject(ENUMERATION_GUARD) private readonly guard: EnumerationGuardPort,
  ) {}

  async execute(command: DeleteEnumerationCommand): Promise<Enumeration> {
    const current = await this.enumerationRepository.findById(command.enumerationId);
    if (!current) throw new NotFoundError('Enumeration', command.enumerationId);

    this.guard.checkDelete(current, command.userId, command.roles);

    await this.enumerationRepository.deleteById(command.enumerationId);
    return current;
  }
}
