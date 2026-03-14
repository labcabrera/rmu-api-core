import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Realm } from '../../../domain/aggregates/realm';
import { UpdateRealmCommand } from '../commands/update-realm.command';
import type { RealmEventBusPort } from '../../ports/realm-event-bus.port';
import type { RealmRepository } from '../../ports/realm-repository';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import type { RealmGuardPort } from '../../ports/realm-guard.port';

@CommandHandler(UpdateRealmCommand)
export class UpdateRealmHandler implements ICommandHandler<UpdateRealmCommand, Realm> {
  private readonly logger = new Logger(UpdateRealmHandler.name);

  constructor(
    @Inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @Inject('RealmGuardPort') private readonly realmGuard: RealmGuardPort,
    @Inject('RealmEventProducer') private readonly realmEventBus: RealmEventBusPort,
  ) {}

  async execute(command: UpdateRealmCommand): Promise<Realm> {
    this.logger.log(`Updating realm ${command.id} for user ${command.userId}`);

    const realm = await this.realmRepository.findById(command.id);
    if (!realm) throw new NotFoundError('Realm', command.id);

    this.realmGuard.checkUpdate(realm, command.userId, command.roles);

    realm.update({
      name: command.name,
      magicPresence: command.magicPresence,
      shortDescription: command.shortDescription,
      description: command.description,
      imageUrl: command.imageUrl,
      accessType: command.accessType,
    });
    const updated = await this.realmRepository.update(realm.id, realm);
    realm.getUncommittedEvents().forEach((event) => this.realmEventBus.publish(event));
    return updated;
  }
}
