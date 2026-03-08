import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { ProfessionRepository } from '../../ports/profession.repository';
import type { ProfessionGuardPort } from '../../ports/profession-guard.port';
import { DeleteProfessionCommand } from '../commands/delete-profession.command';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';

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
