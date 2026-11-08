import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { REALM_REPOSITORY, type RealmRepository } from '../../ports/realm-repository.port.js';
import { RenameShareUserCommand } from '../commands/rename-share-user.command.js';

@CommandHandler(RenameShareUserCommand)
export class RenameShareUserHandler implements ICommandHandler<RenameShareUserCommand, void> {
  constructor(@Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository) {}

  async execute(command: RenameShareUserCommand): Promise<void> {
    await this.realmRepository.renameShareUser(command.userId, command.name);
  }
}
