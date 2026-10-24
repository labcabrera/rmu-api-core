import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { CULTURE_REPOSITORY, type CultureRepository } from '../../ports/culture-repository.port.js';
import { CULTURE_GUARD, type CultureGuardPort } from '../../ports/culture-guard.port.js';
import { AddCultureSkillRankCommand } from '../commands/add-culture-skill-rank.command.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { CultureSkillRank } from '../../../domain/value-objects/culture-skill-rank.js';
import { CultureViewService } from '../../services/culture-view.service.js';
import type { CultureView } from '../../read-models/culture-view.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

@CommandHandler(AddCultureSkillRankCommand)
export class AddCultureSkillRankHandler implements ICommandHandler<AddCultureSkillRankCommand, CultureView> {
  private readonly logger = new Logger(AddCultureSkillRankHandler.name);

  constructor(
    @Inject(CULTURE_REPOSITORY) private readonly cultureRepository: CultureRepository,
    @Inject(CULTURE_GUARD) private readonly cultureGuard: CultureGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
    private readonly cultureViewService: CultureViewService,
  ) {}

  async execute(command: AddCultureSkillRankCommand): Promise<CultureView> {
    this.logger.log(`Adding skill rank to culture ${command.cultureId} for user ${command.userId}`);

    const culture = await this.cultureRepository.findById(command.cultureId);
    if (!culture) throw new NotFoundError('Culture', command.cultureId);

    this.cultureGuard.checkUpdate(culture, command.userId, command.roles);

    culture.addSkillRank(CultureSkillRank.create(command.skillRank));

    // A change that leaves the state as it was neither writes nor publishes (spec 021, decision 9).
    if (!culture.hasChanges()) return this.cultureViewService.toView(culture);
    const updated = await this.cultureRepository.update(culture);

    await this.events.publishChanges('culture', culture);
    return this.cultureViewService.toView(updated);
  }
}
