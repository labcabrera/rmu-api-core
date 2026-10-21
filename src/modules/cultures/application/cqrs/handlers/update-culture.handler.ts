import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { UpdateCultureCommand } from '../commands/update-culture.command.js';
import type { CultureRepository } from '../../ports/culture-repository.js';
import type { CultureGuardPort } from '../../ports/culture-guard.port.js';
import type { CultureEventBusPort } from '../../ports/culture-event-bus.port.js';
import { CultureUpdatedEvent } from '../../../domain/events/culture-updated.event.js';
import { CultureSkillRank } from '../../../domain/value-objects/culture-skill-rank.js';
import { CultureViewService } from '../../services/culture-view.service.js';
import type { CultureView } from '../../read-models/culture-view.js';

@CommandHandler(UpdateCultureCommand)
export class UpdateCultureHandler implements ICommandHandler<UpdateCultureCommand, CultureView> {
  private readonly logger = new Logger(UpdateCultureHandler.name);

  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
    @Inject('CultureEventProducer') private readonly cultureEventBus: CultureEventBusPort,
    private readonly cultureViewService: CultureViewService,
  ) {}

  async execute(command: UpdateCultureCommand): Promise<CultureView> {
    this.logger.log(`Updating culture ${command.id} for user ${command.userId}`);
    const culture = await this.cultureRepository.findById(command.id);
    if (!culture) throw new NotFoundError('Culture', command.id);

    this.cultureGuard.checkUpdate(culture, command.userId, command.roles);

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
    const updated = await this.cultureRepository.update(command.id, culture);
    this.cultureEventBus.publish(new CultureUpdatedEvent(updated.getProps()));
    return this.cultureViewService.toView(updated);
  }
}
