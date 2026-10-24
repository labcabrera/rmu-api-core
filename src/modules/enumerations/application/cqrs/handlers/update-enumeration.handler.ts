import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { ENUMERATION_REPOSITORY, type EnumerationRepository } from '../../ports/enumeration-repository.port.js';
import { ENUMERATION_GUARD, type EnumerationGuardPort } from '../../ports/enumeration-guard.port.js';
import { ConflictError, NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { Enumeration } from '../../../domain/aggregates/enumeration.js';
import { UpdateEnumerationCommand } from '../commands/update-enumeration.command.js';

@CommandHandler(UpdateEnumerationCommand)
export class UpdateEnumerationHandler implements ICommandHandler<UpdateEnumerationCommand, Enumeration> {
  private readonly logger = new Logger(UpdateEnumerationHandler.name);

  constructor(
    @Inject(ENUMERATION_REPOSITORY) private readonly enumerationRepository: EnumerationRepository,
    @Inject(ENUMERATION_GUARD) private readonly guard: EnumerationGuardPort,
  ) {}

  async execute(command: UpdateEnumerationCommand): Promise<Enumeration> {
    const current = await this.enumerationRepository.findById(command.id);
    if (!current) throw new NotFoundError('Enumeration', command.id);

    this.guard.checkUpdate(current, command.userId, command.roles);

    current.checkVersion(command.expectedVersion);

    const key = command.key ?? current.key;
    const category = command.category ?? current.category;
    if (key !== current.key || category !== current.category) {
      const page = await this.enumerationRepository.findByRsql(`key=="${key}";category=="${category}";id!="${current.id}"`, 0, 1);
      if (page.pagination.totalElements > 0) {
        throw new ConflictError(`Enumeration with key ${key} and category ${category} already exists`, 'duplicate-key');
      }
    }

    const modified = current.update({
      key: command.key,
      category: command.category,
      realmId: command.realmId,
      description: command.description,
      imageUrl: command.imageUrl,
      accessType: command.accessType,
    });
    if (!modified) return current;
    return await this.enumerationRepository.update(current);
  }
}
