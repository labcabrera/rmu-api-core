import { DeleteRealmCommand } from '@application/commands/delete-realm.command';
import { RealmRepository } from '@domain/ports/outbound/realm-repository';
import { NotFoundError } from '@domain/errors/errors';
import { inject, injectable } from 'inversify';
import { EventNotificationPort } from '@domain/ports/outbound/event-notification.port';
import { RealmDeletedEvent } from '@domain/events/realm-deleted.event';

@injectable()
export class DeleteRealmUseCase {
  constructor(
    @inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @inject('EventNotificationPort') private readonly eventNotificationPort: EventNotificationPort
  ) {}

  async execute(command: DeleteRealmCommand): Promise<void> {
    const realm = await this.realmRepository.findById(command.id);
    if (!realm) {
      throw new NotFoundError('Realm', command.id);
    }
    await this.realmRepository.deleteById(command.id);
    await this.eventNotificationPort.notify(new RealmDeletedEvent(realm));
  }
}
