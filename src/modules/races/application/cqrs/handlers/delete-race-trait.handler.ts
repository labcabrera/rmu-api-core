import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race.js';
import type { RaceRepository } from '../../ports/race-repository.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import type { RaceGuardPort } from '../../ports/race-guard.port.js';
import { DeleteRaceTraitCommand } from '../commands/delete-race-trait.command.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.js';

@CommandHandler(DeleteRaceTraitCommand)
export class DeleteRaceTraitHandler implements ICommandHandler<DeleteRaceTraitCommand, Race> {
  private readonly logger = new Logger(DeleteRaceTraitHandler.name);

  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceGuardPort') private readonly raceGuard: RaceGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: DeleteRaceTraitCommand): Promise<Race> {
    this.logger.log(`Deleting trait ${command.traitId} from race ${command.raceId} for user ${command.userId}`);

    const race = await this.raceRepository.findById(command.raceId);
    if (!race) throw new NotFoundError('Race', command.raceId);

    this.raceGuard.checkUpdate(race, command.userId, command.roles);

    race.removeTrait(command.traitId);

    const updated = await this.raceRepository.update(command.raceId, race);
    await this.events.publishChanges('race', race);
    return updated;
  }
}
