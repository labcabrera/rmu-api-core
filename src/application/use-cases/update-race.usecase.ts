import { inject, injectable } from 'inversify';

import { Race } from '@domain/entities/race';
import { RaceUpdatedEvent } from '@domain/events/race-updated.event';
import { EventNotificationPort } from '@domain/ports/outbound/event-notification.port';
import { RaceRepository } from '@domain/ports/outbound/race-repository';
import { RealmRepository } from '@domain/ports/outbound/realm-repository';

import { UpdateRaceCommand } from '@application/commands/update-race.command';

@injectable()
export class UpdateRaceUseCase {
  constructor(
    @inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @inject('EventNotificationPort') private readonly eventNotificationPort: EventNotificationPort
  ) {}

  async execute(command: UpdateRaceCommand): Promise<Race> {
    const race: Partial<Race> = { ...command, updatedAt: new Date() };
    const updated = await this.raceRepository.update(command.id, race);
    await this.eventNotificationPort.notify(new RaceUpdatedEvent(updated));
    return updated;
  }
}
