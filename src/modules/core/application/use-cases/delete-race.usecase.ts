import { Inject, Injectable } from '@nestjs/common';

import * as raceRepository from '../ports/outbound/race-repository';
import * as raceNotificationPort from '../ports/outbound/race-event-producer';
import { DeleteRaceCommand } from '../commands/delete-race.command';
import { NotFoundError } from '../../domain/errors/errors';

@Injectable()
export class DeleteRaceUseCase {
  constructor(
    @Inject('RaceRepository') private readonly raceRepository: raceRepository.RaceRepository,
    @Inject('RaceEventProducer') private readonly raceNotificationPort: raceNotificationPort.RaceEventProducer,
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
