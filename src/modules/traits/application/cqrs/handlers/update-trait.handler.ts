import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from 'src/modules/core/domain/errors/errors';
import { UpdateTraitCommand } from '../commands/update-trait.command';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';
import type { TraitRepository } from '../../ports/trait.repository';
import type { TraitEventBusPort } from '../../ports/trait-event-bus.port';

@CommandHandler(UpdateTraitCommand)
export class UpdateTraitHandler implements ICommandHandler<UpdateTraitCommand, Trait> {
  constructor(
    @Inject('TraitRepository') private readonly traitRepository: TraitRepository,
    @Inject('TraitEventProducer') private readonly traitEventBus: TraitEventBusPort,
  ) {}

  async execute(command: UpdateTraitCommand): Promise<Trait> {
    const trait = await this.traitRepository.findById(command.id);
    if (!trait) {
      throw new NotFoundError('Trait', command.id);
    }
    trait.update({
      category: command.category,
      isTalent: command.isTalent,
      requiresSpecialization: command.requiresSpecialization,
      isTierBased: command.isTierBased,
      maxTier: command.maxTier,
      adquisitionCost: command.adquisitionCost,
      tierCost: command.tierCost,
      description: command.description,
    });
    const updated = await this.traitRepository.update(trait.id, trait);
    trait.getUncommittedEvents().forEach((event) => this.traitEventBus.publish(event));
    return updated;
  }
}
