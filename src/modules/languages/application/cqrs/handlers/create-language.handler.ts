import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Language } from '../../../domain/aggregates/language';
import type { LanguageEventBusPort } from '../../ports/language-event-bus.port';
import { CreateLanguageCommand } from '../commands/create-language.command';
import type { LanguageRepository } from '../../ports/language-repository';
import type { RealmRepository } from 'src/modules/realms/application/ports/realm-repository';
import { ValidationError } from 'src/modules/shared/domain/errors/errors';
import { NamedEntity } from 'src/modules/shared/domain/entities/named-entity';
import type { LanguageGuardPort } from '../../ports/language-guard.port';

@CommandHandler(CreateLanguageCommand)
export class CreateLanguageHandler implements ICommandHandler<CreateLanguageCommand, Language> {
  private readonly logger = new Logger(CreateLanguageHandler.name);

  constructor(
    @Inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @Inject('LanguageRepository') private readonly languageRepository: LanguageRepository,
    @Inject('LanguageGuardPort') private readonly languageGuardPort: LanguageGuardPort,
    @Inject('LanguageEventProducer') private readonly languageEventBus: LanguageEventBusPort,
  ) {}

  async execute(command: CreateLanguageCommand): Promise<Language> {
    this.logger.log(`Creating Language ${command.name} for user ${command.userId}`);
    this.languageGuardPort.checkCreate(command.roles);

    const realm = await this.realmRepository.findById(command.realmId);
    if (!realm) throw new ValidationError(`Realm with id ${command.realmId} not found`);

    const language = Language.create({
      name: command.name,
      realm: new NamedEntity(realm.id, realm.name),
      description: command.description,
      owner: command.userId,
    });
    const savedLanguage = await this.languageRepository.save(language);
    language.getUncommittedEvents().forEach((event) => this.languageEventBus.publish(event));
    return savedLanguage;
  }
}
