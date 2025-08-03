import { DeleteRealmCommand } from '@application/commands/delete-realm.command';
import { RealmRepository } from '@domain/ports/realm-repository';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteRealmUseCase {
  constructor(@inject('RealmRepository') private readonly realmRepository: RealmRepository) {}
  async execute(command: DeleteRealmCommand): Promise<void> {
    return await this.realmRepository.deleteById(command.id);
  }
}
