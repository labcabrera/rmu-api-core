import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { UpdateCultureCommand } from '../commands/update-culture.command.js';
import { CULTURE_REPOSITORY, type CultureRepository } from '../../ports/culture-repository.port.js';
import { CULTURE_GUARD, type CultureGuardPort } from '../../ports/culture-guard.port.js';
import { CultureSkillRank } from '../../../domain/value-objects/culture-skill-rank.js';
import { CultureViewService } from '../../services/culture-view.service.js';
import type { CultureView } from '../../read-models/culture-view.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

@CommandHandler(UpdateCultureCommand)
export class UpdateCultureHandler implements ICommandHandler<UpdateCultureCommand, CultureView> {
  private readonly logger = new Logger(UpdateCultureHandler.name);

  constructor(
    @Inject(CULTURE_REPOSITORY) private readonly cultureRepository: CultureRepository,
    @Inject(CULTURE_GUARD) private readonly cultureGuard: CultureGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
    private readonly cultureViewService: CultureViewService,
  ) {}

  async execute(command: UpdateCultureCommand): Promise<CultureView> {
    this.logger.log(`Updating culture ${command.id} for user ${command.userId}`);
    const culture = await this.cultureRepository.findById(command.id);
    if (!culture) throw new NotFoundError('Culture', command.id);

    this.cultureGuard.checkUpdate(culture, command.userId, command.roles);

    culture.checkVersion(command.expectedVersion);

    culture.update({
      name: command.name,
      description: command.description,
      imageUrl: command.imageUrl,
      accessType: command.accessType,
      skillRanks: command.skillRanks?.map(s => CultureSkillRank.create(s)),
      languages: command.languages,
      suggestedCrafts: command.suggestedCrafts,
      suggestedVocations: command.suggestedVocations,
    });
    // A change that leaves the state as it was neither writes nor publishes (spec 021, decision 9).
    if (!culture.hasChanges()) return this.cultureViewService.toView(culture);
    const updated = await this.cultureRepository.update(culture);
    await this.events.publishChanges('culture', culture);
    return this.cultureViewService.toView(updated);
  }
}
