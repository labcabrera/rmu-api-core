import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { LanguageEventBusPort } from '../../ports/language-event-bus.port';
import type { LanguageRepository } from '../../ports/language-repository';
import type { LanguageGuardPort } from '../../ports/language-guard.port';
import { UpdateLanguageRealmCommand } from '../commands/update-language-realm.command';

@CommandHandler(UpdateLanguageRealmCommand)
export class UpdateLanguageRealmHandler implements ICommandHandler<UpdateLanguageRealmCommand, void> {
  private readonly logger = new Logger(UpdateLanguageRealmHandler.name);

  constructor(
    @Inject('LanguageRepository') private readonly languageRepository: LanguageRepository,
    @Inject('LanguageGuardPort') private readonly languageGuardPort: LanguageGuardPort,
    @Inject('LanguageEventProducer') private readonly languageEventBus: LanguageEventBusPort,
  ) {}

  async execute(command: UpdateLanguageRealmCommand): Promise<void> {
    this.logger.log(`Updating realm ${command.realmId} language info`);
    await this.languageRepository.updateRealmInfo(command.realmId, command.realmName, command.realmOwner, command.realmAccessType);
  }
}
