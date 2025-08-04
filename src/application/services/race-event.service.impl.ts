import { injectable, inject } from 'inversify';
import { Race } from '@domain/entities/race';
import { RaceEventService } from './race-event.service';
import { EventNotificationPort } from '@domain/ports/outbound/event-notification.port';
import { RaceCreatedEvent } from '@domain/events/race-created.event';
import { RaceUpdatedEvent } from '@domain/events/race-updated.event';
import { RaceDeletedEvent } from '@domain/events/race-deleted.event';

@injectable()
export class RaceEventServiceImpl implements RaceEventService {
  constructor(
    @inject('EventNotificationPort') private readonly eventNotificationPort: EventNotificationPort
  ) {}

  async created(race: Race, createdBy: string): Promise<void> {
    const event = new RaceCreatedEvent(race.id!, race, createdBy);
    await this.eventNotificationPort.notify(event);
  }

  async updated(race: Race, username: string): Promise<void> {
    const event = new RaceUpdatedEvent(race.id!, race, username);
    await this.eventNotificationPort.notify(event);
  }

  async deleted(raceId: string, race: Race, username: string, reason?: string): Promise<void> {
    const event = new RaceDeletedEvent(raceId, race, username, reason);
    await this.eventNotificationPort.notify(event);
  }
}
