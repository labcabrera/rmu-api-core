import { Inject, Logger } from '@nestjs/common';
import { DeleteRaceCommand } from '../commands/delete-race.command.js';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { RaceDeletedEvent } from '../../../domain/events/race-deleted.event.js';
import type { RaceEventBusPort } from '../../ports/race-event-bus.port.js';
import type { RaceRepository } from '../../ports/race-repository.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import type { RaceGuardPort } from '../../ports/race-guard.port.js';

@CommandHandler(DeleteRaceCommand)
export class DeleteRaceHandler implements ICommandHandler<DeleteRaceCommand> {
  private readonly logger = new Logger(DeleteRaceHandler.name);

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
