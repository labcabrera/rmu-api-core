import { inject, injectable } from 'inversify';

import { Realm } from '@domain/entities/realm';
import { RealmRepository } from '@application/ports/outbound/realm-repository';
import { EventNotificationPort } from '@application/ports/outbound/event-notification.port';
import { UpdateRealmCommand } from '@application/commands/update-realm.command';
import { RealmUpdatedEvent } from '@domain/events/realm-updated.event';

@injectable()
export class UpdateRealmUseCase {
  constructor(
    @inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @inject('EventNotificationPort') private readonly eventNotificationPort: EventNotificationPort
  ) {}

  async execute(command: UpdateRealmCommand): Promise<Realm> {
    const originalRealm = await this.realmRepository.findById(command.id);
    const realm: Partial<Realm> = { ...command, updatedAt: new Date() };
    const updatedRealm = await this.realmRepository.update(realm.id!, realm);
    const changes: Partial<Realm> = {};
    if (originalRealm) {
      if (originalRealm.name !== updatedRealm.name) changes.name = updatedRealm.name;
      if (originalRealm.description !== updatedRealm.description)
        changes.description = updatedRealm.description;
    }
    await this.eventNotificationPort.notify(new RealmUpdatedEvent(updatedRealm));
    return updatedRealm;
  }
}
