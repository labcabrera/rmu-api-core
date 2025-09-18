import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Realm } from '../../../domain/aggregates/realm';
import { UpdateRealmCommand } from '../commands/update-realm.command';
import type { RealmEventBusPort } from '../../ports/out/realm-event-bus.port';
import type { RealmRepository } from '../../ports/out/realm-repository';

@CommandHandler(UpdateRealmCommand)
export class UpdateRealmCommandHandler implements ICommandHandler<UpdateRealmCommand, Realm> {
  constructor(
    @Inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @Inject('RealmEventProducer') private readonly realmNotificationPort: RealmEventBusPort,
  ) {}

  async execute(command: UpdateRealmCommand): Promise<Realm> {
    const originalRealm = await this.realmRepository.findById(command.id);
    const realm: Partial<Realm> = { ...command, updatedAt: new Date() };
    const updatedRealm = await this.realmRepository.update(realm.id!, realm);
    const changes: Partial<Realm> = {};
    if (originalRealm) {
      if (originalRealm.name !== updatedRealm.name) changes.name = updatedRealm.name;
      if (originalRealm.description !== updatedRealm.description) changes.description = updatedRealm.description;
    }
    await this.realmNotificationPort.updated(updatedRealm);
    return updatedRealm;
  }
}
