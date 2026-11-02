import { Inject, Logger } from '@nestjs/common';
import { DeleteRaceCommand } from '../commands/delete-race.command.js';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { RaceDeletedEvent } from '../../../domain/events/race-deleted.event.js';
import { RACE_REPOSITORY, type RaceRepository } from '../../ports/race-repository.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { RACE_GUARD, type RaceGuardPort } from '../../ports/race-guard.port.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

@CommandHandler(DeleteRaceCommand)
export class DeleteRaceHandler implements ICommandHandler<DeleteRaceCommand> {
  private readonly logger = new Logger(DeleteRaceHandler.name);

  constructor(
    @Inject(RACE_REPOSITORY) private readonly raceRepository: RaceRepository,
    @Inject(RACE_GUARD) private readonly raceGuard: RaceGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: DeleteRaceCommand): Promise<void> {
    this.logger.log(`Deleting race ${command.id} for user ${command.userId}`);

    const race = await this.raceRepository.findById(command.id);
    if (!race) throw new NotFoundError('Race', command.id);

    this.raceGuard.checkDelete(race, command.userId, command.roles);

    await this.raceRepository.deleteById(command.id);
    await this.events.publish('race', new RaceDeletedEvent(race.getProps()));
  }
}
