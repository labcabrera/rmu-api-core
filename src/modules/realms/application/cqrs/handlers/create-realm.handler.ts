import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Realm } from '../../../domain/aggregates/realm.js';
import { CreateRealmCommand } from '../commands/create-realm.command.js';
import type { RealmRepository } from '../../ports/realm-repository.js';
import type { RealmGuardPort } from '../../ports/realm-guard.port.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.js';

@CommandHandler(CreateRealmCommand)
export class CreateRealmHandler implements ICommandHandler<CreateRealmCommand, Realm> {
  private readonly logger = new Logger(CreateRealmHandler.name);

  constructor(
    @Inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @Inject('RealmGuardPort') private readonly realmGuard: RealmGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: CreateRealmCommand): Promise<Realm> {
    this.logger.log(`Creating realm ${command.name} for user ${command.userId}`);
    this.realmGuard.checkCreate(command.roles);
    const realm = Realm.create({
      name: command.name,
      magicPresence: command.magicPresence,
      shortDescription: command.shortDescription,
      description: command.description,
      imageUrl: command.imageUrl,
      owner: command.userId,
      accessType: command.accessType,
    });
    const savedRealm = await this.realmRepository.save(realm);
    await this.events.publishChanges('realm', realm);
    return savedRealm;
  }
}
