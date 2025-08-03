import { UpdateRealmCommand } from '@application/commands/update-realm.command';
import { Realm } from '@domain/entities/realm';
import { RealmRepository } from '@domain/ports/outbound/realm-repository';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateRealmUseCase {
  constructor(@inject('RealmRepository') private readonly realmRepository: RealmRepository) {}
  async execute(command: UpdateRealmCommand): Promise<Realm> {
    const realm: Partial<Realm> = { ...command, updatedAt: new Date() };
    return await this.realmRepository.update(realm.id!, realm);
  }
}
