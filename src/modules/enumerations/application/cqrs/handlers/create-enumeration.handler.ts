import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { CreateEnumerationCommand } from '../commands/create-enumeration.command.js';
import { ENUMERATION_REPOSITORY, type EnumerationRepository } from '../../ports/enumeration-repository.port.js';
import { ENUMERATION_GUARD, type EnumerationGuardPort } from '../../ports/enumeration-guard.port.js';
import { ConflictError } from '../../../../shared/domain/errors/errors.js';
import { Enumeration } from '../../../domain/aggregates/enumeration.js';

@CommandHandler(CreateEnumerationCommand)
export class CreateEnumerationHandler implements ICommandHandler<CreateEnumerationCommand, Enumeration> {
  private readonly logger = new Logger(CreateEnumerationHandler.name);

  constructor(
    @Inject(ENUMERATION_REPOSITORY) private readonly enumerationRepository: EnumerationRepository,
    @Inject(ENUMERATION_GUARD) private readonly guard: EnumerationGuardPort,
  ) {}

  async execute(command: CreateEnumerationCommand): Promise<Enumeration> {
    this.guard.checkCreate(command.roles);

    const current = await this.enumerationRepository.findByKeyCategoryAndRealm(command.key, command.category, command.realmId);
    if (current) {
      throw new ConflictError(
        `Enumeration with key ${command.key} and category ${command.category} already exists${command.realmId ? ` for realm ${command.realmId}` : ''}.`,
      );
    }

    const entitySource = 'user';

    const enumeration = Enumeration.create({
      key: command.key,
      category: command.category,
      realmId: command.realmId,
      description: command.description,
      imageUrl: command.imageUrl,
      owner: command.userId,
      accessType: command.accessType,
      entitySource: entitySource,
    });
    return await this.enumerationRepository.save(enumeration);
  }
}
