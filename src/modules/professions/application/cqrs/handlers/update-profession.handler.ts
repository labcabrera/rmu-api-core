import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { Profession } from 'src/modules/professions/domain/aggregates/profession';
import type { ProfessionRepository } from '../../ports/profession.repository';
import type { ProfessionGuardPort } from '../../ports/profession-guard.port';
import { UpdateProfessionCommand } from '../commands/update-profession.command';

@CommandHandler(UpdateProfessionCommand)
export class UpdateProfessionHandler implements ICommandHandler<UpdateProfessionCommand, Profession> {
  constructor(
    @Inject('ProfessionRepository') private readonly professionRepository: ProfessionRepository,
    @Inject('ProfessionGuardPort') private readonly professionGuard: ProfessionGuardPort,
  ) {}

  async execute(command: UpdateProfessionCommand): Promise<Profession> {
    const current = await this.professionRepository.findById(command.id);
    if (!current) throw new NotFoundError('Profession', command.id);

    this.professionGuard.checkUpdate(current, command.userId, command.roles);

    current.update({
      archetype: command.archetype,
      skillCosts: command.skillCosts,
      availableRealmTypes: command.availableRealmTypes,
      fixedRealmTypes: command.fixedRealmTypes,
      professionalSkills: command.professionalSkills,
      description: command.description,
      imageUrl: command.imageUrl,
    });
    return await this.professionRepository.update(current.id, current);
  }
}
