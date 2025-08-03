import { DeleteRealmCommand } from '@application/commands/delete-realm.command';
import { RealmRepository } from '@domain/ports/outbound/realm-repository';
import { RealmEventService } from '@application/services/realm-event.service';
import { NotFoundError } from '@domain/errors/errors';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteRealmUseCase {
  constructor(
    @inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @inject('RealmEventService') private readonly realmEventService: RealmEventService
  ) {}

  async execute(command: DeleteRealmCommand): Promise<void> {
    // Primero verificamos que el realm existe
    const realm = await this.realmRepository.findById(command.id);
    if (!realm) {
      throw new NotFoundError('Realm', command.id);
    }

    // Eliminamos el realm
    await this.realmRepository.deleteById(command.id);

    // Publicamos el evento usando el servicio especializado
    await this.realmEventService.deleted(command.id, realm, command.username, command.reason);
  }
}
