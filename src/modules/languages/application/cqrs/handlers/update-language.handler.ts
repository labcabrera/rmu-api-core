import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Language } from '../../../domain/aggregates/language';
import { NotFoundError } from 'src/modules/core/domain/errors/errors';
import { UpdateLanguageCommand } from '../commands/update-language.command';
import type { LanguageEventBusPort } from '../../ports/language-event-bus.port';
import type { LanguageRepository } from '../../ports/language-repository';

@CommandHandler(UpdateLanguageCommand)
export class UpdateLanguageHandler implements ICommandHandler<UpdateLanguageCommand, Language> {
  constructor(
    @Inject('LanguageRepository') private readonly languageRepository: LanguageRepository,
    @Inject('LanguageEventProducer') private readonly languageEventBus: LanguageEventBusPort,
  ) {}

  async execute(command: UpdateLanguageCommand): Promise<Language> {
    const language = await this.languageRepository.findById(command.id);
    if (!language) {
      throw new NotFoundError('Language', command.id);
    }
    language.update(command.name, command.description);
    const updated = await this.languageRepository.update(language.id, language);
    language.getUncommittedEvents().forEach((event) => this.languageEventBus.publish(event));
    return updated;
  }
}
