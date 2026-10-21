import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCultureCommand } from '../commands/create-culture.command';
import { Culture } from '../../../domain/aggregates/culture';
import type { CultureRepository } from '../../ports/culture-repository';
import type { CultureGuardPort } from '../../ports/culture-guard.port';
import type { CultureEventBusPort } from '../../ports/culture-event-bus.port';
import { CultureCreatedEvent } from '../../../domain/events/culture-created.event';
import { CreateCultureProps } from '../../../domain/aggregates/culture-props';
import { CultureSkillRank } from '../../../domain/value-objects/culture-skill-rank';
import { CultureViewService } from '../../services/culture-view.service';
import { CultureView } from '../../read-models/culture-view';

@CommandHandler(CreateCultureCommand)
export class CreateCultureHandler implements ICommandHandler<CreateCultureCommand, CultureView> {
  private readonly logger = new Logger(CreateCultureHandler.name);

  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
    @Inject('CultureEventProducer') private readonly cultureEventBus: CultureEventBusPort,
    private readonly cultureViewService: CultureViewService,
  ) {}

  async execute(command: CreateCultureCommand): Promise<CultureView> {
    this.logger.log(`Creating culture ${command.name} for user ${command.userId}`);
    this.cultureGuard.checkCreate(command.roles);
    const props: CreateCultureProps = {
      name: command.name,
      description: command.description,
      imageUrl: command.imageUrl,
      owner: command.userId,
      accessType: command.accessType,
      skillRanks: (command.skillRanks ?? []).map(s => CultureSkillRank.create(s)),
      languages: command.languages,
      suggestedCrafts: command.suggestedCrafts,
      suggestedVocations: command.suggestedVocations,
    };
    const culture = Culture.create(props);
    await this.cultureRepository.save(culture);
    this.cultureEventBus.publish(new CultureCreatedEvent(culture.getProps()));
    return this.cultureViewService.toView(culture);
  }
}
