import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { EnumerationRepository } from '../../ports/enumeration-repository';
import type { EnumerationGuardPort } from '../../ports/enumeration-guard';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { Enumeration } from 'src/modules/enumerations/domain/aggregates/enumeration';
import { DeleteEnumerationCommand } from '../commands/delete-enumeration.command';

@CommandHandler(DeleteEnumerationCommand)
export class DeleteEnumerationHandler implements ICommandHandler<DeleteEnumerationCommand, Enumeration> {
  private readonly logger = new Logger(DeleteEnumerationHandler.name);

  constructor(
    @Inject('EnumerationRepository') private readonly enumerationRepository: EnumerationRepository,
    @Inject('EnumerationGuardPort') private readonly guard: EnumerationGuardPort,
  ) {}

  async execute(command: DeleteEnumerationCommand): Promise<Enumeration> {
    const current = await this.enumerationRepository.findById(command.enumerationId);
    if (!current) throw new NotFoundError('Enumeration', command.enumerationId);

    this.guard.checkDelete(current, command.userId, command.roles);

    await this.enumerationRepository.deleteById(command.enumerationId);
    return current;
  }
}
