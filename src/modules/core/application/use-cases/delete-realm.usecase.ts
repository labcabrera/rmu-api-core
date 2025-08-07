import { Inject, Injectable } from '@nestjs/common';

import * as realmRepository from '../ports/outbound/realm-repository';
import * as realmNotificationPort from '../ports/outbound/realm-event-producer';
import { DeleteRealmCommand } from '../commands/delete-realm.command';
import { NotFoundError } from '../../domain/errors/errors';

@Injectable()
export class DeleteRealmUseCase {
  constructor(
    @Inject('RealmRepository') private readonly realmRepository: realmRepository.RealmRepository,
    @Inject('RealmEventProducer') private readonly realmNotificationPort: realmNotificationPort.RealmEventProducer,
  ) {}

  async execute(command: DeleteRealmCommand): Promise<void> {
    const realm = await this.realmRepository.findById(command.id);
    if (!realm) {
      throw new NotFoundError('Realm', command.id);
    }
    await this.realmRepository.deleteById(command.id);
    await this.realmNotificationPort.deleted(realm);
  }
}
