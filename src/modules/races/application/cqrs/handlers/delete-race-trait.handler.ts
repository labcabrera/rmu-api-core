import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race';
import type { RaceEventBusPort } from '../../ports/race-event-bus.port';
import type { RaceRepository } from '../../ports/race-repository';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import type { RaceGuardPort } from '../../ports/race-guard.port';
import { DeleteRaceTraitCommand } from '../commands/delete-race-trait.command';

@CommandHandler(DeleteRaceTraitCommand)
export class DeleteRaceTraitHandler implements ICommandHandler<DeleteRaceTraitCommand, Race> {
  private readonly logger = new Logger(DeleteRaceTraitHandler.name);

  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceGuardPort') private readonly raceGuard: RaceGuardPort,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
  ) {}

  async execute(command: DeleteRaceTraitCommand): Promise<Race> {
    this.logger.log(`Deleting trait ${command.traitId} from race ${command.raceId} for user ${command.userId}`);

    const race = await this.raceRepository.findById(command.raceId);
    if (!race) throw new NotFoundError('Race', command.raceId);

    this.raceGuard.checkUpdate(race, command.userId, command.roles);

    race.removeTrait(command.traitId);

    const updated = await this.raceRepository.update(command.raceId, race);
    race.getUncommittedEvents().forEach((event) => this.raceEventBus.publish(event));
    return updated;
  }
}
