import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import type { RaceRepository } from '../../ports/race-repository.js';
import { SyncRaceRealmCommand } from '../commands/sync-race-realm.command.js';

@CommandHandler(SyncRaceRealmCommand)
export class SyncRaceRealmHandler implements ICommandHandler<SyncRaceRealmCommand, void> {
  private readonly logger = new Logger(SyncRaceRealmHandler.name);

  constructor(@Inject('RaceRepository') private readonly raceRepository: RaceRepository) {}

  // Idempotent: it sets the realm's current values, so a redelivered event changes nothing.
  async execute(command: SyncRaceRealmCommand): Promise<void> {
    this.logger.log(`Syncing races of realm ${command.realmId} (${command.realmName})`);
    await this.raceRepository.updateRealmInfo(command.realmId, command.realmName, command.realmOwner, command.realmAccessType);
  }
}
