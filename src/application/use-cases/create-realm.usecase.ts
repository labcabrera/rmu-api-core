import { CreateRealmCommand } from '@application/commands/create-realm.command';
import { Realm } from '@domain/entities/realm';
import { ConflictError, ValidationError } from '@domain/errors/errors';
import { RealmRepository } from '@domain/ports/realm-repository';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateRealmUseCase {
  constructor(@inject('RealmRepository') private readonly realmRepository: RealmRepository) {}

  async execute(command: CreateRealmCommand): Promise<Realm> {
    this.validate(command);
    const exists = await this.realmRepository.findById(command.id);
    if (exists) {
      throw new ConflictError(`Realm ${command.id} already exists`);
    }
    const realm: Partial<Realm> = { ...command, createdAt: new Date() };
    return await this.realmRepository.save(realm);
  }

  validate(command: CreateRealmCommand): void {
    if(!command.id) throw new ValidationError('Required realm id');
    if(!command.username) throw new ValidationError('Required username');
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
