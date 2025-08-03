import { injectable, inject } from 'inversify';
import { Race } from '@domain/entities/race';
import { RaceEventService } from './race-event.service';
import { EventNotificationPort } from '@domain/ports/outbound/event-notification.port';
import { RaceCreatedEvent } from '@domain/events/race-created.event';

@injectable()
export class RaceEventServiceImpl implements RaceEventService {
  constructor(
    @inject('EventNotificationPort') private readonly eventNotificationPort: EventNotificationPort
  ) {}

  async created(race: Race, createdBy: string): Promise<void> {
    const event = new RaceCreatedEvent(race.id!, race, createdBy);
    await this.eventNotificationPort.notify(event);
  }

  async updated(race: Race, username: string, changes?: Partial<Race>): Promise<void> {
    // TODO: Implement when RaceUpdatedEvent is created
    console.log(`Race ${race.id} updated by ${username}`, changes);
  }

  async deleted(raceId: string, race: Race, username: string, reason?: string): Promise<void> {
    // TODO: Implement when RaceDeletedEvent is created
    console.log(`Race ${raceId} deleted by ${username}`, reason);
  }
}
