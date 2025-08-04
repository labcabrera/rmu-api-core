import { UpdateRealmCommand } from '@application/commands/update-realm.command';
import { Realm } from '@domain/entities/realm';
import { RealmRepository } from '@domain/ports/outbound/realm-repository';
import { RealmEventService } from '@application/services/realm-event.service';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateRealmUseCase {
  constructor(
    @inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @inject('RealmEventService') private readonly realmEventService: RealmEventService
  ) {}

  async execute(command: UpdateRealmCommand): Promise<Realm> {
    const originalRealm = await this.realmRepository.findById(command.id);
    const realm: Partial<Realm> = { ...command, updatedAt: new Date() };
    const updatedRealm = await this.realmRepository.update(realm.id!, realm);
    const changes: Partial<Realm> = {};
    if (originalRealm) {
      if (originalRealm.name !== updatedRealm.name) changes.name = updatedRealm.name;
      if (originalRealm.description !== updatedRealm.description)
        changes.description = updatedRealm.description;
    }
    await this.realmEventService.updated(updatedRealm, command.username, changes);
    return updatedRealm;
  }
}
