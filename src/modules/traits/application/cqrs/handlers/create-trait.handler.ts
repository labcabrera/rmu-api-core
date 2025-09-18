import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTraitCommand } from '../commands/create-trait.command';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';
import type { TraitRepository } from '../../ports/trait.repository';
import type { TraitEventBusPort } from '../../ports/trait-event-bus.port';

@CommandHandler(CreateTraitCommand)
export class CreateTraitHandler implements ICommandHandler<CreateTraitCommand, Trait> {
  private readonly logger = new Logger(CreateTraitHandler.name);

  constructor(
    @Inject('TraitRepository') private readonly traitRepository: TraitRepository,
    @Inject('TraitEventProducer') private readonly traitEventBus: TraitEventBusPort,
  ) {}

  async execute(command: CreateTraitCommand): Promise<Trait> {
    this.logger.log(`Creating trait ${command.name} for user ${command.userId}`);
    const trait = Trait.create(command.name, command.description, command.userId);
    const savedTrait = await this.traitRepository.save(trait);
    trait.getUncommittedEvents().forEach((event) => this.traitEventBus.publish(event));
    return savedTrait;
  }
}
