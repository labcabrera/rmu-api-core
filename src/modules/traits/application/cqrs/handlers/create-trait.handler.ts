import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { CreateTraitCommand } from '../commands/create-trait.command.js';
import { Trait } from '../../../domain/aggregates/trait.js';
import type { TraitRepository } from '../../ports/trait.repository.js';
import { ConflictError } from '../../../../shared/domain/errors/errors.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.js';

@CommandHandler(CreateTraitCommand)
export class CreateTraitHandler implements ICommandHandler<CreateTraitCommand, Trait> {
  private readonly logger = new Logger(CreateTraitHandler.name);

  constructor(
    @Inject('TraitRepository') private readonly traitRepository: TraitRepository,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: CreateTraitCommand): Promise<Trait> {
    this.logger.log(`Creating trait ${command.name} for user ${command.userId}`);
    const trait = Trait.create({
      name: command.name,
      category: command.category,
      isTalent: command.isTalent,
      specialization: command.specialization,
      isTierBased: command.isTierBased,
      maxTier: command.maxTier,
      adquisitionCost: command.adquisitionCost,
      tierCost: command.tierCost,
      description: command.description,
      owner: command.userId,
    });
    const existing = await this.traitRepository.findById(trait.id);
    if (existing) {
      throw new ConflictError(`Trait with id ${trait.id} already exists`);
    }
    const savedTrait = await this.traitRepository.save(trait);
    await this.events.publishChanges('trait', trait);
    return savedTrait;
  }
}
