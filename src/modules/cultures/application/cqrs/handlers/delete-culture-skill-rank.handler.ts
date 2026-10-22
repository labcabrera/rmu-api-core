import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { CULTURE_REPOSITORY, type CultureRepository } from '../../ports/culture-repository.port.js';
import { CULTURE_GUARD, type CultureGuardPort } from '../../ports/culture-guard.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { CultureUpdatedEvent } from '../../../domain/events/culture-updated.event.js';
import { DeleteCultureSkillRankCommand } from '../commands/delete-culture-skill-rank.command.js';
import { CultureViewService } from '../../services/culture-view.service.js';
import type { CultureView } from '../../read-models/culture-view.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

@CommandHandler(DeleteCultureSkillRankCommand)
export class DeleteCultureSkillRankHandler implements ICommandHandler<DeleteCultureSkillRankCommand, CultureView> {
  private readonly logger = new Logger(DeleteCultureSkillRankHandler.name);

  constructor(
    @Inject(CULTURE_REPOSITORY) private readonly cultureRepository: CultureRepository,
    @Inject(CULTURE_GUARD) private readonly cultureGuard: CultureGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
    private readonly cultureViewService: CultureViewService,
  ) {}

  async execute(command: DeleteCultureSkillRankCommand): Promise<CultureView> {
    this.logger.log(`Deleting skill rank ${command.index} of culture ${command.cultureId} for user ${command.userId}`);

    const culture = await this.cultureRepository.findById(command.cultureId);
    if (!culture) throw new NotFoundError('Culture', command.cultureId);

    this.cultureGuard.checkUpdate(culture, command.userId, command.roles);

    culture.deleteSkillRank(command.index);

    const updated = await this.cultureRepository.update(command.cultureId, culture);

    await this.events.publish('culture', new CultureUpdatedEvent(updated.getProps()));
    return this.cultureViewService.toView(updated);
  }
}
