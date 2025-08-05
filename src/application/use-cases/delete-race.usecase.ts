import { inject, injectable } from 'inversify';

import { DeleteRaceCommand } from '@application/commands/delete-race.command';
import { NotFoundError } from '@domain/errors/errors';
import { RaceDeletedEvent } from '@domain/events/race-deleted.event';
import { EventNotificationPort } from '@application/ports/outbound/event-notification.port';
import { RaceRepository } from '@application/ports/outbound/race-repository';
import { RealmRepository } from '@application/ports/outbound/realm-repository';

@injectable()
export class DeleteRaceUseCase {
  constructor(
    @inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @inject('EventNotificationPort') private readonly eventNotificationPort: EventNotificationPort
  ) {}

  async execute(command: DeleteRaceCommand): Promise<void> {
    const race = await this.raceRepository.findById(command.id);
    if (!race) {
      throw new NotFoundError('Race', command.id);
    }
    await this.raceRepository.deleteById(command.id);
    await this.eventNotificationPort.notify(new RaceDeletedEvent(race));
  }
}
