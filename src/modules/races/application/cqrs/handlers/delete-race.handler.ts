import { Inject } from '@nestjs/common';
import { DeleteRaceCommand } from '../commands/delete-race.command';
import { NotFoundError } from '../../../../core/domain/errors/errors';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { RaceRepository } from '../../ports/out/race-repository';
import type { RaceEventBusPort } from '../../ports/out/race-event-bus.port';
import { RaceDeletedEvent } from 'src/modules/races/domain/events/race-deleted.event';

@CommandHandler(DeleteRaceCommand)
export class DeleteRaceHandler implements ICommandHandler<DeleteRaceCommand> {
  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
  ) {}

  async execute(command: DeleteRaceCommand): Promise<void> {
    const race = await this.raceRepository.findById(command.id);
    if (!race) {
      throw new NotFoundError('Race', command.id);
    }
    await this.raceRepository.deleteById(command.id);
    this.raceEventBus.publish(new RaceDeletedEvent(race));
  }
}
