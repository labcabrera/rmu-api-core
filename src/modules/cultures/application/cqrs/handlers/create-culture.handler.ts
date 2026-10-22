import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { CreateCultureCommand } from '../commands/create-culture.command.js';
import { Culture } from '../../../domain/aggregates/culture.js';
import { CULTURE_REPOSITORY, type CultureRepository } from '../../ports/culture-repository.port.js';
import { CULTURE_GUARD, type CultureGuardPort } from '../../ports/culture-guard.port.js';
import type { CreateCultureProps } from '../../../domain/aggregates/culture-props.js';
import { CultureSkillRank } from '../../../domain/value-objects/culture-skill-rank.js';
import { CultureViewService } from '../../services/culture-view.service.js';
import type { CultureView } from '../../read-models/culture-view.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

@CommandHandler(CreateCultureCommand)
export class CreateCultureHandler implements ICommandHandler<CreateCultureCommand, CultureView> {
  private readonly logger = new Logger(CreateCultureHandler.name);

  constructor(
    @Inject(CULTURE_REPOSITORY) private readonly cultureRepository: CultureRepository,
    @Inject(CULTURE_GUARD) private readonly cultureGuard: CultureGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
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
    await this.events.publishChanges('culture', culture);
    return this.cultureViewService.toView(culture);
  }
}
