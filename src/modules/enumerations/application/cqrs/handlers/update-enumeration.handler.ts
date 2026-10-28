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

    // The same uniqueness as on create: key, category and realm (the update never clears the realm).
    const key = command.key || current.key;
    const category = command.category || current.category;
    const realmId = command.realmId || current.realmId;
    if (key !== current.key || category !== current.category || realmId !== current.realmId) {
      const existing = await this.enumerationRepository.findByKeyCategoryAndRealm(key, category, realmId);
      if (existing && existing.id !== current.id) {
        throw new ConflictError(
          `Enumeration with key ${key} and category ${category} already exists${realmId ? ` for realm ${realmId}` : ''}`,
          'duplicate-key',
        );
      }
    }

    current.update({
      key: command.key,
      category: command.category,
      realmId: command.realmId,
      description: command.description,
      imageUrl: command.imageUrl,
      accessType: command.accessType,
    });
    // A change that leaves the state as it was neither writes nor publishes (spec 021, decision 9).
    if (!current.hasChanges()) return current;
    return await this.enumerationRepository.update(current);
  }
}
