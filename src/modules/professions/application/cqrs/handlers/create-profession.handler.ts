import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { ConflictError } from '../../../../shared/domain/errors/errors.js';
import { CreateProfessionCommand } from '../commands/create-profession.command.js';
import { Profession } from '../../../domain/aggregates/profession.js';
import type { ProfessionRepository } from '../../ports/profession.repository.js';
import type { ProfessionGuardPort } from '../../ports/profession-guard.port.js';
import { RMU_ADMIN } from '../../../../shared/domain/entities/user-roles.js';

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
      accessType: command.accessType,
    });
    return await this.professionRepository.save(profession);
  }
}
