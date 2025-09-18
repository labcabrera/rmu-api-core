import { Inject } from '@nestjs/common';
import { DeleteRaceCommand } from '../commands/delete-race.command';
import { NotFoundError } from '../../../../core/domain/errors/errors';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { RaceRepository } from '../../ports/out/race-repository';
import type { RaceEventProducer } from '../../ports/out/race-event-producer';

@CommandHandler(DeleteRaceCommand)
export class DeleteRaceHandler implements ICommandHandler<DeleteRaceCommand> {
  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceEventProducer') private readonly raceNotificationPort: RaceEventProducer,
  ) {}

  async execute(command: DeleteRaceCommand): Promise<void> {
    const race = await this.raceRepository.findById(command.id);
    if (!race) {
      throw new NotFoundError('Race', command.id);
    }
    await this.raceRepository.deleteById(command.id);
    await this.raceNotificationPort.deleted(race);
  }
}
