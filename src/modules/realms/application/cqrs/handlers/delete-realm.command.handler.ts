import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRealmCommand } from '../commands/delete-realm.command';
import { NotFoundError } from '../../../../core/domain/errors/errors';
import type { RealmEventBusPort } from '../../ports/out/realm-event-bus.port';
import type { RealmRepository } from '../../ports/out/realm-repository';

@CommandHandler(DeleteRealmCommand)
export class DeleteRealmCommandHandler implements ICommandHandler<DeleteRealmCommand> {
  private readonly logger = new Logger(DeleteRealmCommandHandler.name);

  constructor(
    @Inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @Inject('RealmEventProducer') private readonly realmNotificationPort: RealmEventBusPort,
  ) {}

  async execute(command: DeleteRealmCommand): Promise<void> {
    this.logger.log(`Deleting realm ${command.id}`);
    const deleted = await this.realmRepository.deleteById(command.id);
    if (!deleted) {
      throw new NotFoundError('Realm', command.id);
    }
    await this.realmNotificationPort.deleted(deleted);
  }
}
