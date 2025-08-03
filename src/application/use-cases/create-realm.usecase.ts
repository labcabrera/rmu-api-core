import { CreateRealmCommand } from '@application/commands/create-realm.command';
import { Realm } from '@domain/entities/realm';
import { ConflictError } from '@domain/errors/errors';
import { RealmRepository } from '@domain/ports/realm-repository';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateRealmUseCase {
  constructor(@inject('RealmRepository') private readonly realmRepository: RealmRepository) {}
  async execute(command: CreateRealmCommand): Promise<Realm> {
    const exists = await this.realmRepository.findById(command.id);
    if (exists) {
      throw new ConflictError(`Realm ${command.id} already exists`);
    }
    const realm: Partial<Realm> = { ...command, createdAt: new Date() };
    return await this.realmRepository.save(realm);
  }

  async existsById(id: string): Promise<boolean> {
    try {
      await this.realmRepository.findById(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
