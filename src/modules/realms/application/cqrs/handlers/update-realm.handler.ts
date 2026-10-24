import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Realm } from '../../../domain/aggregates/realm.js';
import { UpdateRealmCommand } from '../commands/update-realm.command.js';
import { REALM_REPOSITORY, type RealmRepository } from '../../ports/realm-repository.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { REALM_GUARD, type RealmGuardPort } from '../../ports/realm-guard.port.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

@CommandHandler(UpdateRealmCommand)
export class UpdateRealmHandler implements ICommandHandler<UpdateRealmCommand, Realm> {
  private readonly logger = new Logger(UpdateRealmHandler.name);

  constructor(
    @Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository,
    @Inject(REALM_GUARD) private readonly realmGuard: RealmGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: UpdateRealmCommand): Promise<Realm> {
    this.logger.log(`Updating realm ${command.id} for user ${command.userId}`);

    const realm = await this.realmRepository.findById(command.id);
    if (!realm) throw new NotFoundError('Realm', command.id);

    this.realmGuard.checkUpdate(realm, command.userId, command.roles);

    realm.checkVersion(command.expectedVersion);

    realm.update({
      name: command.name,
      magicPresence: command.magicPresence,
      shortDescription: command.shortDescription,
      description: command.description,
      imageUrl: command.imageUrl,
      accessType: command.accessType,
    });
    const updated = await this.realmRepository.update(realm);
    await this.events.publishChanges('realm', realm);
    return updated;
  }
}
