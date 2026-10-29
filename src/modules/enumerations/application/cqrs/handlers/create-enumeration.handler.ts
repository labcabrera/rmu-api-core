import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { CreateEnumerationCommand } from '../commands/create-enumeration.command.js';
import { ENUMERATION_REPOSITORY, type EnumerationRepository } from '../../ports/enumeration-repository.port.js';
import { ENUMERATION_GUARD, type EnumerationGuardPort } from '../../ports/enumeration-guard.port.js';
import { ConflictError, ForbiddenError, ValidationError } from '../../../../shared/domain/errors/errors.js';
import { REALM_REPOSITORY, type RealmRepository } from '../../../../realms/application/ports/realm-repository.port.js';
import { REALM_GUARD, type RealmGuardPort } from '../../../../realms/application/ports/realm-guard.port.js';
import { Enumeration } from '../../../domain/aggregates/enumeration.js';
import { toKey } from '../../../../shared/domain/services/key.js';
import { RMU_ADMIN } from '../../../../shared/domain/entities/user-roles.js';

@CommandHandler(CreateEnumerationCommand)
export class CreateEnumerationHandler implements ICommandHandler<CreateEnumerationCommand, Enumeration> {
  private readonly logger = new Logger(CreateEnumerationHandler.name);

  constructor(
    @Inject(ENUMERATION_REPOSITORY) private readonly enumerationRepository: EnumerationRepository,
    @Inject(ENUMERATION_GUARD) private readonly guard: EnumerationGuardPort,
    @Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository,
    @Inject(REALM_GUARD) private readonly realmGuard: RealmGuardPort,
  ) {}

  async execute(command: CreateEnumerationCommand): Promise<Enumeration> {
    this.guard.checkCreate(command.roles);
    const key = toKey(command.key);
    if (!key) throw new ValidationError(`Enumeration ${command.name} has no letters or digits to build its key`, 'invalid-enumeration-key');
    if (!command.realmId && !command.roles.includes(RMU_ADMIN)) {
      // Global enumerations are system data: users add theirs to a realm they can change, a key space of their own
      throw new ForbiddenError('Only an admin creates enumerations without a realm', 'enumeration-global-admin-only');
    }
    if (command.realmId) {
      // An enumeration of a realm extends that realm: only who can change the realm adds to it.
      const realm = await this.realmRepository.findById(command.realmId);
      if (!realm) throw new ValidationError(`Realm with id ${command.realmId} does not exist`);
      this.realmGuard.checkUpdate(realm, command.userId, command.roles);
    }

    const current = await this.enumerationRepository.findByKeyCategoryAndRealm(key, command.category, command.realmId);
    if (current) {
      throw new ConflictError(
        `Enumeration with key ${key} and category ${command.category} already exists${command.realmId ? ` for realm ${command.realmId}` : ''}.`,
        'duplicate-key',
      );
    }

    const entitySource = 'user';

    const enumeration = Enumeration.create({
      key,
      name: command.name,
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
