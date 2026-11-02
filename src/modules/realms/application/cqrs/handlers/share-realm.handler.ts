import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Realm } from '../../../domain/aggregates/realm.js';
import { ShareRealmCommand } from '../commands/share-realm.command.js';
import { REALM_REPOSITORY, type RealmRepository } from '../../ports/realm-repository.port.js';
import { REALM_GUARD, type RealmGuardPort } from '../../ports/realm-guard.port.js';
import { FRIENDSHIP_PORT, type FriendshipPort } from '../../ports/friendship.port.js';
import { NotFoundError, ValidationError } from '../../../../shared/domain/errors/errors.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

@CommandHandler(ShareRealmCommand)
export class ShareRealmHandler implements ICommandHandler<ShareRealmCommand, Realm> {
  private readonly logger = new Logger(ShareRealmHandler.name);

  constructor(
    @Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository,
    @Inject(REALM_GUARD) private readonly realmGuard: RealmGuardPort,
    @Inject(FRIENDSHIP_PORT) private readonly friendships: FriendshipPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: ShareRealmCommand): Promise<Realm> {
    this.logger.log(`Sharing realm ${command.realmId} with ${command.targetUserId} (${command.level}) for user ${command.userId}`);

    const realm = await this.realmRepository.findById(command.realmId);
    if (!realm) throw new NotFoundError('Realm', command.realmId);
    this.realmGuard.checkManage(realm, command.userId, command.roles);
    realm.checkVersion(command.expectedVersion);
    if (command.targetUserId === realm.owner) {
      throw new ValidationError('The owner already has every access to the realm', 'share-self');
    }

    // Only friends of the owner (spec 069, decision 4), also when an admin shares someone else's realm.
    const friend = await this.friendships.findAcceptedFriend(realm.owner, command.targetUserId);
    if (!friend) throw new ValidationError(`${command.targetUserId} is not an accepted friend of the owner`, 'share-not-friend');

    realm.share(friend.userId, friend.userName, command.level);
    if (!realm.hasChanges()) return realm;
    const updated = await this.realmRepository.update(realm);
    await this.events.publishChanges('realm', realm);
    return updated;
  }
}
