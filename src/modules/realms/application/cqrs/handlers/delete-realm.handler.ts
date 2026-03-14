import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRealmCommand } from '../commands/delete-realm.command';
import type { RealmEventBusPort } from '../../ports/realm-event-bus.port';
import type { RealmRepository } from '../../ports/realm-repository';
import { RealmDeletedEvent } from 'src/modules/realms/domain/events/realm-deleted.event';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import type { RealmGuardPort } from '../../ports/realm-guard.port';

@CommandHandler(DeleteRealmCommand)
export class DeleteRealmHandler implements ICommandHandler<DeleteRealmCommand> {
  private readonly logger = new Logger(DeleteRealmHandler.name);

  constructor(
    @Inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @Inject('RealmGuardPort') private readonly realmGuard: RealmGuardPort,
    @Inject('RealmEventProducer') private readonly realmEventBus: RealmEventBusPort,
  ) {}

  async execute(command: DeleteRealmCommand): Promise<void> {
    this.logger.log(`Deleting realm ${command.id}`);

    const current = await this.realmRepository.findById(command.id);
    if (!current) throw new NotFoundError('Realm', command.id);

    this.realmGuard.checkDelete(current, command.userId, command.roles);

    const deleted = await this.realmRepository.deleteById(command.id);
    if (!deleted) throw new NotFoundError('Realm', command.id);

    this.realmEventBus.publish(new RealmDeletedEvent(current.getProps()));
  }
}
