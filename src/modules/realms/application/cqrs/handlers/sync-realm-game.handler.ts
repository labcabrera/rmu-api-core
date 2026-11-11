import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { ConflictError } from '../../../../shared/domain/errors/errors.js';
import type { Realm } from '../../../domain/aggregates/realm.js';
import { REALM_REPOSITORY, type RealmRepository } from '../../ports/realm-repository.port.js';
import { SyncRealmGameCommand } from '../commands/sync-realm-game.command.js';

const MAX_ATTEMPTS = 3;

/**
 * Keeps `games` of the realms in step with the strategic games (spec 071). Idempotent: a redelivered event writes
 * nothing. It publishes no realm event: the games are bookkeeping of the access, not part of the realm.
 */
@CommandHandler(SyncRealmGameCommand)
export class SyncRealmGameHandler implements ICommandHandler<SyncRealmGameCommand, void> {
  private readonly logger = new Logger(SyncRealmGameHandler.name);

  constructor(@Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository) {}

  async execute(command: SyncRealmGameCommand): Promise<void> {
    const { gameId, realmId } = command;
    const holders = await this.realmRepository.findByGameId(gameId);
    for (const realm of holders) {
      if (realm.id === realmId) continue;
      await this.write(realm.id, current => current.removeGame(gameId));
    }
    if (!realmId) return;
    await this.write(realmId, current => current.syncGame({ gameId, ownerId: command.ownerId, memberIds: command.memberIds }));
  }

  /** Loads, changes and writes a realm, again from a fresh copy when somebody changed it meanwhile. */
  private async write(realmId: string, change: (realm: Realm) => void): Promise<void> {
    for (let attempt = 1; ; attempt++) {
      const realm = await this.realmRepository.findById(realmId);
      if (!realm) {
        // A game whose realm is gone: strategic deletes it with the realm (delete-games-by-realm).
        this.logger.warn(`Realm ${realmId} of a strategic game not found`);
        return;
      }
      change(realm);
      if (!realm.hasChanges()) return;
      try {
        await this.realmRepository.update(realm);
        return;
      } catch (error) {
        if (!(error instanceof ConflictError) || attempt >= MAX_ATTEMPTS) throw error;
      }
    }
  }
}
