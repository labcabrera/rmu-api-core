import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictError } from 'src/modules/shared/domain/errors/errors';
import { CreateProfessionCommand } from '../commands/create-profession.command';
import { Profession } from 'src/modules/professions/domain/aggregates/profession';
import type { ProfessionRepository } from '../../ports/profession.repository';
import type { ProfessionGuardPort } from '../../ports/profession-guard.port';
import { RMU_ADMIN } from 'src/modules/shared/domain/entities/user-roles';

@CommandHandler(CreateProfessionCommand)
export class CreateProfessionHandler implements ICommandHandler<CreateProfessionCommand, Profession> {
  constructor(
    @Inject('ProfessionRepository') private readonly professionRepository: ProfessionRepository,
    @Inject('ProfessionGuardPort') private readonly professionGuard: ProfessionGuardPort,
  ) {}

  async execute(command: CreateProfessionCommand): Promise<Profession> {
    this.professionGuard.checkCreate(command.roles);

    const current = await this.professionRepository.findById(command.id);
    if (current) throw new ConflictError(`Profession with id ${command.id} already exists`);

    const entitySource = command.roles.includes(RMU_ADMIN) ? 'system' : 'user';

    const profession = Profession.create({
      id: command.id,
      archetype: command.archetype,
      availableRealmTypes: command.availableRealmTypes,
      fixedRealmTypes: command.fixedRealmTypes,
      skillCosts: command.skillCosts,
      professionalSkills: command.professionalSkills,
      entitySource: entitySource,
      description: command.description,
      imageUrl: command.imageUrl,
      owner: command.userId,
    });
    return await this.professionRepository.save(profession);
  }
}
