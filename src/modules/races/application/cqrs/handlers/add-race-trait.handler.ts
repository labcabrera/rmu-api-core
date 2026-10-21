import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race.js';
import type { RaceEventBusPort } from '../../ports/race-event-bus.port.js';
import type { RaceRepository } from '../../ports/race-repository.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { AddRaceTraitCommand } from '../commands/add-race-trait.command.js';
import type { RaceGuardPort } from '../../ports/race-guard.port.js';

@CommandHandler(AddRaceTraitCommand)
export class AddRaceTraitHandler implements ICommandHandler<AddRaceTraitCommand, Race> {
  private readonly logger = new Logger(AddRaceTraitHandler.name);

  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceGuardPort') private readonly raceGuard: RaceGuardPort,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
  ) {}

  async execute(command: AddRaceTraitCommand): Promise<Race> {
    this.logger.log(`Adding trait ${command.traitId} to race ${command.raceId} for user ${command.userId}`);

    const race = await this.raceRepository.findById(command.raceId);
    if (!race) throw new NotFoundError('Race', command.raceId);

    this.raceGuard.checkUpdate(race, command.userId, command.roles);

    race.addTrait(command.traitId, command.specialization, command.isTalent, command.tier, command.description);

    const updated = await this.raceRepository.update(command.raceId, race);
    race.getUncommittedEvents().forEach(event => this.raceEventBus.publish(event));
    return updated;
  }
}
