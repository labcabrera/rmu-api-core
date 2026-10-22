import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { RACE_REPOSITORY, type RaceRepository } from '../../ports/race-repository.port.js';
import { DeleteRacesByRealmCommand } from '../commands/delete-races-by-realm.command.js';
import { RaceDeletedEvent } from '../../../domain/events/race-deleted.event.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

@CommandHandler(DeleteRacesByRealmCommand)
export class DeleteRacesByRealmHandler implements ICommandHandler<DeleteRacesByRealmCommand> {
  private readonly logger = new Logger(DeleteRacesByRealmHandler.name);

  constructor(
    @Inject(RACE_REPOSITORY) private readonly raceRepository: RaceRepository,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  // Idempotent: a redelivered event finds no races left. No access check: the realm owner already deleted it.
  async execute(command: DeleteRacesByRealmCommand): Promise<void> {
    const races = await this.raceRepository.findByRealmId(command.realmId);
    this.logger.log(`Deleting ${races.length} races of realm ${command.realmId}`);
    for (const race of races) {
      await this.raceRepository.deleteById(race.id);
      await this.events.publish('race', new RaceDeletedEvent(race.getProps()));
    }
  }
}
