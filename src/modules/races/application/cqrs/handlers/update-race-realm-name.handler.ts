import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { RaceEventBusPort } from '../../ports/race-event-bus.port';
import type { RaceRepository } from '../../ports/race-repository';
import type { LanguageRepository } from 'src/modules/languages/application/ports/language-repository';
import { UpdateRaceRealmNameCommand } from '../commands/update-race-realm-name.command';

@CommandHandler(UpdateRaceRealmNameCommand)
export class UpdateRaceRealmNameHandler implements ICommandHandler<UpdateRaceRealmNameCommand, void> {
  private readonly logger = new Logger(UpdateRaceRealmNameHandler.name);

  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('LanguageRepository') private readonly languageRepository: LanguageRepository,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
  ) {}

  async execute(command: UpdateRaceRealmNameCommand): Promise<void> {
    this.logger.log(`Updating realm ${command.realmId} name to ${command.realmName}`);
    await this.raceRepository.updateRealmName(command.realmId, command.realmName);
  }
}
