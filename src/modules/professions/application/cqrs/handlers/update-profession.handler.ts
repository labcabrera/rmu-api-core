import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { Profession } from '../../../domain/aggregates/profession.js';
import { PROFESSION_REPOSITORY, type ProfessionRepository } from '../../ports/profession-repository.port.js';
import { PROFESSION_GUARD, type ProfessionGuardPort } from '../../ports/profession-guard.port.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';
import { UpdateProfessionCommand } from '../commands/update-profession.command.js';

@CommandHandler(UpdateProfessionCommand)
export class UpdateProfessionHandler implements ICommandHandler<UpdateProfessionCommand, Profession> {
  constructor(
    @Inject(PROFESSION_REPOSITORY) private readonly professionRepository: ProfessionRepository,
    @Inject(PROFESSION_GUARD) private readonly professionGuard: ProfessionGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: UpdateProfessionCommand): Promise<Profession> {
    const current = await this.professionRepository.findById(command.id);
    if (!current) throw new NotFoundError('Profession', command.id);

    this.professionGuard.checkUpdate(current, command.userId, command.roles);

    current.checkVersion(command.expectedVersion);

    current.update({
      archetype: command.archetype,
      skillCosts: command.skillCosts,
      availableRealmTypes: command.availableRealmTypes,
      fixedRealmTypes: command.fixedRealmTypes,
      professionalSkills: command.professionalSkills,
      description: command.description,
      imageUrl: command.imageUrl,
      accessType: command.accessType,
    });
    // A change that leaves the state as it was neither writes nor publishes (spec 021, decision 9).
    if (!current.hasChanges()) return current;
    const updated = await this.professionRepository.update(current);
    await this.events.publishChanges('profession', current);
    return updated;
  }
}
