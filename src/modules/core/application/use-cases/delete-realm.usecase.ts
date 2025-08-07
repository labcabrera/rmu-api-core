import { Inject, Injectable, Logger } from '@nestjs/common';

import * as realmRepository from '../ports/outbound/realm-repository';
import * as realmNotificationPort from '../ports/outbound/realm-event-producer';
import { DeleteRealmCommand } from '../commands/delete-realm.command';
import { NotFoundError } from '../../domain/errors/errors';

@Injectable()
export class DeleteRealmUseCase {
  private readonly logger = new Logger(DeleteRealmUseCase.name);

  constructor(
    @Inject('RealmRepository') private readonly realmRepository: realmRepository.RealmRepository,
    @Inject('RealmEventProducer') private readonly realmNotificationPort: realmNotificationPort.RealmEventProducer,
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
