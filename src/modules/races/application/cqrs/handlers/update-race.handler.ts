import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race';
import { UpdateRaceCommand } from '../commands/update-race.command';
import { NotFoundError } from '../../../../core/domain/errors/errors';
import type { RaceEventBusPort } from '../../ports/out/race-event-bus.port';
import type { RaceRepository } from '../../ports/out/race-repository';

@CommandHandler(UpdateRaceCommand)
export class UpdateRaceHandler implements ICommandHandler<UpdateRaceCommand, Race> {
  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
  ) {}

  async execute(command: UpdateRaceCommand): Promise<Race> {
    const race = await this.raceRepository.findById(command.id);
    if (!race) {
      throw new NotFoundError('Race', command.id);
    }
    race.update(
      command.name,
      command.sizeId,
      command.stats,
      command.resistances,
      command.averageHeight,
      command.averageWeight,
      command.strideBonus,
      command.enduranceBonus,
      command.recoveryMultiplier,
      command.baseHits,
      command.baseDevPoints,
      command.baseAt,
      command.defaultLanguage,
      command.talents,
      command.description,
    );
    const updated = await this.raceRepository.update(command.id, race);
    race.getUncommittedEvents().forEach((event) => this.raceEventBus.publish(event));
    return updated;
  }
}
