import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import type { RaceEventBusPort } from '../../ports/race-event-bus.port.js';
import type { RaceRepository } from '../../ports/race-repository.js';
import { UpdateRaceRealmNameCommand as UpdateRaceRealmCommand } from '../commands/update-race-realm.command.js';

@CommandHandler(UpdateRaceRealmCommand)
export class UpdateRaceRealmHandler implements ICommandHandler<UpdateRaceRealmCommand, void> {
  private readonly logger = new Logger(UpdateRaceRealmHandler.name);

  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
  ) {}

  async execute(command: UpdateRaceRealmCommand): Promise<void> {
    this.logger.log(`Updating realm ${command.realmId} name to ${command.realmName}`);
    await this.raceRepository.updateRealmInfo(command.realmId, command.realmName, command.realmOwner, command.realmAccessType);
  }
}
