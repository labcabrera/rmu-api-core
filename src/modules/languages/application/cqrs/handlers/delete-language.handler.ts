import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteLanguageCommand } from '../commands/delete-language.command';
import { LanguageDeletedEvent } from 'src/modules/languages/domain/events/language-deleted.event';
import type { LanguageEventBusPort } from '../../ports/language-event-bus.port';
import type { LanguageRepository } from '../../ports/language-repository';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import type { LanguageGuardPort } from '../../ports/language-guard.port';

@CommandHandler(DeleteLanguageCommand)
export class DeleteLanguageHandler implements ICommandHandler<DeleteLanguageCommand> {
  private readonly logger = new Logger(DeleteLanguageHandler.name);

  constructor(
    @Inject('LanguageRepository') private readonly languageRepository: LanguageRepository,
    @Inject('LanguageGuardPort') private readonly languageGuardPort: LanguageGuardPort,
    @Inject('LanguageEventProducer') private readonly languageEventBus: LanguageEventBusPort,
  ) {}

  async execute(command: DeleteLanguageCommand): Promise<void> {
    this.logger.log(`Deleting language ${command.id}`);
    const current = await this.languageRepository.findById(command.id);
    if (!current) throw new NotFoundError('Language', command.id);

    this.languageGuardPort.checkDelete(current, command.userId, command.roles);

    const deleted = await this.languageRepository.deleteById(command.id);
    if (!deleted) throw new NotFoundError('Language', command.id);

    this.languageEventBus.publish(new LanguageDeletedEvent(deleted));
  }
}
