import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { DeleteCultureCommand } from '../commands/delete-culture.command.js';
import type { CultureRepository } from '../../ports/culture-repository.js';
import type { CultureGuardPort } from '../../ports/culture-guard.port.js';
import { CultureDeletedEvent } from '../../../domain/events/culture-deleted.event.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.js';

@CommandHandler(DeleteCultureCommand)
export class DeleteCultureHandler implements ICommandHandler<DeleteCultureCommand> {
  private readonly logger = new Logger(DeleteCultureHandler.name);

  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: DeleteCultureCommand): Promise<void> {
    this.logger.log(`Deleting culture ${command.id} for user ${command.userId}`);

    const culture = await this.cultureRepository.findById(command.id);
    if (!culture) throw new NotFoundError('Culture', command.id);

    this.cultureGuard.checkDelete(culture, command.userId, command.roles);

    await this.cultureRepository.deleteById(command.id);
    await this.events.publish('culture', new CultureDeletedEvent(culture.getProps()));
  }
}
