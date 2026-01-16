import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTraitCommand } from '../commands/delete-trait.command';
import { TraitDeletedEvent } from 'src/modules/traits/domain/events/trait-deleted.event';
import type { TraitRepository } from '../../ports/trait.repository';
import type { TraitEventBusPort } from '../../ports/trait-event-bus.port';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';

@CommandHandler(DeleteTraitCommand)
export class DeleteTraitHandler implements ICommandHandler<DeleteTraitCommand> {
  private readonly logger = new Logger(DeleteTraitHandler.name);

  constructor(
    @Inject('TraitRepository') private readonly traitRepository: TraitRepository,
    @Inject('TraitEventProducer') private readonly traitEventBus: TraitEventBusPort,
  ) {}

  async execute(command: DeleteTraitCommand): Promise<void> {
    this.logger.log(`Deleting trait ${command.id}`);
    const deleted = await this.traitRepository.deleteById(command.id);
    if (!deleted) {
      throw new NotFoundError('Trait', command.id);
    }
    this.traitEventBus.publish(new TraitDeletedEvent(deleted.getProps()));
  }
}
