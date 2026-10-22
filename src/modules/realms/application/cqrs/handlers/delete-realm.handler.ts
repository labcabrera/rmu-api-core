import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { DeleteRealmCommand } from '../commands/delete-realm.command.js';
import type { RealmRepository } from '../../ports/realm-repository.js';
import { RealmDeletedEvent } from '../../../domain/events/realm-deleted.event.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import type { RealmGuardPort } from '../../ports/realm-guard.port.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.js';

@CommandHandler(DeleteRealmCommand)
export class DeleteRealmHandler implements ICommandHandler<DeleteRealmCommand> {
  private readonly logger = new Logger(DeleteRealmHandler.name);

  constructor(
    @Inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @Inject('RealmGuardPort') private readonly realmGuard: RealmGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: DeleteRealmCommand): Promise<void> {
    this.logger.log(`Deleting realm ${command.id} for user ${command.userId}`);

    const current = await this.realmRepository.findById(command.id);
    if (!current) throw new NotFoundError('Realm', command.id);

    this.realmGuard.checkDelete(current, command.userId, command.roles);

    const deleted = await this.realmRepository.deleteById(command.id);
    if (!deleted) throw new NotFoundError('Realm', command.id);

    await this.events.publish('realm', new RealmDeletedEvent(current.getProps()));
  }
}
