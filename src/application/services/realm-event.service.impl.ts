import { injectable, inject } from 'inversify';
import { Realm } from '@domain/entities/realm';
import { RealmEventService } from './realm-event.service';
import { EventNotificationPort } from '@domain/ports/outbound/event-notification.port';
import { RealmCreatedEvent } from '@domain/events/realm-created.event';
import { RealmUpdatedEvent } from '@domain/events/realm-updated.event';
import { RealmDeletedEvent } from '@domain/events/realm-deleted.event';

@injectable()
export class RealmEventServiceImpl implements RealmEventService {
  constructor(
    @inject('EventNotificationPort') private readonly eventNotificationPort: EventNotificationPort
  ) {}

  async created(realm: Realm, username: string): Promise<void> {
    const event = new RealmCreatedEvent(realm.id, realm, username);
    await this.eventNotificationPort.notify(event);
  }

  async updated(realm: Realm, username: string, changes?: Partial<Realm>): Promise<void> {
    const event = new RealmUpdatedEvent(realm.id, realm, username, changes);
    await this.eventNotificationPort.notify(event);
  }

  async deleted(realmId: string, realm: Realm, username: string, reason?: string): Promise<void> {
    const event = new RealmDeletedEvent(realmId, realm, username, reason);
    await this.eventNotificationPort.notify(event);
  }
}
