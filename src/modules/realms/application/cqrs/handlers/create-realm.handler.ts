import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Realm } from '../../../domain/aggregates/realm.js';
import { CreateRealmCommand } from '../commands/create-realm.command.js';
import type { RealmEventBusPort } from '../../ports/realm-event-bus.port.js';
import type { RealmRepository } from '../../ports/realm-repository.js';
import type { RealmGuardPort } from '../../ports/realm-guard.port.js';

@CommandHandler(CreateRealmCommand)
export class CreateRealmHandler implements ICommandHandler<CreateRealmCommand, Realm> {
  private readonly logger = new Logger(CreateRealmHandler.name);

  constructor(
    @Inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @Inject('RealmGuardPort') private readonly realmGuard: RealmGuardPort,
    @Inject('RealmEventProducer') private readonly realmEventBus: RealmEventBusPort,
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
    realm.getUncommittedEvents().forEach(event => this.realmEventBus.publish(event));
    return savedRealm;
  }
}
