import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { DeleteTraitCommand } from '../commands/delete-trait.command.js';
import { TraitDeletedEvent } from '../../../domain/events/trait-deleted.event.js';
import type { TraitRepository } from '../../ports/trait.repository.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import type { TraitGuardPort } from '../../ports/trait-guard.port.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.js';

@CommandHandler(DeleteTraitCommand)
export class DeleteTraitHandler implements ICommandHandler<DeleteTraitCommand> {
  private readonly logger = new Logger(DeleteTraitHandler.name);

  constructor(
    @Inject('TraitRepository') private readonly traitRepository: TraitRepository,
    @Inject('TraitGuardPort') private readonly traitGuard: TraitGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: DeleteTraitCommand): Promise<void> {
    this.logger.log(`Deleting trait ${command.id}`);
    const trait = await this.traitRepository.findById(command.id);
    if (!trait) {
      throw new NotFoundError('Trait', command.id);
    }
    this.traitGuard.checkDelete(trait, command.userId, command.roles ?? []);
    const deleted = await this.traitRepository.deleteById(command.id);
    if (!deleted) {
      throw new NotFoundError('Trait', command.id);
    }
    await this.events.publish('trait', new TraitDeletedEvent(deleted.getProps()));
  }
}
