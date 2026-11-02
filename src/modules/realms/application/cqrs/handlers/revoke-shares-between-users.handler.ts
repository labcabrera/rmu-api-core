import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { RevokeSharesBetweenUsersCommand } from '../commands/revoke-shares-between-users.command.js';
import { REALM_REPOSITORY, type RealmRepository } from '../../ports/realm-repository.port.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

@CommandHandler(RevokeSharesBetweenUsersCommand)
export class RevokeSharesBetweenUsersHandler implements ICommandHandler<RevokeSharesBetweenUsersCommand, number> {
  private readonly logger = new Logger(RevokeSharesBetweenUsersHandler.name);

  constructor(
    @Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  /** Idempotent: a redelivered event finds no shares left. Returns the number of realms changed. */
  async execute(command: RevokeSharesBetweenUsersCommand): Promise<number> {
    const { userA, userB } = command;
    const realms = [
      ...(await this.realmRepository.findOwnedSharedWith(userA, userB)),
      ...(await this.realmRepository.findOwnedSharedWith(userB, userA)),
    ];
    this.logger.log(`Revoking the shares between ${userA} and ${userB}: ${realms.length} realms`);
    for (const realm of realms) {
      realm.unshare(realm.owner === userA ? userB : userA);
      if (!realm.hasChanges()) continue;
      await this.realmRepository.update(realm);
      await this.events.publishChanges('realm', realm);
    }
    return realms.length;
  }
}
