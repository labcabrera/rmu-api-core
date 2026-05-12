import { Inject, Logger } from '@nestjs/common';
import { DeleteRaceCommand } from '../commands/delete-race.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RaceDeletedEvent } from 'src/modules/races/domain/events/race-deleted.event';
import type { RaceEventBusPort } from '../../ports/race-event-bus.port';
import type { RaceRepository } from '../../ports/race-repository';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { CreateRaceHandler } from './create-race.handler';
import type { RaceGuardPort } from '../../ports/race-guard.port';

@CommandHandler(DeleteRaceCommand)
export class DeleteRaceHandler implements ICommandHandler<DeleteRaceCommand> {
  private readonly logger = new Logger(CreateRaceHandler.name);

  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceGuardPort') private readonly raceGuard: RaceGuardPort,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
  ) {}

  async execute(command: DeleteRaceCommand): Promise<void> {
    this.logger.log(`Deleting race ${command.id} for user ${command.userId}`);

    const race = await this.raceRepository.findById(command.id);
    if (!race) throw new NotFoundError('Race', command.id);

    this.raceGuard.checkDelete(race, command.userId, command.roles);

    await this.raceRepository.deleteById(command.id);
    this.raceEventBus.publish(new RaceDeletedEvent(race.getProps()));
  }
}
