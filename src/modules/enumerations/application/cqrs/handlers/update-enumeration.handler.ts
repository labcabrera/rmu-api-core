import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { EnumerationRepository } from '../../ports/enumeration-repository';
import type { EnumerationGuardPort } from '../../ports/enumeration-guard';
import { ConflictError, NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { Enumeration } from 'src/modules/enumerations/domain/aggregates/enumeration';
import { UpdateEnumerationCommand } from '../commands/update-enumeration.command';

@CommandHandler(UpdateEnumerationCommand)
export class UpdateEnumerationHandler implements ICommandHandler<UpdateEnumerationCommand, Enumeration> {
  private readonly logger = new Logger(UpdateEnumerationHandler.name);

  constructor(
    @Inject('EnumerationRepository') private readonly enumerationRepository: EnumerationRepository,
    @Inject('EnumerationGuardPort') private readonly guard: EnumerationGuardPort,
  ) {}

  async execute(command: UpdateEnumerationCommand): Promise<Enumeration> {
    const current = await this.enumerationRepository.findById(command.id);
    if (!current) throw new NotFoundError('Enumeration', command.id);

    this.guard.checkUpdate(current, command.userId, command.roles);

    const page = await this.enumerationRepository.findByRsql(`key=="${command.key}";category=="${command.category}"`, 0, 1);
    if (page.pagination.totalElements > 0) {
      throw new ConflictError(`Enumeration with key ${command.key} and category ${command.category} already exists`);
    }

    current.update({
      key: command.key,
      category: command.category,
      realmId: command.realmId,
      accessType: command.accessType,
    });
    return await this.enumerationRepository.update(command.id, current);
  }
}
