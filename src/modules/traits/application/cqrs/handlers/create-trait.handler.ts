import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTraitCommand } from '../commands/create-trait.command';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';
import type { TraitRepository } from '../../ports/trait.repository';
import type { TraitEventBusPort } from '../../ports/trait-event-bus.port';
import { ConflictError } from 'src/modules/shared/domain/errors/errors';

@CommandHandler(CreateTraitCommand)
export class CreateTraitHandler implements ICommandHandler<CreateTraitCommand, Trait> {
  private readonly logger = new Logger(CreateTraitHandler.name);

  constructor(
    @Inject('TraitRepository') private readonly traitRepository: TraitRepository,
    @Inject('TraitEventProducer') private readonly traitEventBus: TraitEventBusPort,
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
    trait.getUncommittedEvents().forEach(event => this.traitEventBus.publish(event));
    return savedTrait;
  }
}
