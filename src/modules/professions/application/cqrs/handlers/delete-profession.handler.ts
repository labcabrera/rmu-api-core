import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import type { ProfessionRepository } from '../../ports/profession.repository.js';
import type { ProfessionGuardPort } from '../../ports/profession-guard.port.js';
import { DeleteProfessionCommand } from '../commands/delete-profession.command.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';

@CommandHandler(DeleteProfessionCommand)
export class DeleteProfessionHandler implements ICommandHandler<DeleteProfessionCommand, void> {
  constructor(
    @Inject('ProfessionRepository') private readonly professionRepository: ProfessionRepository,
    @Inject('ProfessionGuardPort') private readonly professionGuard: ProfessionGuardPort,
  ) {}

  async execute(command: DeleteProfessionCommand): Promise<void> {
    const current = await this.professionRepository.findById(command.id);
    if (!current) throw new NotFoundError('Profession', command.id);

    this.professionGuard.checkDelete(current, command.userId, command.roles);

    await this.professionRepository.deleteById(command.id);
    //TODO Propagate event
  }
}
