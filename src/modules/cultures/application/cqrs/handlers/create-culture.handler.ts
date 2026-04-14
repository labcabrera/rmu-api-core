import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCultureCommand } from '../commands/create-culture.command';
import { Culture } from 'src/modules/cultures/domain/aggregates/culture';
import type { CultureRepository } from '../../ports/culture-repository';
import type { CultureGuardPort } from '../../ports/culture-guard.port';
import type { CultureEventBusPort } from '../../ports/culture-event-bus.port';
import { CultureCreatedEvent } from 'src/modules/cultures/domain/events/culture-created.event';

@CommandHandler(CreateCultureCommand)
export class CreateCultureHandler implements ICommandHandler<CreateCultureCommand, Culture> {
  private readonly logger = new Logger(CreateCultureHandler.name);

  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
    @Inject('CultureEventProducer') private readonly cultureEventBus: CultureEventBusPort,
  ) {}

  async execute(command: CreateCultureCommand): Promise<Culture> {
    this.logger.log(`Creating culture ${command.name} for user ${command.userId}`);
    this.cultureGuard.checkCreate(command.roles);
    const props = {
      name: command.name,
      description: command.description,
      imageUrl: command.imageUrl,
      owner: command.userId,
      accessType: command.accessType,
    };
    const culture = Culture.create(props);
    await this.cultureRepository.save(culture);
    this.cultureEventBus.publish(new CultureCreatedEvent(culture.getProps()));
    return culture;
  }
}
