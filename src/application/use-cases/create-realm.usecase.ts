import { CreateRaceCommand as CreateRealmCommand } from '@application/commands/create-race.command';
import { Realm } from '@domain/entities/realm';
import { RealmRepository } from '@domain/ports/realm-repository';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateRealmUseCase {
  constructor(@inject('RealmRepository') private readonly realmRepository: RealmRepository) {}
  async execute(command: CreateRealmCommand): Promise<Realm> {
    const realm: Partial<Realm> = { ...command, createdAt: new Date() };
    return await this.realmRepository.save(realm);
  }
}
