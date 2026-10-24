import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { UpdateTraitCommand } from '../commands/update-trait.command.js';
import { Trait } from '../../../domain/aggregates/trait.js';
import { TRAIT_REPOSITORY, type TraitRepository } from '../../ports/trait-repository.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { TRAIT_GUARD, type TraitGuardPort } from '../../ports/trait-guard.port.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

@CommandHandler(UpdateTraitCommand)
export class UpdateTraitHandler implements ICommandHandler<UpdateTraitCommand, Trait> {
  constructor(
    @Inject(TRAIT_REPOSITORY) private readonly traitRepository: TraitRepository,
    @Inject(TRAIT_GUARD) private readonly traitGuard: TraitGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: UpdateTraitCommand): Promise<Trait> {
    const trait = await this.traitRepository.findById(command.id);
    if (!trait) {
      throw new NotFoundError('Trait', command.id);
    }
    this.traitGuard.checkUpdate(trait, command.userId, command.roles);
    trait.checkVersion(command.expectedVersion);
    trait.update({
      name: command.name,
      category: command.category,
      isTalent: command.isTalent,
      specialization: command.specialization,
      isTierBased: command.isTierBased,
      maxTier: command.maxTier,
      adquisitionCost: command.adquisitionCost,
      tierCost: command.tierCost,
      description: command.description,
    });
    const updated = await this.traitRepository.update(trait);
    await this.events.publishChanges('trait', trait);
    return updated;
  }
}
