import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Language } from '../../../domain/aggregates/language';
import type { LanguageEventBusPort } from '../../ports/language-event-bus.port';
import { CreateLanguageCommand } from '../commands/create-language.command';
import type { LanguageRepository } from '../../ports/language-repository';

@CommandHandler(CreateLanguageCommand)
export class CreateLanguageHandler implements ICommandHandler<CreateLanguageCommand, Language> {
  private readonly logger = new Logger(CreateLanguageHandler.name);

  constructor(
    @Inject('LanguageRepository') private readonly languageRepository: LanguageRepository,
    @Inject('LanguageEventProducer') private readonly languageEventBus: LanguageEventBusPort,
  ) {}

  async execute(command: CreateLanguageCommand): Promise<Language> {
    this.logger.log(`Creating Language ${command.name} for user ${command.userId}`);
    const language = Language.create({
      name: command.name,
      description: command.description,
      owner: command.userId,
    });
    const savedLanguage = await this.languageRepository.save(language);
    language.getUncommittedEvents().forEach((event) => this.languageEventBus.publish(event));
    return savedLanguage;
  }
}
