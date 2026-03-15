import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { RaceEventBusPort } from '../../ports/race-event-bus.port';
import type { RaceRepository } from '../../ports/race-repository';
import type { LanguageRepository } from 'src/modules/languages/application/ports/language-repository';
import { UpdateRaceRealmNameCommand as UpdateRaceRealmCommand } from '../commands/update-race-realm.command';

@CommandHandler(UpdateRaceRealmCommand)
export class UpdateRaceRealmHandler implements ICommandHandler<UpdateRaceRealmCommand, void> {
  private readonly logger = new Logger(UpdateRaceRealmHandler.name);

  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('LanguageRepository') private readonly languageRepository: LanguageRepository,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
  ) {}

  async execute(command: UpdateRaceRealmCommand): Promise<void> {
    this.logger.log(`Updating realm ${command.realmId} name to ${command.realmName}`);
    await this.raceRepository.updateRealmInfo(command.realmId, command.realmName, command.realmOwner, command.realmAccessType);
  }
}
